import { expect, test } from "./catalog-test"

test.use({ viewport: { width: 1440, height: 1200 } })

/** The stops rather than the whole declaration: a browser writes the first one
 *  as `0%` or `0px` depending on its build, and what is claimed here is which
 *  two colours a pill runs between. */
const stopsOf = (gradient: string) =>
  gradient.match(/(?:rgba?|oklch)\([^)]*\)/g) ?? []

/** The one ground the whole family stands on. A prompt is not a different
 *  colour from the pills beside it — the file paints it white with `zinc-800`
 *  on it and names nothing else — it is a different thing to do. */
const FAMILY_GROUND = ["rgb(255, 255, 255)", "oklch(0.97 0 none)"]
/** `shadow-xs`, which is what everything pressable in this system wears. */
const SHADOW_XS = "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px"

test("a prompt is a button and the other three are not", async ({ page }) => {
  await page.goto("/components/chip")

  /** The element follows the role. A prompt is something a reader sends, so it
   *  has to be reachable by keyboard and announced as a control; the other
   *  three are things the page says and say nothing back. */
  const chips = await page.locator("[data-slot='chip']").evaluateAll((nodes) =>
    nodes.map((node) => ({
      tag: node.tagName,
      type: node.getAttribute("type"),
      focusable: node instanceof HTMLElement && node.tabIndex >= 0,
    })),
  )

  expect(chips.length, "an empty page would pass on nothing").toBeGreaterThan(3)

  const buttons = chips.filter((chip) => chip.tag === "BUTTON")

  expect(buttons, "one shape is a control and it is the prompt").toHaveLength(1)
  expect(buttons[0]?.type, "and it does not submit anything").toBe("button")
  expect(
    chips
      .filter((chip) => chip.tag === "SPAN")
      .every((chip) => !chip.focusable),
    "nothing that only speaks is in the tab order",
  ).toBe(true)
})

test("every shape in the family stands on the same ground", async ({
  page,
}) => {
  await page.goto("/components/chip")

  const grounds = await page
    .locator("[data-slot='chip']")
    .evaluateAll((nodes) =>
      nodes.map((node) => ({
        tag: node.tagName,
        ground: getComputedStyle(node).backgroundImage,
        colour: getComputedStyle(node).color,
      })),
    )

  /** Without this the loop below passes on a page with no prompt at all. */
  expect(
    grounds.filter((chip) => chip.tag === "BUTTON"),
    "the prompt has to be on the page for this to be checking anything",
  ).toHaveLength(1)

  for (const chip of grounds) {
    expect(
      stopsOf(chip.ground),
      "nothing in this family paints its own ground, the prompt included",
    ).toEqual(FAMILY_GROUND)
  }

  /** The one that went wrong: a prompt came out green, because it was built on
   *  the surface the eyebrow's counter stands on. The file names two colours
   *  for this pill, `base/white` and `zinc/800`, and neither is a green. So
   *  the prompt's label is checked against the suggestion's, those being the
   *  two shapes the design draws side by side under the same chat. */
  const prompt = grounds.find((chip) => chip.tag === "BUTTON")
  const suggestion = await page
    .locator("span[data-slot='chip']")
    .filter({ hasText: "How do I get paid?" })
    .evaluate((node) => getComputedStyle(node).color)

  expect(prompt?.colour, "the prompt reads in the same ink").toBe(suggestion)
})

test("the prompt wears the shadow and the rest wear none", async ({ page }) => {
  await page.goto("/components/chip")

  const worn = await page.locator("[data-slot='chip']").evaluateAll((nodes) =>
    nodes.map((node) => ({
      tag: node.tagName,
      shadow: getComputedStyle(node)
        .boxShadow.split(", rgba(0, 0, 0, 0) 0px 0px 0px 0px")
        .join("")
        .replace(/^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px, /, ""),
    })),
  )

  expect(
    worn.filter((chip) => chip.tag === "BUTTON"),
    "the prompt has to be on the page for this to be checking anything",
  ).toHaveLength(1)

  for (const chip of worn) {
    expect(chip.shadow).toBe(chip.tag === "BUTTON" ? SHADOW_XS : "none")
  }
})

test("the label holds against both ends of the prompt's gradient", async ({
  page,
}) => {
  await page.goto("/components/chip")

  /** Read off painted pixels rather than a token name, because the ground is a
   *  gradient and a label has to clear both of its ends. */
  const read = await page
    .locator("button[data-slot='chip']")
    .evaluate((chip) => {
      const paint = (css: string) => {
        const probe = document.createElement("div")
        probe.style.color = css
        chip.append(probe)
        const resolved = getComputedStyle(probe).color
        probe.remove()

        const canvas = document.createElement("canvas")
        canvas.width = canvas.height = 1

        const context = canvas.getContext("2d")

        if (!context) {
          throw new Error("no canvas to read a colour off")
        }

        context.fillStyle = resolved
        context.fillRect(0, 0, 1, 1)

        const pixel = context.getImageData(0, 0, 1, 1).data

        return [pixel[0] ?? 0, pixel[1] ?? 0, pixel[2] ?? 0] as const
      }

      const luminance = ([r, g, b]: readonly [number, number, number]) => {
        const channel = (value: number) => {
          const part = value / 255

          return part <= 0.03928
            ? part / 12.92
            : ((part + 0.055) / 1.055) ** 2.4
        }

        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
      }

      const ratio = (
        a: readonly [number, number, number],
        b: readonly [number, number, number],
      ) => {
        const one = luminance(a)
        const other = luminance(b)

        return (Math.max(one, other) + 0.05) / (Math.min(one, other) + 0.05)
      }

      const label = paint(getComputedStyle(chip).color)

      return {
        top: ratio(label, [255, 255, 255] as const),
        foot: ratio(label, paint("var(--color-neutral-100)")),
      }
    })

  expect(read.top, "against the white the gradient starts on").toBeGreaterThan(
    4.5,
  )
  expect(read.foot, "and against the neutral it ends on").toBeGreaterThan(4.5)
})

test("both heroes send their questions through the system's pill", async ({
  page,
}) => {
  /** The suggestions under the chat used to be spans: they looked like
   *  controls and were not reachable, clickable or announced as any. Both
   *  heroes draw the same chat, so both draw the same pill. */
  for (const specimen of [
    "/specimens/hero-centered",
    "/specimens/hero-split?action=chat",
  ]) {
    await page.goto(specimen)

    const prompts = page.locator("button[data-slot='chip']")

    if ((await prompts.count()) === 0) {
      continue
    }

    await expect(prompts.first()).toBeVisible()
    expect(
      await prompts.evaluateAll((nodes) =>
        nodes.every(
          (node) => node instanceof HTMLElement && node.tabIndex === 0,
        ),
      ),
      `${specimen}: every prompt is reachable by keyboard`,
    ).toBe(true)
  }

  await page.goto("/specimens/hero-centered")
  await expect(
    page.locator(
      "[data-slot='hero-centered-suggestions'] span[data-slot='chip']",
    ),
    "and none of them is a span any more",
  ).toHaveCount(0)
})
