import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 1600 } })

const PAGE = "/blocks/steps"
const SPECIMEN = "/specimens/steps"

/** What the four pages that draw a steps section draw, across the eight
 *  frames the file carries them in (`22614:7570`, `23259:576`,
 *  `25276:3615`, `24974:4784`). */
const DRAWN = {
  column: { desktop: 1200, tablet: 762, mobile: 358 },
  pad: 96,
  chipToHeading: 12,
  headerToSteps: 48,
  heading: { desktop: "36px", narrow: "30px" },
  cardGap: 16,
  listGap: 8,
  figure: 290,
  marker: 36,
  panel: { wide: 680, narrow: 492 },
  panelStep: 592,
  plate: "520x608",
  plateNarrow: "326x460",
  /** The file's own effects, in Tailwind's terms. A card in a row and the
   *  plate inside the panel wear `0 2 4 -2` over `0 4 6 -1` at 10%, which is
   *  `md`; a step beside a panel and the numbered disc wear `0 1 2 0` at 5%,
   *  which is `xs`. */
  shadow: {
    md: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px",
    xs: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
  },
}

/** brand-500, the numeral in the disc and the title of a step beside a panel. */
const BRAND = "rgb(6, 110, 61)"
/** zinc-400, the spinner in a step the list has not reached. */
const ZINC_400 = "oklch(0.705 0.015 286.067)"
/** olive-50, the tint on the first step. */
const OLIVE_50 = "rgb(248, 251, 245)"
const WHITE = "rgb(255, 255, 255)"
/** neutral-950, the page under a dark theme. */
const NEUTRAL_950 = "oklch(0.145 0 none)"
/** neutral-900, `--card`, where a step lands in the dark. */
const NEUTRAL_900 = "oklch(0.205 0 none)"

const frameFor = (page: Page, query: string) =>
  page.locator(
    `figure[data-measures]:has(iframe[src$="/specimens/steps${query}"])`,
  )

const cards = (page: Page) => frameFor(page, "")
const panel = (page: Page) => frameFor(page, "?layout=panel")
const app = (page: Page) => frameFor(page, "?layout=app")

const sectionIn = (frame: ReturnType<typeof cards>) =>
  frame.locator("iframe").contentFrame().locator("[data-slot='steps']")

/** Read straight off the frame's own document, with gaps measured between
 *  boxes rather than taken off a class. */
const geometry = (node: HTMLElement) => {
  const pick = (slot: string) =>
    node.querySelector<HTMLElement>(`[data-slot='${slot}']`)
  const box = (element: Element) => element.getBoundingClientRect()

  const column = pick("container")
  const header = pick("steps-header")
  const heading = pick("steps-heading")
  const list = pick("steps-list")
  const chip = node.querySelector<HTMLElement>("[data-slot='chip']")

  if (!column || !header || !heading || !list || !chip) {
    return null
  }

  const steps = [
    ...node.querySelectorAll<HTMLElement>("[data-slot='steps-step']"),
  ]
  const first = steps[0]
  const second = steps[1]
  const panelItem = pick("steps-panel")
  /** The illustration frame is its own component now — one object, two
   *  blocks — so it answers to its own name rather than the step's. */
  const figure = pick("illustration-panel")
  /** The disc is its own component now — three consumers, one shape — so it
   *  answers to its own name rather than the step's. */
  const marker = pick("marker")
  const tail = pick("steps-tail")
  const style = getComputedStyle(column)

  return {
    document: node.ownerDocument.documentElement.clientWidth,
    ground: getComputedStyle(node).backgroundImage,
    column: Math.round(box(column).width),
    pad: [parseInt(style.paddingTop), parseInt(style.paddingBottom)],
    chipCount: chip.textContent.trim().charAt(0),
    chipToHeading: Math.round(box(heading).top - box(chip).bottom),
    headerToSteps: Math.round(box(list).top - box(header).bottom),
    heading: getComputedStyle(heading).fontSize,
    description: pick("steps-description") !== null,
    steps: steps.length,
    step: first
      ? {
          width: Math.round(box(first).width),
          shadow: getComputedStyle(first)
            .boxShadow.split(", rgba(0, 0, 0, 0) 0px 0px 0px 0px")
            .join("")
            .replace(/^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px, /, ""),
          ground: getComputedStyle(first).backgroundColor,
          title: (() => {
            const heading = first.querySelector<HTMLElement>(
              "[data-slot='steps-step-title']",
            )
            return heading ? getComputedStyle(heading).color : null
          })(),
        }
      : null,
    secondGround: second ? getComputedStyle(second).backgroundColor : null,
    /** Side by side when the second step starts level with the first. */
    inRow:
      first && second
        ? Math.round(box(first).top) === Math.round(box(second).top)
        : null,
    gap:
      first && second
        ? Math.round(box(second).top) === Math.round(box(first).top)
          ? Math.round(box(second).left - box(first).right)
          : Math.round(box(second).top - box(first).bottom)
        : null,
    figure: figure ? Math.round(box(figure).height) : null,
    reached: [...node.querySelectorAll("[data-slot='steps-step']")].map((s) =>
      s.hasAttribute("data-reached"),
    ),
    ticked: [...node.querySelectorAll("[data-slot='steps-tick']")].map((t) =>
      t.hasAttribute("data-reached"),
    ),
    /** Two icons, not one recoloured: a check where the list has been, a
     *  spinner where it has not.
     *
     *  The size comes off the computed width rather than the box, because a
     *  turning square has a bigger box than the square. */
    tickIcon: [...node.querySelectorAll("[data-slot='steps-tick'] svg")].map(
      (icon) => {
        const style = getComputedStyle(icon)
        return {
          shape: (icon.getAttribute("class") ?? "").includes("check")
            ? "check"
            : "loader",
          size: Math.round(parseFloat(style.width)),
          colour: style.color,
          spin: style.animationName,
          speed: `${style.animationDuration} ${style.animationTimingFunction}`,
        }
      },
    ),
    /** The list and the panel have to end level: the file gives the panel
     *  `layoutSizingVertical: FILL` beside a list that hugs. */
    foot: (() => {
      const steps = [...node.querySelectorAll("[data-slot='steps-step']")]
      const last = steps.at(-1)
      const host = pick("steps-panel")
      if (!last || !host) return null
      return {
        list: Math.round(box(last).bottom),
        panel: Math.round(box(host).bottom),
      }
    })(),
    /** The panel's steps are buttons where the list can be driven and plain
     *  boxes where it cannot. */
    clickable: [...node.querySelectorAll("[data-slot='steps-step']")].every(
      (s) => s.tagName === "BUTTON",
    ),
    current: [...node.querySelectorAll("[data-slot='steps-step']")].findIndex(
      (s) => s.getAttribute("aria-current") === "step",
    ),
    plate: (() => {
      const plate = pick("steps-panel")?.firstElementChild
      const host = pick("steps-panel")
      if (!plate || !host) return null
      const p = box(plate)
      const h = box(host)
      return {
        size: `${String(Math.round(p.width))}x${String(Math.round(p.height))}`,
        left: Math.round(p.left - h.left),
        right: Math.round(h.right - p.right),
      }
    })(),
    plateShadow: (() => {
      const plate = pick("steps-panel")?.firstElementChild
      return plate
        ? getComputedStyle(plate)
            .boxShadow.split(", rgba(0, 0, 0, 0) 0px 0px 0px 0px")
            .join("")
            .replace(/^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px, /, "")
        : null
    })(),
    marker: marker
      ? {
          size: Math.round(box(marker).width),
          shadow: getComputedStyle(marker)
            .boxShadow.split(", rgba(0, 0, 0, 0) 0px 0px 0px 0px")
            .join("")
            .replace(/^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px, /, ""),
          colour: (() => {
            const numeral = marker.firstElementChild
            return numeral ? getComputedStyle(numeral).color : null
          })(),
        }
      : null,
    panel: panelItem
      ? {
          height: Math.round(box(panelItem).height),
          width: Math.round(box(panelItem).width),
          /** How many steps are drawn above it. */
          above: [...list.children].filter(
            (child) => box(child).top < box(panelItem).top,
          ).length,
          levelWithFirst: first
            ? Math.round(box(panelItem).top) === Math.round(box(first).top)
            : null,
        }
      : null,
    tail: tail !== null,
  }
}

const at = async (
  page: Page,
  tab: string,
  frame: ReturnType<typeof cards> = cards(page),
) => {
  await page.getByRole("button", { name: tab, exact: true }).click()
  await measured(page)
  return sectionIn(frame).evaluate(geometry)
}

test("the frame around the steps is the same at every width", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const desktop = await at(page, "Desktop")
  const tablet = await at(page, "Tablet")
  const mobile = await at(page, "Mobile")

  expect(desktop?.column).toBe(DRAWN.column.desktop)
  expect(tablet?.column).toBe(DRAWN.column.tablet)
  expect(mobile?.column).toBe(DRAWN.column.mobile)

  for (const read of [desktop, tablet, mobile]) {
    expect(read?.pad, "the section pads itself, unlike the CTA band").toEqual([
      DRAWN.pad,
      DRAWN.pad,
    ])
    expect(read?.chipToHeading, "12 under the chip").toBe(DRAWN.chipToHeading)
    expect(read?.headerToSteps, "48 down to the steps").toBe(
      DRAWN.headerToSteps,
    )
    expect(read?.figure, "the illustration is 290 at every width").toBe(
      DRAWN.figure,
    )
  }

  expect(desktop?.heading).toBe(DRAWN.heading.desktop)
  expect(tablet?.heading).toBe(DRAWN.heading.narrow)
  expect(mobile?.heading).toBe(DRAWN.heading.narrow)
})

test("the chip counts the steps it is standing over", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const three = await at(page, "Desktop")
  const four = await at(page, "Desktop", panel(page))

  expect(three?.steps).toBe(3)
  expect(three?.chipCount, "three cards, three in the chip").toBe("3")
  expect(four?.steps).toBe(4)
  expect(four?.chipCount, "four steps, four in the chip").toBe("4")
})

test("cards run a row where there is room and a column where there is not", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const desktop = await at(page, "Desktop")
  const tablet = await at(page, "Tablet")
  const mobile = await at(page, "Mobile")

  expect(desktop?.inRow, "three across at the content width").toBe(true)
  expect(tablet?.inRow, "one under the other below it").toBe(false)
  expect(mobile?.inRow).toBe(false)

  for (const read of [desktop, tablet, mobile]) {
    expect(read?.gap, "16 either way").toBe(DRAWN.cardGap)
  }

  expect(desktop?.step?.width, "1200 across three with 16 between").toBe(
    Math.round((DRAWN.column.desktop - 2 * DRAWN.cardGap) / 3),
  )
  expect(tablet?.step?.width).toBe(DRAWN.column.tablet)
  expect(mobile?.step?.width).toBe(DRAWN.column.mobile)
})

test("the panel stands beside the list and then second inside it", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const desktop = await at(page, "Desktop", panel(page))
  const tablet = await at(page, "Tablet", panel(page))
  const mobile = await at(page, "Mobile", panel(page))

  expect(desktop?.panel?.width, "half the column, less the 16").toBe(
    DRAWN.panelStep,
  )
  expect(desktop?.step?.width).toBe(DRAWN.panelStep)
  expect(
    desktop?.panel?.levelWithFirst,
    "its own column, starting level with the first step",
  ).toBe(true)
  /** No number of its own beside the list — it fills to whatever the steps
   *  measure, which is the drawn 680 plus the four pixels a card gains from
   *  this system's line height. Its height is asserted against the list in
   *  `the panel is as tall as the list beside it`. */
  expect(desktop?.panel?.height).toBeGreaterThanOrEqual(DRAWN.panel.wide)

  for (const [width, read] of Object.entries({ tablet, mobile })) {
    expect(read?.step?.width, `${width}: full width`).toBe(
      width === "tablet" ? DRAWN.column.tablet : DRAWN.column.mobile,
    )
    expect(
      read?.panel?.above,
      `${width}: second in the column, the numbering interrupted after the first step`,
    ).toBe(1)
  }

  expect(tablet?.panel?.height).toBe(DRAWN.panel.wide)
  expect(mobile?.panel?.height, "shorter on a phone").toBe(DRAWN.panel.narrow)
})

test("the discs are a prop, because both states are drawn", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const off = await at(page, "Desktop")
  const on = await at(page, "Desktop", frameFor(page, "?markers=on"))
  const beside = await at(page, "Desktop", panel(page))

  expect(off?.marker, "Caregiving switches every one of them off").toBeNull()
  expect(on?.marker?.size, "the drawn 36, not the hidden 40").toBe(DRAWN.marker)
  expect(on?.marker?.colour).toBe(BRAND)
  expect(
    beside?.marker?.size,
    "shown where the list stands beside a panel",
  ).toBe(DRAWN.marker)
})

test("the panel opens on the frame the narrow drawings carry", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await at(page, "Desktop", panel(page))

  expect(read?.reached, "the first step reached and no other").toEqual([
    true,
    false,
    false,
    false,
  ])
  expect(read?.ticked, "the tick says the same").toEqual(read?.reached)
  expect(read?.step?.ground, "olive-50 on the one reached").toBe(OLIVE_50)
  expect(read?.secondGround, "white on the rest").toBe(WHITE)
  expect(read?.step?.title, "brand-500 beside a panel").toBe(BRAND)
})

test("the tick is a check where the list has been and a spinner where it has not", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await at(page, "Desktop", panel(page))
  const icons = read?.tickIcon ?? []

  expect(icons[0], "the first step is reached").toEqual({
    shape: "check",
    size: 16,
    colour: BRAND,
    spin: "none",
    speed: "0s ease",
  })

  /** Every step it has not reached, not only the next one: the file draws the
   *  same path in all of them, in all four frames. */
  for (const icon of icons.slice(1)) {
    expect(icon, "the rest are waiting, and say so").toEqual({
      shape: "loader",
      size: 16,
      colour: ZINC_400,
      spin: "spin",
      speed: "1s linear",
    })
  }
})

test("the spinner actually turns, and stops for a reader who asked", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1600 },
  })
  const page = await context.newPage()

  await page.goto(`${SPECIMEN}?layout=panel`)
  await page.locator("[data-slot='steps-tick'] svg").last().waitFor()

  const spinner = page.locator("[data-slot='steps-tick'] svg").last()
  const at0 = await spinner.evaluate((icon) => getComputedStyle(icon).transform)

  await expect
    .poll(() => spinner.evaluate((icon) => getComputedStyle(icon).transform), {
      timeout: 2000,
    })
    .not.toBe(at0)

  await context.close()

  const still = await browser.newContext({
    viewport: { width: 1440, height: 1600 },
    reducedMotion: "reduce",
  })
  const quiet = await still.newPage()

  await quiet.goto(`${SPECIMEN}?layout=panel`)
  await quiet.locator("[data-slot='steps-tick'] svg").last().waitFor()

  const read = await quiet.locator("[data-slot='steps']").evaluate(geometry)

  for (const icon of read?.tickIcon ?? []) {
    expect(
      icon.spin,
      "stillness stops it, the same rule the clock follows",
    ).toBe("none")
  }

  await still.close()
})

test("the panel is as tall as the list beside it", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await at(page, "Desktop", panel(page))

  expect(
    read?.foot?.panel,
    "the file fills the panel to a list that hugs, so they end level",
  ).toBe(read?.foot?.list)
})

test("the plate holds at 520 and centres rather than stretching", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const desktop = await at(page, "Desktop", panel(page))
  const tablet = await at(page, "Tablet", panel(page))
  const mobile = await at(page, "Mobile", panel(page))

  expect(desktop?.plate?.size, "the drawn 520 by 608").toBe(DRAWN.plate)
  expect(
    { left: desktop?.plate?.left, right: desktop?.plate?.right },
    "36 either side, which is the panel's own padding",
  ).toEqual({ left: 36, right: 36 })

  expect(tablet?.plate?.size, "the same plate in a wider panel").toBe(
    DRAWN.plate,
  )
  expect(
    { left: tablet?.plate?.left, right: tablet?.plate?.right },
    "121 either side, which is (762 - 520) / 2",
  ).toEqual({ left: 121, right: 121 })

  expect(mobile?.plate?.size, "narrower than the cap, so it fills").toBe(
    DRAWN.plateNarrow,
  )
})

test("the list advances a step at a time and starts over", async ({ page }) => {
  await page.goto(SPECIMEN + "?layout=panel")

  const list = page.locator("[data-slot='steps']")
  const count = () =>
    list.evaluate(
      (node) =>
        node.querySelectorAll("[data-slot='steps-step'][data-reached]").length,
    )

  await expect.poll(count).toBe(1)
  await expect.poll(count, { timeout: 8000 }).toBe(2)
  await expect.poll(count, { timeout: 8000 }).toBe(3)
  await expect.poll(count, { timeout: 8000 }).toBe(4)
  await expect.poll(count, { timeout: 8000 }).toBe(1)
})

test("a click takes the list to a step and stops it there", async ({
  page,
}) => {
  await page.goto(SPECIMEN + "?layout=panel")
  await page.locator("button[data-slot='steps-step']").first().waitFor()

  await page.locator("button[data-slot='steps-step']").nth(2).click()

  const read = await page.locator("[data-slot='steps']").evaluate(geometry)

  expect(read?.reached, "everything up to the one clicked").toEqual([
    true,
    true,
    true,
    false,
  ])
  expect(read?.current).toBe(2)

  /** Long enough for two holds. Nothing should have moved. */
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            document.querySelectorAll("[data-slot='steps-step'][data-reached]")
              .length,
        ),
      { timeout: 8000 },
    )
    .toBe(3)
})

test("stillness stops the clock and leaves the clicking", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1600 },
    reducedMotion: "reduce",
  })
  const page = await context.newPage()

  await page.goto(`${SPECIMEN}?layout=panel`)
  await page.locator("button[data-slot='steps-step']").first().waitFor()

  const opened = await page.locator("[data-slot='steps']").evaluate(geometry)

  expect(opened?.reached, "the first frame and no clock").toEqual([
    true,
    false,
    false,
    false,
  ])
  expect(
    opened?.clickable,
    "a reader who cannot see it move can still get to the other three",
  ).toBe(true)

  await page.locator("button[data-slot='steps-step']").nth(3).click()

  const clicked = await page.locator("[data-slot='steps']").evaluate(geometry)
  expect(clicked?.reached).toEqual([true, true, true, true])

  await context.close()
})

test("below the two columns there is no slider", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  for (const tab of ["Tablet", "Mobile"]) {
    const read = await at(page, tab, panel(page))

    expect(read?.clickable, `${tab}: nothing to drive`).toBe(false)
    expect(read?.current, `${tab}: and nothing marked current`).toBe(-1)
    expect(read?.reached, `${tab}: the frame the file draws`).toEqual([
      true,
      false,
      false,
      false,
    ])
  }
})

test("every surface wears the shadow the file gives it", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const row = await at(page, "Desktop")
  const beside = await at(page, "Desktop", panel(page))

  expect(row?.step?.shadow, "a card in a row").toBe(DRAWN.shadow.md)
  expect(beside?.step?.shadow, "a step beside a panel").toBe(DRAWN.shadow.xs)
  expect(beside?.plateShadow, "the plate inside the panel").toBe(
    DRAWN.shadow.md,
  )
  expect(beside?.marker?.shadow, "the numbered disc").toBe(DRAWN.shadow.xs)
})

test("on a dark page the section follows the app and the disc holds", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(`${SPECIMEN}?layout=panel`)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  const read = await page.locator("[data-slot='steps']").evaluate(geometry)

  expect(read?.ground, "the olive gradient goes").toBe("none")
  expect(read?.step?.ground, "a step takes the app's card").toBe(NEUTRAL_900)
  expect(
    read?.marker?.colour,
    "the disc is a brand surface and holds its numeral",
  ).toBe(BRAND)

  const ground = await page.evaluate(
    () =>
      getComputedStyle(
        document.querySelector("[data-slot='steps']") as HTMLElement,
      ).backgroundColor,
  )

  expect(ground, "the app's dark page").toBe(NEUTRAL_950)
})

/** Reads one card of the app row: the grid it stands in, the card itself, and
 *  the tray under the copy. */
async function appCard(page: Page) {
  return await sectionIn(app(page))
    .locator("[data-slot='steps-step']")
    .first()
    .evaluate((card) => {
      const list = card.parentElement

      if (!list) {
        throw new Error("a step outside its list")
      }

      const style = getComputedStyle(card)
      const box = card.getBoundingClientRect()
      const kids = [...card.children]
      const tray = card.querySelector("[data-slot='steps-tray']")

      if (!tray) {
        throw new Error("the app card draws no tray")
      }

      const trayStyle = getComputedStyle(tray)

      return {
        tracks: getComputedStyle(list).gridTemplateColumns,
        gap: getComputedStyle(list).columnGap,
        width: Math.round(box.width),
        minHeight: style.minHeight,
        radius: style.borderRadius,
        overflow: style.overflow,
        shadow: style.boxShadow
          .split(", rgba(0, 0, 0, 0) 0px 0px 0px 0px")
          .join("")
          .replace(/^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px, /, ""),
        border: style.borderTopWidth,
        thread: getComputedStyle(card, "::before").backgroundImage,
        trayIsLast: kids.at(-1) === tray,
        trayWidth: Math.round(tray.getBoundingClientRect().width),
        trayRadius: trayStyle.borderRadius,
        trayStops: trayStyle.backgroundImage.match(/rgba?\([^)]*\)/g) ?? [],
      }
    })
}

test("app runs the row cards runs, and parts at the card", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  /** The research said the arrangement is not what `app` brings: it brings a
   *  card. So the grid is compared against the other row's rather than against
   *  a number, and if one of them ever moves this is what notices. */
  const tracksOf = (frame: ReturnType<typeof cards>) =>
    sectionIn(frame)
      .locator("[data-slot='steps-list']")
      .evaluate((list) => {
        const style = getComputedStyle(list)

        return { tracks: style.gridTemplateColumns, gap: style.columnGap }
      })

  const row = await tracksOf(cards(page))
  const appRow = await tracksOf(app(page))

  expect(appRow.tracks.split(" ")).toHaveLength(3)
  expect(appRow, "the two rows are one grid drawn twice").toEqual(row)
})

test("the app card is turned over, and its tray runs to the edges", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await appCard(page)

  expect(read.trayIsLast, "the copy comes first and the artwork under it").toBe(
    true,
  )
  expect(read.trayRadius, "the tray has no corner of its own").toBe("0px")
  expect(read.overflow, "the card clips, which is what shapes the tray").toBe(
    "hidden",
  )
  expect(read.trayWidth, "the tray runs the whole width of the card").toBe(
    read.width,
  )
  /** The stops rather than the whole declaration: a browser serialises the
   *  first one as `0%` or `0px` depending on its build, and the claim here is
   *  which two colours the tray runs between. */
  expect(
    read.trayStops,
    "beige-500 to white, which is what the page draws",
  ).toEqual(["rgb(245, 242, 239)", "rgb(255, 255, 255)"])
})

test("the app card reads as a thread rather than a lift", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await appCard(page)

  /** The whole difference in how the card sits on the page. `cards` is lifted
   *  and `app` is outlined, so the two shadows are checked against each other
   *  as well as against the file — a change to either one shows here. */
  expect(read.shadow, "the small shadow, not the larger one").toBe(
    DRAWN.shadow.xs,
  )
  expect(read.border, "the thread is drawn, not bordered").toBe("0px")
  expect(
    read.thread,
    "and it is a gradient, which is what `hairline` is",
  ).not.toBe("none")

  const lifted = await sectionIn(cards(page))
    .locator("[data-slot='steps-step']")
    .first()
    .evaluate((card) =>
      getComputedStyle(card)
        .boxShadow.split(", rgba(0, 0, 0, 0) 0px 0px 0px 0px")
        .join("")
        .replace(/^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px, /, ""),
    )

  expect(lifted, "the row of cards keeps the lift it always had").toBe(
    DRAWN.shadow.md,
  )
})

test("the app eyebrow counts itself, so it cannot disagree", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const section = sectionIn(app(page))
  const eyebrows = section.locator("[data-slot='steps-step-eyebrow']")
  const steps = section.locator("[data-slot='steps-step']")

  const said = await eyebrows.allTextContents()
  const count = await steps.count()

  expect(count, "an empty row would pass on nothing").toBeGreaterThan(0)
  expect(
    said.map((text) => text.trim()),
    "the number is the position, the way the chip's count is the length",
  ).toEqual(
    Array.from({ length: count }, (_, index) => `Step ${String(index + 1)}`),
  )
})

test("the three arrangements are disjoint", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  /** One list each, and the section says which it drew. A fourth branch or a
   *  fall-through would show as two lists in one frame. */
  for (const [name, frame] of [
    ["cards", cards(page)],
    ["panel", panel(page)],
    ["app", app(page)],
  ] as const) {
    const section = sectionIn(frame)

    await expect(section).toHaveAttribute("data-layout", name)
    await expect(section.locator("[data-slot='steps-list']")).toHaveCount(1)
  }

  /** `app` is a still row like `cards`: the slider belongs to `panel` alone,
   *  and a step you can click is how it shows. */
  await expect(
    sectionIn(app(page)).locator("[data-slot='steps-step'] button"),
  ).toHaveCount(0)
  await expect(sectionIn(panel(page)).locator("button")).not.toHaveCount(0)
})

test("the app trays carry the app's own artwork, not the row's", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  /** This shipped once with the cards' mocks in it. The preset's copy was the
   *  landing's and its pictures were not, which reads as the right block
   *  holding the wrong product — so the source of every tray is checked, and
   *  checked against the other row's as well as for its own name. */
  const sources = await sectionIn(app(page))
    .locator("[data-slot='steps-tray'] img")
    .evaluateAll((images) =>
      images.map((image) =>
        image instanceof HTMLImageElement
          ? decodeURIComponent(image.currentSrc)
              .replace(/^.*?url=/, "")
              .split("&")[0]
          : "",
      ),
    )

  expect(sources, "one export per card").toEqual([
    "/steps/app-1.webp",
    "/steps/app-2.webp",
    "/steps/app-3.webp",
  ])

  const row = await sectionIn(cards(page))
    .locator("img")
    .evaluateAll((images) =>
      images.map((image) =>
        image instanceof HTMLImageElement
          ? decodeURIComponent(image.currentSrc)
              .replace(/^.*?url=/, "")
              .split("&")[0]
          : "",
      ),
    )

  expect(
    sources.filter((source) => row.includes(source)),
    "no card in the app row is showing a picture from the other one",
  ).toEqual([])
})
