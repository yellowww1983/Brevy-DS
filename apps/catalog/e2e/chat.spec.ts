import { expect, test } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 1400 } })

const PAGE = "/components/chat"

/** The frames, in the order the page shows them: empty, then holding a
 *  message. Each is a document of its own at the width the tabs are on. */
const empty = (page: import("@playwright/test").Page) =>
  page.locator("figure[data-measures]").first()
const ready = (page: import("@playwright/test").Page) =>
  page.locator("figure[data-measures]").nth(1)

const card = (frame: ReturnType<typeof empty>) =>
  frame.locator("iframe").contentFrame().locator("[data-slot='chat']")

test("the card takes the width the container gives it at every tab", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  for (const tab of ["Desktop", "Tablet", "Mobile"]) {
    await page.getByRole("button", { name: tab, exact: true }).click()
    await measured(page)

    const read = await card(empty(page)).evaluate((element) => {
      const style = getComputedStyle(element)
      const before = getComputedStyle(element, "::before")
      const field = element.querySelector("textarea")

      if (!field) {
        throw new Error("the card is missing its field")
      }

      const fieldStyle = getComputedStyle(field)

      return {
        document: element.ownerDocument.documentElement.clientWidth,
        width: Math.round(element.getBoundingClientRect().width),
        height: Math.round(element.getBoundingClientRect().height),
        background: style.backgroundColor,
        radius: style.borderRadius,
        padding: [
          style.paddingTop,
          style.paddingRight,
          style.paddingBottom,
          style.paddingLeft,
        ].join(" "),
        shadow: style.boxShadow,
        hairline: before.backgroundImage,
        font: `${fieldStyle.fontSize}/${fieldStyle.lineHeight}`,
      }
    })

    /** What the card is owed, derived from the width the frame actually
     *  stands at: the column is the document less both gutters, and the card
     *  is the hero's 794 or the column, whichever is smaller. At the three
     *  drawn widths that comes to 794, 762 and 358. */
    const gutter = read.document >= 1440 ? 120 : read.document >= 810 ? 24 : 16
    const owed = Math.min(794, read.document - 2 * gutter)

    expect(read.width, `${tab}: the card on the container's column`).toBe(owed)
    expect(
      read.height,
      `${tab}: one line high, the height is the content's`,
    ).toBe(104)
    expect(read.background).toBe("rgb(255, 255, 255)")
    expect(read.radius).toBe("16px")
    expect(read.padding).toBe("16px 8px 8px 16px")
    expect(read.shadow, "the drawn pair is shadow-lg").toContain(
      "0px 10px 15px",
    )
    expect(read.shadow).toContain("0px 4px 6px")
    expect(read.hairline, "the card wears the hairline").toContain(
      "linear-gradient",
    )
    expect(read.font).toBe("16px/24px")
  }
})

test("the three tabs are the drawn widths and nothing else", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const widths: number[] = []

  for (const tab of ["Desktop", "Tablet", "Mobile"]) {
    await page.getByRole("button", { name: tab, exact: true }).click()
    await measured(page)
    widths.push(
      await card(empty(page)).evaluate((element) =>
        Math.round(element.getBoundingClientRect().width),
      ),
    )
  }

  expect(widths, "the file's 794, 762 and 358").toEqual([794, 762, 358])
})

test("the resting send is the drawn sage with its three-layer light", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await card(empty(page)).evaluate((element) => {
    const button = element.querySelector("[data-slot='button']")
    const icon = element.querySelector("svg")

    if (!button || !icon) {
      throw new Error("the card is missing its send")
    }

    const style = getComputedStyle(button)
    const box = button.getBoundingClientRect()
    const frame = element.getBoundingClientRect()

    return {
      width: Math.round(box.width),
      height: Math.round(box.height),
      right: Math.round(frame.right - box.right),
      bottom: Math.round(frame.bottom - box.bottom),
      background: style.backgroundColor,
      border: style.borderColor,
      radius: style.borderRadius,
      shadow: style.boxShadow,
      iconColor: getComputedStyle(icon).color,
      iconStroke: getComputedStyle(icon).strokeWidth,
      iconSize: Math.round(icon.getBoundingClientRect().width),
    }
  })

  expect(read.width, "the default size's square").toBe(48)
  expect(read.height).toBe(48)
  expect(read.right, "pinned to the drawn corner").toBe(8)
  expect(read.bottom).toBe(8)
  expect(read.background, "olive-500").toBe("rgb(215, 228, 201)")
  expect(read.border, "olive-600").toBe("rgb(184, 199, 170)")
  expect(read.radius).toBe("9999px")
  expect(read.shadow, "the wide lime glow").toContain("26px")
  expect(read.shadow, "the inner shade that rounds the face").toContain("inset")
  expect(read.iconColor, "the arrow in the deep green").toBe("rgb(2, 54, 32)")
  expect(read.iconStroke, "on the icon grid's own stroke").toBe("1.5px")
  expect(read.iconSize).toBe(24)
})

test("holding a message, the send turns the drawn green", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await card(ready(page)).evaluate((element) => {
    const button = element.querySelector("[data-slot='button']")
    const field = element.querySelector("textarea")

    if (!button || !field) {
      throw new Error("the card is missing a part")
    }

    const style = getComputedStyle(button)

    return {
      value: field.value,
      active: button.hasAttribute("data-active"),
      layers: style.backgroundImage,
      clip: style.backgroundClip,
      border: style.borderColor,
      overlay: getComputedStyle(button, "::before").content,
      shadow: style.boxShadow,
      iconColor: getComputedStyle(button.querySelector("svg") ?? button).color,
      width: Math.round(button.getBoundingClientRect().width),
    }
  })

  expect(read.value).toBe("What dental benefits am I eligible for?")
  expect(read.active).toBe(true)
  expect(read.iconColor, "the arrow in olive-500").toBe("rgb(215, 228, 201)")
  expect(read.shadow, "the celadon halo").toContain("rgb(178, 200, 191)")
  expect(read.shadow, "lit from below").toContain("rgba(255, 255, 255, 0.85)")

  /** The stroke and the fill arrive as two background layers, the fill clipped
   *  to the padding box and the drawn gradient to the border box, so the
   *  stroke sits on the true edge and the inner glow paints over it rather
   *  than under it. An overlay would do the opposite, so there must not be
   *  one. */
  expect(read.overlay, "no overlay ring on the send").toBe("none")
  expect(read.border, "the border is the slot the stroke paints in").toBe(
    "rgba(0, 0, 0, 0)",
  )
  expect(read.clip).toBe("padding-box, border-box")
  expect(read.layers, "emerald-500 fill").toContain("rgb(2, 54, 32)")
  expect(read.layers, "emerald-600 at the top of the stroke").toContain(
    "rgb(2, 46, 27)",
  )
  expect(read.layers, "emerald-700 at the foot of it").toContain(
    "rgb(1, 39, 22)",
  )
  expect(read.width, "active stays 48, the drawn 50 was the frame").toBe(48)
})

test("typing lights the send and clearing rests it", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const inside = card(empty(page))
  const field = inside.locator("textarea")
  const button = inside.locator("[data-slot='button']")

  await expect(button).not.toHaveAttribute("data-active")

  await field.click()
  await page.keyboard.type("What benefits am I eligible for?")
  await expect(button).toHaveAttribute("data-active", "")

  await field.fill("")
  await expect(button).not.toHaveAttribute("data-active")

  await field.fill("   ")
  await expect(button, "whitespace is nothing to send").not.toHaveAttribute(
    "data-active",
  )
})

test("the field grows with its text and stops at the drawn cap", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const inside = card(empty(page))
  const field = inside.locator("textarea")
  const height = async () =>
    inside.evaluate((element) =>
      Math.round(element.getBoundingClientRect().height),
    )

  expect(await height()).toBe(104)

  await field.fill("one\ntwo\nthree\nfour\nfive")
  await expect
    .poll(height, { message: "four more lines, four more line heights" })
    .toBe(104 + 4 * 24)

  await field.fill(Array.from({ length: 30 }, () => "line").join("\n"))
  const capped = await field.evaluate((element) => ({
    height: Math.round(element.getBoundingClientRect().height),
    scrollable: element.scrollHeight > element.clientHeight,
  }))

  expect(capped.height, "the field stops at 200").toBe(200)
  expect(capped.scrollable, "and scrolls from there").toBe(true)

  await field.fill("")
  await expect
    .poll(height, { message: "emptied, the card sits back down" })
    .toBe(104)
})

test("the button page shows the send at rest, lit and dimmed", async ({
  page,
}) => {
  await page.goto("/components/button")

  const sends = page.locator(
    "[data-preview] [data-slot='button'][aria-label='Send message']",
  )

  const read = await sends.evaluateAll((buttons) =>
    buttons.map((button) => {
      const style = getComputedStyle(button)

      return {
        background: style.backgroundColor,
        layers: style.backgroundImage,
        opacity: style.opacity,
        active: button.hasAttribute("data-active"),
        disabled: button.hasAttribute("disabled"),
        width: Math.round(button.getBoundingClientRect().width),
      }
    }),
  )

  /** Default, Focus, Active, Disabled: the drawn columns less the hover the
   *  file leaves empty. */
  expect(read).toHaveLength(4)
  expect(read.every((cell) => cell.width === 48)).toBe(true)
  expect(read[0]).toMatchObject({
    background: "rgb(215, 228, 201)",
    opacity: "1",
    active: false,
  })
  expect(
    read[2]?.active,
    "active is the ready skin, not the pressed state",
  ).toBe(true)
  expect(read[2]?.layers, "and it is painted in layers").toContain(
    "rgb(1, 39, 22)",
  )
  expect(read[3], "disabled is the drawn half opacity").toMatchObject({
    background: "rgb(215, 228, 201)",
    opacity: "0.5",
    disabled: true,
  })
})

test("the width tabs stand in the block pages' rhythm", async ({ page }) => {
  /** Read off the block page rather than written down here: whatever the
   *  blocks do is what a component page showing the same tabs owes. */
  const spacing = async (path: string, after: string) => {
    await page.goto(path)
    await measured(page)

    return page.evaluate((selector) => {
      const tabs = document.querySelector(
        "[role='group'][aria-label='Preview width']",
      )
      const opening = document.querySelector("main p")
      const next = document.querySelector(selector)

      if (!tabs || !opening || !next) {
        throw new Error("the page is missing a landmark")
      }

      const box = tabs.getBoundingClientRect()

      return {
        above: Math.round(box.top - opening.getBoundingClientRect().bottom),
        below: Math.round(next.getBoundingClientRect().top - box.bottom),
      }
    }, after)
  }

  const block = await spacing("/blocks/faq", "figure[data-measures]")
  const component = await spacing(PAGE, "section")

  expect(block, "the block page sets the rhythm").toEqual({
    above: 40,
    below: 24,
  })
  expect(component, "and the component page keeps it").toEqual(block)
})

test("a framed preview wears no box, an unframed one still does", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const framed = await page.evaluate(() => {
    const figure = document.querySelector("figure[data-measures]")

    if (!figure) {
      throw new Error("the page is missing its frame")
    }

    const border = figure.querySelector("div > div")

    return {
      boxes: document.querySelectorAll("[data-preview]").length,
      inABox: Boolean(figure.closest("[data-preview]")),
      /** The frame draws the only border, and it is the thing that narrows. */
      borders: border ? getComputedStyle(border).borderWidth : null,
      captioned: Boolean(figure.closest("li")?.querySelector("p")),
    }
  })

  expect(framed.boxes, "nothing boxed on a framed page").toBe(0)
  expect(framed.inABox).toBe(false)
  expect(framed.borders, "the frame keeps its own").toBe("1px")
  expect(framed.captioned, "and the preview keeps its caption").toBe(true)

  await page.goto("/components/button")

  const boxed = await page.evaluate(() => {
    const box = document.querySelector("[data-preview]")

    if (!box) {
      throw new Error("the page is missing its previews")
    }

    const style = getComputedStyle(box)

    return {
      boxes: document.querySelectorAll("[data-preview]").length,
      padding: style.padding,
      border: style.borderWidth,
    }
  })

  expect(
    boxed.boxes,
    "a page without the tabs keeps every box",
  ).toBeGreaterThan(0)
  expect(boxed.padding).toBe("24px")
  expect(boxed.border).toBe("1px")
})
