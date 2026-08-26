import { expect, test } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 1400 } })

const SPECIMEN = "/specimens/faq"
const PAGE = "/blocks/faq"

test("the columns arrive exactly when the content column is full", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const columns = async () =>
    page.evaluate(() => {
      const intro = document
        .querySelector("[data-slot='faq-intro']")
        ?.getBoundingClientRect()
      const list = document
        .querySelector("[data-slot='faq-list']")
        ?.getBoundingClientRect()

      if (!intro || !list) {
        throw new Error("the block is missing a column")
      }

      return list.left > intro.right ? 2 : 1
    })

  await page.setViewportSize({ width: 1199, height: 1200 })
  expect(await columns(), "one short of the cap, the block stacks").toBe(1)

  await page.setViewportSize({ width: 1200, height: 1200 })
  expect(await columns(), "at the cap the pair arrives").toBe(2)

  await page.setViewportSize({ width: 1440, height: 1200 })
  expect(await columns(), "and the drawn desktop keeps it").toBe(2)
})

test("the desktop draws two columns on the grid", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page.evaluate(() => {
    const intro = document.querySelector("[data-slot='faq-intro']")
    const list = document.querySelector("[data-slot='faq-list']")
    const card = document.querySelector("[data-slot='faq-contact']")
    const section = document.querySelector("[data-slot='faq']")

    if (!intro || !list || !card || !section) {
      throw new Error("the block is missing a slot")
    }

    const ib = intro.getBoundingClientRect()
    const lb = list.getBoundingClientRect()
    const cb = card.getBoundingClientRect()
    const description = intro.querySelector("p")

    return {
      intro: Math.round(ib.width),
      list: Math.round(lb.width),
      between: Math.round(lb.left - ib.right),
      card: Math.round(cb.height),
      underDescription: description
        ? Math.round(cb.top - description.getBoundingClientRect().bottom)
        : null,
      gradient:
        getComputedStyle(section).backgroundImage.includes("linear-gradient"),
      topPadding: getComputedStyle(
        section.querySelector("[data-slot='container']") ?? section,
      ).paddingTop,
    }
  })

  /** The drawn 389 and 592 are four and six columns of the documented grid,
   *  with the two empty tracks between them coming to 219. */
  expect(read.intro).toBe(389)
  expect(read.list).toBe(592)
  expect(read.between).toBe(219)
  /** 76, not the file's 78: the drawing fixes the card's height and crushes
   *  its own padding to 15, a step the scale does not have. 14 is the
   *  nearest, and it is also exactly what the shipped site renders. */
  expect(read.card, "the card two under its crushed drawing").toBe(76)
  expect(read.underDescription, "24 under the description").toBe(24)
  expect(read.gradient, "the band fades beige to white").toBe(true)
  expect(read.topPadding, "96 above on the desktop").toBe("96px")
})

for (const width of [810, 390]) {
  test(`at ${String(width)} the block stacks with the card by the text`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1400 })
    await page.goto(SPECIMEN)

    const read = await page.evaluate(() => {
      const intro = document.querySelector("[data-slot='faq-intro']")
      const list = document.querySelector("[data-slot='faq-list']")
      const card = document.querySelector("[data-slot='faq-contact']")
      const section = document.querySelector("[data-slot='faq']")
      const description = intro?.querySelector("p")
      const button = card?.querySelector("a")

      if (!intro || !list || !card || !description || !button || !section) {
        throw new Error("the block is missing a slot")
      }

      const cb = card.getBoundingClientRect()

      return {
        intro: Math.round(intro.getBoundingClientRect().width),
        card: Math.round(cb.height),
        underDescription: Math.round(
          cb.top - description.getBoundingClientRect().bottom,
        ),
        overList: Math.round(list.getBoundingClientRect().top - cb.bottom),
        button: Math.round(button.getBoundingClientRect().width),
        cardWidth: Math.round(cb.width),
        topPadding: getComputedStyle(
          section.querySelector("[data-slot='container']") ?? section,
        ).paddingTop,
      }
    })

    expect(read.intro).toBe(width === 810 ? 762 : 358)
    expect(read.underDescription, "24 under the description").toBe(24)
    expect(read.overList, "48 over the list").toBe(48)
    expect(read.topPadding, "96 above at every width").toBe("96px")

    if (width === 390) {
      /** 160 against the file's 172: the drawn message box is 60 tall where
       *  two lines of 16 on 24 come to 48, and no rendering reproduces the
       *  extra 12. The shipped site draws 160 too. */
      expect(read.card, "upright, the card stacks to 160").toBe(160)
      expect(
        read.button,
        "and the button takes the whole line inside the padding",
      ).toBe(read.cardWidth - 48)
    } else {
      expect(read.card, "a row, at the same 76 as the desktop").toBe(76)
      expect(read.button, "the button at its own size").toBeLessThan(200)
    }
  })
}

test("the first question is open and the card's button is the primary", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const open = page.locator("[data-slot='accordion-item'][data-state='open']")
  await expect(open).toHaveCount(1)
  await expect(open).toContainText("Can Brevy help me get paid")

  const button = await page
    .locator("[data-slot='faq-contact'] a")
    .evaluate((node) => {
      const style = getComputedStyle(node)

      return {
        height: Math.round(node.getBoundingClientRect().height),
        radius: style.borderRadius,
        background: style.backgroundColor,
      }
    })

  expect(button, "48 tall on the leaf, in the drawn green").toEqual({
    height: 48,
    radius: "6px 16px",
    background: "rgb(2, 54, 32)",
  })
})

test("the frame draws the block true at every tab", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  for (const tab of ["Desktop", "Tablet", "Mobile"]) {
    await page.getByRole("button", { name: tab, exact: true }).click()
    await measured(page)

    const shell = page.locator("[data-viewport]")
    await expect(shell).toHaveCount(1)

    /** Measured straight off the frame's document, with what the block owes
     *  derived from the width the frame actually stands at: the columns pair
     *  up from the content breakpoint, the card goes upright below the
     *  tablet one. */
    const read = await shell
      .locator("iframe")
      .contentFrame()
      .locator("[data-slot='faq']")
      .evaluate((section) => {
        const intro = section
          .querySelector("[data-slot='faq-intro']")
          ?.getBoundingClientRect()
        const list = section
          .querySelector("[data-slot='faq-list']")
          ?.getBoundingClientRect()
        const card = section
          .querySelector("[data-slot='faq-contact']")
          ?.getBoundingClientRect()

        if (!intro || !list || !card) {
          throw new Error("the frame is missing a slot")
        }

        return {
          frame: window.innerWidth,
          paired: list.left > intro.right,
          sameWidth: Math.round(intro.width) === Math.round(list.width),
          card: Math.round(card.height),
        }
      })

    if (read.frame >= 1200) {
      expect(read.paired, `${tab}: the pair from the content width up`).toBe(
        true,
      )
    } else {
      expect(read.paired, `${tab}: stacked below the content width`).toBe(false)
      expect(read.sameWidth, `${tab}: and both take the full column`).toBe(true)
    }

    expect(
      read.card,
      `${tab}: the card is a 76 row down to the tablet width, 160 upright`,
    ).toBe(read.frame >= 810 ? 76 : 160)
  }
})
