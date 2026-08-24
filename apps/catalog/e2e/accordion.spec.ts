import type { Locator, Page } from "@playwright/test"

import { expect, test } from "./catalog-test"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/components/accordion"

/** The single list, which is the drawn FAQ. */
function single(page: Page) {
  return page
    .locator("main section", { hasText: "SINGLE" })
    .locator("[data-slot='accordion']")
    .first()
}

async function stateOf(item: Locator) {
  return item.getAttribute("data-state")
}

test("every card wears the drawn skin", async ({ page }) => {
  await page.goto(PAGE)

  const cards = await page
    .locator("main [data-slot='accordion-item']")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node)
        const trigger = node.querySelector("[data-slot='accordion-trigger']")
        const ts = trigger ? getComputedStyle(trigger) : null

        return {
          radius: style.borderRadius,
          pad: style.paddingLeft,
          background: style.backgroundColor,
          shadow: style.boxShadow,
          hairline: getComputedStyle(node, "::before").backgroundImage,
          question: ts
            ? `${ts.fontSize}/${ts.fontWeight} lh=${ts.lineHeight}`
            : null,
        }
      }),
    )

  expect(cards.length).toBeGreaterThan(0)

  /** The drawn width and the height it produces: 592 across, and a closed
   *  card at 24 + 28 + 24. */
  const closed = single(page).locator(
    "[data-slot='accordion-item'][data-state='closed']",
  )
  const box = await closed.first().evaluate((node) => {
    const rect = node.getBoundingClientRect()
    return { width: Math.round(rect.width), height: Math.round(rect.height) }
  })
  expect(box).toEqual({ width: 592, height: 76 })

  for (const card of cards) {
    expect(card.radius, "16 on every corner").toBe("16px")
    expect(card.pad, "24 aside").toBe("24px")
    expect(card.background).toBe("rgb(255, 255, 255)")
    expect(
      card.hairline,
      "the hairline overlay carries the drawn gradient",
    ).toContain("linear-gradient")
    expect(card.shadow, "the drawn shadow stays").toContain(
      "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
    )
    expect(
      card.shadow,
      "and the old half black ring is gone from the slot",
    ).not.toContain("rgba(0, 0, 0, 0.5)")
    expect(card.question, "the question at 20 SemiBold on 28").toBe(
      "20px/600 lh=28px",
    )
  }

  const answer = await page
    .locator("main [data-slot='accordion-content'] > div")
    .first()
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return `${style.fontSize}/${style.fontWeight} ${style.color}`
    })

  expect(answer, "the answer a step lighter").toBe(
    "20px/400 oklch(0.37 0.013 285.805)",
  )
})

test("the hairline runs light at the top to dark at the bottom", async ({
  page,
}) => {
  await page.goto(PAGE)
  /** Pixels are about to be read, so the preloader must not be painting:
   *  the fixture seeds the session flag, which leaves the overlay in the
   *  DOM but hidden, and hidden is all the screenshot needs. */
  await expect(page.locator("[data-preloader-overlay]")).toBeHidden()

  const item = single(page)
    .locator("[data-slot='accordion-item'][data-state='closed']")
    .first()
  const box = await item.boundingBox()

  if (!box) {
    throw new Error("the closed card has no box to measure")
  }

  const PAD = 6
  const shot = (
    await page.screenshot({
      clip: {
        x: box.x - PAD,
        y: box.y - PAD,
        width: box.width + 2 * PAD,
        height: box.height + 2 * PAD,
      },
    })
  ).toString("base64")

  const edges = await page.evaluate(
    async ({ data, pad, width, height }) => {
      const image = new Image()
      image.src = `data:image/png;base64,${data}`
      await image.decode()

      const scale = image.width / (width + 2 * pad)
      const canvas = document.createElement("canvas")
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext("2d")

      if (!context) {
        throw new Error("no canvas to sample on")
      }

      context.drawImage(image, 0, 0)

      /** The darkest pixel in a strip crossing the edge, which is the line
       *  itself: the card is white and the page behind it is white too. */
      const darkest = (x: number, top: number) => {
        let least = 255
        for (let step = -3 * scale; step <= 3 * scale; step += 1) {
          const edge = top ? pad * scale : (pad + height) * scale
          const pixel = context.getImageData(
            Math.round(x * scale),
            Math.round(edge + step),
            1,
            1,
          ).data
          const red = pixel[0] ?? 255
          if (red < least) {
            least = red
          }
        }
        return least
      }

      return {
        top: [0.25, 0.5, 0.75].map((f) => darkest(pad + width * f, 1)),
        bottom: [0.25, 0.5, 0.75].map((f) => darkest(pad + width * f, 0)),
      }
    },
    { data: shot, pad: PAD, width: box.width, height: box.height },
  )

  for (const value of edges.top) {
    expect(
      Math.abs(value - 229),
      "the top edge holds neutral-200, 229",
    ).toBeLessThanOrEqual(4)
  }
  for (const value of edges.bottom) {
    expect(
      Math.abs(value - 212),
      "and the bottom edge holds neutral-300, 212",
    ).toBeLessThanOrEqual(4)
  }
})

test("the chevron sits level with the question line", async ({ page }) => {
  await page.goto(PAGE)

  const closed = single(page)
    .locator("[data-slot='accordion-item'][data-state='closed']")
    .first()

  const centres = await closed.evaluate((item) => {
    const trigger = item.querySelector("[data-slot='accordion-trigger']")
    const icon = item.querySelector("svg")

    if (!trigger || !icon) {
      throw new Error("the closed item is missing its trigger or its icon")
    }

    const middle = (box: DOMRect) => box.top + box.height / 2

    return {
      trigger: middle(trigger.getBoundingClientRect()),
      icon: middle(icon.getBoundingClientRect()),
    }
  })

  expect(
    Math.abs(centres.icon - centres.trigger),
    "on a one line question the icon's centre is the trigger's",
  ).toBeLessThanOrEqual(0.5)
})

test("a single list holds one answer open at a time", async ({ page }) => {
  await page.goto(PAGE)

  const list = single(page)
  const items = list.locator("[data-slot='accordion-item']")
  const first = items.nth(0)
  const second = items.nth(1)

  expect(await stateOf(first), "the drawn default: first open").toBe("open")
  const closedHeight = await second.evaluate(
    (node) => node.getBoundingClientRect().height,
  )

  await second.locator("[data-slot='accordion-trigger']").click()

  expect(await stateOf(second), "clicking opens it").toBe("open")
  expect(await stateOf(first), "and closes the one before").toBe("closed")
  expect(
    await second.evaluate((node) => node.getBoundingClientRect().height),
    "the card grows by its answer",
  ).toBeGreaterThan(closedHeight)

  await second.locator("[data-slot='accordion-trigger']").click()
  expect(await stateOf(second), "a second press closes it again").toBe("closed")
})

test("a multiple list lets answers stay open together", async ({ page }) => {
  await page.goto(PAGE)

  const list = page
    .locator("main section", { hasText: "MULTIPLE" })
    .locator("[data-slot='accordion']")
    .first()
  const items = list.locator("[data-slot='accordion-item']")

  expect(await stateOf(items.nth(0))).toBe("open")
  expect(await stateOf(items.nth(1))).toBe("open")

  await items.nth(2).locator("[data-slot='accordion-trigger']").click()

  expect(await stateOf(items.nth(0)), "the open ones stay open").toBe("open")
  expect(await stateOf(items.nth(1))).toBe("open")
  expect(await stateOf(items.nth(2))).toBe("open")
})

test("the keyboard drives it the way Radix promises", async ({ page }) => {
  await page.goto(PAGE)

  const list = single(page)
  const triggers = list.locator("[data-slot='accordion-trigger']")
  const items = list.locator("[data-slot='accordion-item']")

  await triggers.nth(1).focus()
  await page.keyboard.press("Enter")
  expect(await stateOf(items.nth(1)), "Enter opens").toBe("open")

  /** Focus is worn by the card, not the question: one line around the whole
   *  item, none inside it. */
  expect(
    await items.nth(1).evaluate((node) => getComputedStyle(node).outlineWidth),
    "the focused card carries the outline",
  ).toBe("2px")
  expect(
    await triggers.nth(1).evaluate((node) => {
      const style = getComputedStyle(node)
      return `${style.outlineStyle}|${style.boxShadow}`
    }),
    "and the trigger carries nothing",
  ).toBe("none|none")

  await page.keyboard.press("Space")
  expect(await stateOf(items.nth(1)), "Space closes it again").toBe("closed")

  await page.keyboard.press("ArrowDown")
  await expect(
    triggers.nth(2),
    "ArrowDown moves focus to the next question",
  ).toBeFocused()

  await page.keyboard.press("Tab")
  await expect(
    triggers.nth(2),
    "Tab leaves the trigger it was on",
  ).not.toBeFocused()
})

test("the chevron turns over when its answer opens", async ({ page }) => {
  await page.goto(PAGE)

  const list = single(page)
  const openIcon = list
    .locator("[data-slot='accordion-trigger'][data-state='open'] svg")
    .first()
  const closedIcon = list
    .locator("[data-slot='accordion-trigger'][data-state='closed'] svg")
    .first()

  /** Tailwind v4 turns things with the standalone `rotate` property, so the
   *  transform matrix stays empty and the angle lives on its own. */
  const turned = async (icon: Locator) =>
    icon.evaluate((node) => getComputedStyle(node).rotate)

  expect(await turned(closedIcon), "at rest the chevron points down").toBe(
    "none",
  )
  expect(await turned(openIcon), "open, it is turned half way round").toBe(
    "180deg",
  )
})
