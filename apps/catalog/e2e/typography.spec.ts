import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

const PAGE = "/getting-started/typography"

type Reading = {
  role: string
  size: number
  leading: number
  weight: string
  face: string
  badgeSize: string
  badgeLeading: string
  badgeWeight: string
}

/** Reads every specimen out of the frames, both what it renders and what its
 *  badges claim, so the two can be compared against each other. */
async function readSpecimens(page: Page) {
  const frames = page
    .frames()
    .filter((frame) => frame.url().includes("/specimens/typography"))

  const readings: Reading[] = []

  for (const frame of frames) {
    readings.push(
      ...(await frame.locator("[data-specimen]").evaluateAll((nodes) =>
        nodes.map((node) => {
          const style = getComputedStyle(node)
          const size = parseFloat(style.fontSize)
          const badge = (name: string) =>
            [
              ...(node.parentElement?.querySelectorAll("[data-slot=badge]") ??
                []),
            ]
              .map((element) => element.textContent)
              .find((text) => text.startsWith(name))
              ?.replace(`${name}: `, "")

          return {
            role: node.getAttribute("data-specimen") ?? "",
            size,
            leading: parseFloat(
              (parseFloat(style.lineHeight) / size).toFixed(3),
            ),
            weight: style.fontWeight,
            face: style.fontFamily.split(",")[0]?.replace(/"/g, "") ?? "",
            badgeSize: badge("Font Size") ?? "",
            badgeLeading: badge("Line Height") ?? "",
            badgeWeight: badge("Weight") ?? "",
          }
        }),
      )),
    )
  }

  return readings
}

const WIDTHS = { Desktop: 1440, Tablet: 810, Mobile: 390 } as const

/** The tab flips its own state at once; what every assertion below reads is the
 *  width the frames actually take, which arrives a beat later. Waiting on that
 *  rather than on a duration is the difference between a condition and a guess
 *  about how fast the machine is.
 *
 *  Deliberately the cause and not the effect: waiting until the badges agree
 *  with their samples would make the spec that asserts exactly that agreement
 *  true by construction. */
async function choose(page: Page, viewport: "Desktop" | "Tablet" | "Mobile") {
  await page.getByRole("button", { name: viewport }).click()
  await expect(page.getByRole("button", { name: viewport })).toHaveAttribute(
    "aria-pressed",
    "true",
  )

  await expect
    .poll(async () => {
      const widths = await Promise.all(
        page
          .frames()
          .filter((frame) => frame.url().includes("/specimens/typography"))
          .map((frame) =>
            frame
              .evaluate(() => document.documentElement.clientWidth)
              .catch(() => 0),
          ),
      )

      return widths.every((width) => width === WIDTHS[viewport])
    })
    .toBe(true)
}

test("every badge reports what its own sample renders", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  for (const viewport of ["Desktop", "Tablet", "Mobile"] as const) {
    await choose(page, viewport)
    const readings = await readSpecimens(page)
    expect(readings.length, viewport).toBe(8)

    for (const reading of readings) {
      expect(reading.badgeSize, `${reading.role} at ${viewport}`).toBe(
        `${String(Math.round(reading.size))}px`,
      )
      expect(reading.badgeLeading).toBe(String(reading.leading))
      expect(reading.badgeWeight).toBe(reading.weight)
    }
  }
})

test("the frame is a viewport, so the fluid roles actually change", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const sizes = async () => {
    const readings = await readSpecimens(page)
    return Object.fromEntries(
      readings.map((reading) => [reading.role, Math.round(reading.size)]),
    )
  }

  await choose(page, "Desktop")
  await expect.poll(sizes).toMatchObject({ display: 60, h1: 42, h2: 36 })

  /** h1 is drawn at all three widths and its points are not collinear, so the
   *  middle one is the assertion that matters: a single straight line through
   *  the ends lands here on 35. */
  await choose(page, "Tablet")
  await expect.poll(sizes).toMatchObject({ h1: 36, h2: 30 })

  await choose(page, "Mobile")
  await expect
    .poll(sizes, {
      message: "narrowing an ordinary container would leave these untouched",
    })
    .toMatchObject({ display: 36, h1: 30, h2: 30 })
})

test("the five fixed roles do not move between viewports", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)
  const fixed = ["h3", "body-lg", "body", "caption", "label"]

  const readFixed = async () => {
    const readings = await readSpecimens(page)
    return readings
      .filter((reading) => fixed.includes(reading.role))
      .map((reading) => `${reading.role}:${String(Math.round(reading.size))}`)
  }

  await choose(page, "Desktop")
  const wide = await readFixed()

  await choose(page, "Mobile")

  expect(
    await readFixed(),
    "a fixed role changing size would be the bug",
  ).toEqual(wide)
})

test("the frames follow the catalog theme after they have loaded", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const framesInDark = () =>
    page.evaluate(() =>
      [...document.querySelectorAll("iframe")].map(
        (frame) =>
          frame.contentDocument?.documentElement.classList.contains("dark") ??
          null,
      ),
    )

  expect(await framesInDark()).toEqual([false, false, false])

  await page.getByRole("button", { name: "Toggle color theme" }).click()

  await expect
    .poll(framesInDark, {
      message: "a frame loaded in light never hears the toggle on its own",
    })
    .toEqual([true, true, true])
})

test("every sample fits the part of the frame the column can show", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  for (const viewport of ["Desktop", "Tablet", "Mobile"] as const) {
    await choose(page, viewport)

    const clipped = await page.evaluate(() => {
      const found: string[] = []

      for (const frame of document.querySelectorAll("iframe")) {
        const visible = frame.parentElement?.clientWidth ?? 0
        const document_ = frame.contentDocument

        for (const sample of document_?.querySelectorAll("[data-specimen]") ??
          []) {
          const range = document_?.createRange()
          range?.selectNodeContents(sample)
          const reach = Math.max(
            ...[...(range?.getClientRects() ?? [])].map((rect) => rect.right),
          )

          if (reach > visible) {
            found.push(
              `${sample.getAttribute("data-specimen") ?? ""} reaches ${String(Math.round(reach))} of ${String(visible)}`,
            )
          }
        }
      }

      return found
    })

    expect(clipped, viewport).toEqual([])
  }
})

test("the sample panels open and close on the same amount of space", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  for (const viewport of ["Desktop", "Tablet", "Mobile"] as const) {
    await choose(page, viewport)

    const padding = await page.evaluate(() =>
      [...document.querySelectorAll("iframe")].map((frame) => {
        const list = frame.contentDocument?.querySelector("ul")
        const items = [...(list?.children ?? [])]
        const box = list?.getBoundingClientRect()

        return {
          top: Math.round(
            (items.at(0)?.getBoundingClientRect().top ?? 0) - (box?.top ?? 0),
          ),
          bottom: Math.round(
            (box?.bottom ?? 0) -
              (items.at(-1)?.getBoundingClientRect().bottom ?? 0),
          ),
        }
      }),
    )

    for (const panel of padding) {
      expect(panel.bottom, `${viewport}: a lopsided panel is the bug`).toBe(
        panel.top,
      )
    }
  }
})

test("headings are set in the serif and everything else in the sans", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const readings = await readSpecimens(page)
  const serif = readings.filter((r) => r.face === "Hedvig Letters Serif")
  const sans = readings.filter((r) => r.face === "Rethink Sans")

  expect(
    serif.map((r) => r.role),
    "a fallback face here would mean the display font never reached the frame",
  ).toEqual(["display", "h1", "h2"])
  expect(sans.map((r) => r.role)).toEqual([
    "h3",
    "body-lg",
    "body",
    "caption",
    "label",
  ])
})
