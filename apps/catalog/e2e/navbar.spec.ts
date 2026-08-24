import type { Page } from "@playwright/test"

import { expect, test } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/blocks/navbar"
const SPECIMEN = "/specimens/navbar"

/** What the design draws at each of the three widths. The band never changes
 *  height, and the pill is 794 wherever there is room for it and the width of
 *  the container wherever there is not. */
const WIDTHS = [
  { width: 390, bar: 112, pill: 358, links: 0 },
  { width: 810, bar: 112, pill: 762, links: 2 },
  { width: 1440, bar: 112, pill: 794, links: 2 },
] as const

async function bar(page: Page) {
  return page.locator("[data-slot='navbar']").evaluate((header) => {
    const pill = header.querySelector("[data-slot='navbar-pill']")

    if (!pill) {
      throw new Error("the bar has no pill in it")
    }

    const box = pill.getBoundingClientRect()
    const style = getComputedStyle(pill)

    return {
      bar: Math.round(header.getBoundingClientRect().height),
      pill: Math.round(box.width),
      left: Math.round(box.left),
      radius: style.borderTopLeftRadius,
      border: style.borderTopWidth,
      sticky: getComputedStyle(header).position,
      links: [...document.querySelectorAll("nav[aria-label='Main'] a")].filter(
        (link) => link.getBoundingClientRect().width > 0,
      ).length,
    }
  })
}

for (const width of WIDTHS) {
  test(`the bar is drawn as the design draws it at ${String(width.width)}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: width.width, height: 900 })
    await page.goto(SPECIMEN)

    const read = await bar(page)

    expect({
      bar: read.bar,
      pill: read.pill,
      links: read.links,
    }).toEqual({ bar: width.bar, pill: width.pill, links: width.links })

    expect(read.radius, "the pill is fully round").toBe("9999px")
    expect(read.border, "the design gives the pill a hairline").toBe("1px")
    expect(read.sticky, "the bar stays at the top of the screen").toBe("fixed")
    expect(
      read.left,
      "the pill is centred, whether or not it fills the container",
    ).toBe(Math.round((width.width - width.pill) / 2))
  })
}

test("scrolling the page changes nothing about the bar", async ({ page }) => {
  await page.goto(SPECIMEN)

  const pill = page.locator("[data-slot='navbar-pill']")
  const skin = async () =>
    pill.evaluate((element) => {
      const style = getComputedStyle(element)

      return {
        background: style.backgroundColor,
        border: style.borderTopColor,
        blur: style.backdropFilter,
        shadow: style.boxShadow,
      }
    })

  const rest = await skin()

  expect(rest.blur, "no blur at rest").toBe("none")
  expect(rest.shadow, "and no shadow").toBe("none")
  expect(
    rest.background,
    "the beige is opaque, so the page cannot show through it",
  ).not.toContain("0.7")

  for (const top of [51, 400, 2000]) {
    await page.evaluate((to) => {
      window.scrollTo({ top: to, behavior: "instant" })
    }, top)

    expect(
      await skin(),
      `the shipped bar is the same at every scroll position, and so is this one at ${String(top)}`,
    ).toEqual(rest)
  }
})

test("the call to action opens once the page has scrolled a band", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const slot = page.locator("[data-slot='navbar-cta']")
  const cta = page.locator("[data-slot='navbar'] a", { hasText: "New chat" })

  expect(
    await slot.evaluate((element) =>
      Math.round(element.getBoundingClientRect().width),
    ),
    "shut at the top of the page, clipped to nothing",
  ).toBe(0)

  await page.evaluate(() => {
    window.scrollTo({ top: 400, behavior: "instant" })
  })

  await expect(slot).toHaveAttribute("data-shown", "")
  await expect
    .poll(async () =>
      slot.evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe("1")

  await expect(cta).toBeVisible()

  const shape = await cta.evaluate((element) => {
    const style = getComputedStyle(element)
    const icon = element.querySelector("svg")

    return {
      height: Math.round(element.getBoundingClientRect().height),
      radius: style.borderRadius,
      gap: style.gap,
      padding: style.paddingLeft,
      icon: icon ? Math.round(icon.getBoundingClientRect().width) : 0,
    }
  })

  /** The compact size, measured off the shipped bar: 36 tall, 12 of padding,
   *  6 beside a 16px icon, on the leaf the Button already owned. */
  expect(shape).toEqual({
    height: 36,
    radius: "6px 16px",
    gap: "6px",
    padding: "12px",
    icon: 16,
  })
})

test("the menu covers the page and holds the page still", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(SPECIMEN)

  const open = page.getByRole("button", { name: "Open menu" })
  const menu = page.locator("[data-slot='navbar-menu']")

  await expect(menu).toHaveCount(0)
  await open.click()

  await expect(menu).toBeVisible()

  const read = await menu.evaluate((panel) => {
    const box = panel.getBoundingClientRect()
    const links = [...panel.querySelectorAll("nav a")]
    const first = links[0]?.getBoundingClientRect()
    const cta = panel.querySelector("a[href='#chat']")
    const foot = cta?.getBoundingClientRect()

    return {
      covers: Math.round(box.width) === window.innerWidth,
      still: getComputedStyle(document.body).overflow,
      links: links.length,
      /** The design starts the list 40 below a band of 112. */
      top: first ? Math.round(first.top) : null,
      row: first ? Math.round(first.height) : null,
      /** And leaves the gutter below the call to action. */
      under: foot ? Math.round(window.innerHeight - foot.bottom) : null,
      wide: foot ? Math.round(foot.width) : null,
    }
  })

  expect(read).toEqual({
    covers: true,
    still: "hidden",
    links: 2,
    top: 152,
    row: 48,
    under: 16,
    wide: 358,
  })

  await page.getByRole("button", { name: "Close menu" }).click()
  await expect(menu).toHaveCount(0)
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
    "closing it gives the page back its scroll",
  ).not.toBe("hidden")
})

/** One frame at a time, switched by the catalog's own viewport tabs. */
const TABS = [
  { name: "Desktop", width: 1440 },
  { name: "Tablet", width: 810 },
  { name: "Mobile", width: 390 },
] as const

test("the frame reports what its own bar renders, at every tab", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const wrong = []

  for (const tab of TABS) {
    await page.getByRole("button", { name: tab.name, exact: true }).click()
    await measured(page)

    const shell = page.locator(`[data-viewport="${String(tab.width)}"]`)
    await expect(shell).toHaveCount(1)

    const read = await shell
      .locator("iframe")
      .contentFrame()
      .locator("[data-slot='navbar']")
      .evaluate((header) => {
        const pill = header.querySelector("[data-slot='navbar-pill']")

        return {
          bar: Math.round(header.getBoundingClientRect().height),
          pill: pill ? Math.round(pill.getBoundingClientRect().width) : 0,
          links: [
            ...document.querySelectorAll("nav[aria-label='Main'] a"),
          ].filter((link) => link.getBoundingClientRect().width > 0).length,
        }
      })

    const said = await shell.locator("[data-reading]").innerText()
    const shown = read.links === 0 ? "an icon" : `${String(read.links)} links`
    const owed = `band ${String(read.bar)}px · pill ${String(read.pill)}px · ${shown}`

    if (said !== owed) {
      wrong.push(`${tab.name}: ${said} against ${owed}`)
    }
  }

  expect(wrong).toEqual([])
})

test("the open menu fits the frame it is shown in", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  await page.getByRole("button", { name: "Mobile", exact: true }).click()
  await measured(page)

  const frame = page.locator("[data-viewport='390'] iframe").contentFrame()

  await frame.getByRole("button", { name: "Open menu" }).click()

  const menu = frame.locator("[data-slot='navbar-menu']")
  await expect(menu).toBeVisible()

  const read = await menu.evaluate((panel) => {
    const box = panel.getBoundingClientRect()
    const cta = panel.querySelector("a[href='#chat']")

    return {
      height: Math.round(box.height),
      /** The whole panel, not the top of it: a frame shorter than a screen
       *  would cut the call to action off the bottom. */
      footVisible: cta ? Math.round(cta.getBoundingClientRect().bottom) : 0,
      room: Math.round(window.innerHeight),
    }
  })

  expect(read.height, "the panel is a screen tall").toBe(read.room)
  expect(
    read.footVisible,
    "and its foot lands inside the frame rather than past it",
  ).toBeLessThanOrEqual(read.room)
})
