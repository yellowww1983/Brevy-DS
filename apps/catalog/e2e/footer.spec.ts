import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

const SPECIMEN = "/specimens/footer"
const PAGE = "/blocks/footer"

/** The three widths the file draws, with the column each one is owed: the
 *  document less both gutters, which is what Container resolves. */
const WIDTHS = [
  { width: 1440, column: 1200, gutter: 120 },
  { width: 810, column: 762, gutter: 24 },
  { width: 390, column: 358, gutter: 16 },
] as const

const geometry = (page: Page) =>
  page.evaluate(() => {
    const pick = (slot: string) => {
      const node = document.querySelector(`[data-slot='${slot}']`)

      if (!node) {
        throw new Error(`the footer is missing ${slot}`)
      }

      return node
    }

    const footer = pick("footer")
    const about = pick("footer-about")
    const newsletter = pick("footer-newsletter")
    const rule = pick("footer-rule")
    const legal = pick("footer-legal")
    const container = footer.querySelector("[data-slot='container']") ?? footer

    const box = (node: Element) => node.getBoundingClientRect()
    const a = box(about)
    const n = box(newsletter)
    const r = box(rule)
    const l = box(legal)
    const c = box(container)
    const socials = [
      ...newsletter.ownerDocument.querySelectorAll(
        "[data-slot='footer-socials'] [data-slot='button']",
      ),
    ]
    const copyright = legal.querySelector("p")
    const links = [...legal.querySelectorAll("a")]

    if (!copyright) {
      throw new Error("the footer is missing its copyright")
    }

    const newsletterStyle = getComputedStyle(newsletter)

    return {
      frame: window.innerWidth,
      background: getComputedStyle(footer).backgroundColor,
      column: Math.round(c.width),
      gutter: Math.round(c.left),
      padding: `${getComputedStyle(container).paddingTop}/${getComputedStyle(container).paddingBottom}`,

      about: Math.round(a.width),
      newsletter: Math.round(n.width),
      paired: n.left > a.right,
      between:
        n.left > a.right
          ? Math.round(n.left - a.right)
          : Math.round(n.top - a.bottom),

      card: {
        background: newsletterStyle.backgroundColor,
        radius: newsletterStyle.borderRadius,
        padding: newsletterStyle.padding,
        gap: newsletterStyle.rowGap,
      },

      socials: socials.length,
      socialSize: socials[0] ? Math.round(box(socials[0]).width) : null,
      socialGap:
        socials[0] && socials[1]
          ? Math.round(box(socials[1]).left - box(socials[0]).right)
          : null,

      rule: {
        height: Math.round(r.height),
        colour: getComputedStyle(rule).backgroundColor,
        above: Math.round(r.top - Math.max(a.bottom, n.bottom)),
        below: Math.round(l.top - r.bottom),
      },

      logo: (() => {
        const mark = pick("footer-logo").querySelector("svg")

        if (!mark) {
          throw new Error("the footer is missing its lockup")
        }

        const m = box(mark)

        return {
          width: Math.round(m.width),
          height: Math.round(m.height),
          atTheEdge: Math.round(m.left - a.left),
          colour: getComputedStyle(mark).color,
        }
      })(),

      legalInARow: box(links[0] ?? copyright).top === box(copyright).top,
      legalGap: Math.round(
        box(links[0] ?? copyright).top === box(copyright).top
          ? box(links[0] ?? copyright).left - box(copyright).right
          : box(links[0] ?? copyright).top - box(copyright).bottom,
      ),
      links: links.map((link) => link.textContent.trim()),
    }
  })

test("the footer sits on the container at every drawn width", async ({
  page,
}) => {
  for (const drawn of WIDTHS) {
    await page.setViewportSize({ width: drawn.width, height: 1400 })
    await page.goto(SPECIMEN)

    const read = await geometry(page)

    expect(read.column, `${String(drawn.width)}: the drawn column`).toBe(
      drawn.column,
    )
    expect(read.gutter, `${String(drawn.width)}: the drawn gutter`).toBe(
      drawn.gutter,
    )
    /** The file starts the lockup flush against the top of the frame. */
    expect(read.padding, "nothing above, 24 below").toBe("0px/24px")
    expect(read.background, "a white band on every page").toBe(
      "rgb(255, 255, 255)",
    )

    /** The drawn lockup is 115 by 40 and stands against the column's edge. A
     *  stretched svg keeps its drawing centred in whatever width it is given,
     *  which is not a thing the eye reads as a logo. */
    expect(read.logo.height, `${String(drawn.width)}: the drawn height`).toBe(
      40,
    )
    expect(read.logo.width, `${String(drawn.width)}: at its own width`).toBe(
      115,
    )
    expect(
      read.logo.atTheEdge,
      `${String(drawn.width)}: against the edge`,
    ).toBe(0)
    expect(read.logo.colour, "the drawn brand green").toBe("rgb(6, 110, 61)")
  }
})

test("the columns pair up only where the whole column exists", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1400 })
  await page.goto(SPECIMEN)

  const desktop = await geometry(page)
  /** Halves of the drawn 1200 with the drawn 16 between them. */
  expect(desktop.paired).toBe(true)
  expect(desktop.about).toBe(592)
  expect(desktop.newsletter).toBe(592)
  expect(desktop.between).toBe(16)

  for (const width of [1199, 810, 390]) {
    await page.setViewportSize({ width, height: 1400 })
    await page.goto(SPECIMEN)

    const stacked = await geometry(page)

    expect(stacked.paired, `${String(width)}: stacked`).toBe(false)
    expect(
      stacked.about,
      `${String(width)}: both sides take the whole column`,
    ).toBe(stacked.newsletter)
    expect(stacked.between, `${String(width)}: 32 between them`).toBe(32)
  }
})

test("the newsletter wears the drawn card and the system's own parts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1400 })
  await page.goto(SPECIMEN)

  const read = await geometry(page)

  expect(read.card).toEqual({
    background: "rgb(245, 242, 239)",
    radius: "16px",
    padding: "24px",
    gap: "24px",
  })

  const parts = await page.evaluate(() => {
    const card = document.querySelector("[data-slot='footer-newsletter']")
    const field = card?.querySelector("input")
    const button = card?.querySelector("button")

    if (!field || !button) {
      throw new Error("the newsletter is missing a part")
    }

    const fieldStyle = getComputedStyle(field)
    const buttonStyle = getComputedStyle(button)

    return {
      field: {
        height: Math.round(field.getBoundingClientRect().height),
        radius: fieldStyle.borderRadius,
        border: fieldStyle.borderColor,
        background: fieldStyle.backgroundColor,
        type: field.getAttribute("type"),
      },
      button: {
        height: Math.round(button.getBoundingClientRect().height),
        width: Math.round(button.getBoundingClientRect().width),
        radius: buttonStyle.borderRadius,
        background: buttonStyle.backgroundColor,
        colour: buttonStyle.color,
      },
      sameWidth:
        Math.round(field.getBoundingClientRect().width) ===
        Math.round(button.getBoundingClientRect().width),
    }
  })

  /** The Input at its tall size, which the file draws to the pixel. */
  expect(parts.field).toEqual({
    height: 48,
    radius: "8px",
    border: "oklch(0.87 0 none)",
    background: "rgb(255, 255, 255)",
    type: "email",
  })
  /** And the primary Button, on the leaf, across the whole card. */
  expect(parts.button.height).toBe(48)
  expect(parts.button.radius).toBe("6px 16px")
  expect(parts.button.background).toBe("rgb(2, 54, 32)")
  expect(parts.button.colour).toBe("rgb(215, 228, 201)")
  expect(parts.sameWidth, "the field and the button share a width").toBe(true)
})

test("the brand links are the social variant, four in a row", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1400 })
  await page.goto(SPECIMEN)

  const read = await geometry(page)

  expect(read.socials).toBe(4)
  expect(read.socialSize).toBe(36)
  expect(read.socialGap).toBe(8)

  const marks = await page.evaluate(() =>
    [...document.querySelectorAll("[data-slot='footer-socials'] a")].map(
      (link) => ({
        label: link.getAttribute("aria-label"),
        brand: link.querySelector("svg")?.getAttribute("data-brand") ?? null,
        href: link.getAttribute("href"),
      }),
    ),
  )

  expect(marks.map((mark) => mark.brand)).toEqual([
    "facebook",
    "instagram",
    "tiktok",
    "linkedin",
  ])
  expect(marks.every((mark) => (mark.href ?? "").startsWith("https://"))).toBe(
    true,
  )
})

test("the rule and the legal line follow the drawing", async ({ page }) => {
  for (const width of [1440, 810]) {
    await page.setViewportSize({ width, height: 1400 })
    await page.goto(SPECIMEN)

    const read = await geometry(page)

    expect(read.rule).toEqual({
      height: 1,
      colour: "oklch(0.922 0 none)",
      above: 24,
      below: 24,
    })
    expect(read.legalInARow, `${String(width)}: a row`).toBe(true)
    expect(read.legalGap, `${String(width)}: 24 between`).toBe(24)
    expect(read.links).toEqual([
      "Privacy Policy",
      "Terms of Service",
      "Contact us",
    ])
  }

  await page.setViewportSize({ width: 390, height: 1400 })
  await page.goto(SPECIMEN)

  const mobile = await geometry(page)
  expect(mobile.legalInARow, "at mobile the legal line stacks").toBe(false)
  expect(mobile.legalGap, "24 between the stacked lines").toBe(24)
})

test("the frame draws the footer at every tab", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1400 })
  await page.goto(PAGE)
  await measured(page)

  for (const tab of ["Desktop", "Tablet", "Mobile"]) {
    await page.getByRole("button", { name: tab, exact: true }).click()
    await measured(page)

    const read = await page
      .locator("figure[data-measures] iframe")
      .contentFrame()
      .locator("[data-slot='footer']")
      .evaluate((footer) => {
        const about = footer.querySelector("[data-slot='footer-about']")
        const news = footer.querySelector("[data-slot='footer-newsletter']")

        if (!about || !news) {
          throw new Error("the frame is missing a column")
        }

        return {
          frame: window.innerWidth,
          paired:
            news.getBoundingClientRect().left >
            about.getBoundingClientRect().right,
        }
      })

    expect(read.paired, `${tab}: the pair from the content width up`).toBe(
      read.frame >= 1200,
    )
  }
})

test("the air above the footer is the frame's, not the block's", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1400 })
  await page.goto(SPECIMEN)

  const read = await page.evaluate(() => {
    const air = document.querySelector("[data-slot='specimen-air']")
    const footer = document.querySelector("[data-slot='footer']")

    if (!air || !footer) {
      throw new Error("the specimen is missing a part")
    }

    const container = footer.querySelector("[data-slot='container']") ?? footer
    const lockup = footer.querySelector("[data-slot='footer-logo']")

    if (!lockup) {
      throw new Error("the footer is missing its lockup")
    }

    return {
      air: Math.round(air.getBoundingClientRect().height),
      /** The block's own padding, which the file draws at nothing. */
      blockPadding: getComputedStyle(container).paddingTop,
      /** The lockup still sits against the top of the band it is drawn in. */
      insideTheBand: Math.round(
        lockup.getBoundingClientRect().top - footer.getBoundingClientRect().top,
      ),
      /** And the band starts where the air ends. */
      afterTheAir: Math.round(
        footer.getBoundingClientRect().top - air.getBoundingClientRect().bottom,
      ),
    }
  })

  expect(read.air, "one section's worth of space, supplied by the frame").toBe(
    96,
  )
  expect(read.blockPadding, "the block keeps the drawn nothing").toBe("0px")
  expect(read.insideTheBand, "the lockup is flush, as drawn").toBe(0)
  expect(read.afterTheAir).toBe(0)
})
