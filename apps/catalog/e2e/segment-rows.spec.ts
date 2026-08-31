import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

const PAGE = "/blocks/segment-rows"
const SPECIMEN = "/specimens/segment-rows"

/** What the file draws (`23272:2304`), checked against the live page at
 *  brevy.com/partners where the two disagree. */
const DRAWN = {
  pad: "96px 0px",
  headToStack: 48,
  index: 265,
  indexPad: "36px",
  indexGap: "24px",
  stack: 896,
  between: 39,
  gap: "16px",
  card: { width: 896, height: 420, pad: "24px", gap: "24px", radius: "16px" },
  half: 412,
  illustration: 372,
  beam: 4,
  narrow: { stack: 762, card: 762 },
  mobile: { stack: 358, illustration: 310 },
  /** The bars are one and two stops darker than the file draws two of them:
   *  violet-800 and olive-900 against a drawn 700 that reads 2.39 and 1.99
   *  on its own card. DESIGN-FEEDBACK 83. */
  violet: {
    ground: "rgb(233, 222, 255)",
    ink: "rgb(94, 82, 140)",
    beam: "rgb(124, 110, 170)",
  },
  amber: {
    ground: "rgb(253, 228, 178)",
    ink: "rgb(111, 51, 19)",
    beam: "rgb(184, 92, 34)",
  },
  olive: {
    ground: "rgb(220, 231, 207)",
    ink: "rgb(2, 54, 32)",
    beam: "rgb(92, 102, 82)",
  },
  beige: "rgb(245, 242, 239)",
  zinc800: "oklch(0.274 0.006 286.033)",
  zinc500: "oklch(0.552 0.016 285.938)",
}

const box = (page: Page, selector: string, index = 0) =>
  page
    .locator(selector)
    .nth(index)
    .evaluate((node) => {
      const rectangle = node.getBoundingClientRect()
      return {
        width: Math.round(rectangle.width),
        height: Math.round(rectangle.height),
      }
    })

test("the section stands on the beige wash and pads itself", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='segment-rows']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return { padding: style.padding, ground: style.backgroundImage }
    })

  expect(read.padding).toBe(DRAWN.pad)
  expect(read.ground).toContain(DRAWN.beige)
  expect(read.ground).toContain("rgb(255, 255, 255)")
})

test("the heading is centred in the page's own colour", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='segment-rows-heading']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      const list = document.querySelector("[data-slot='segment-rows-list']")
      return {
        align: style.textAlign,
        colour: style.color,
        family: style.fontFamily,
        gap: list
          ? Math.round(
              list.getBoundingClientRect().top -
                node.getBoundingClientRect().bottom,
            )
          : null,
      }
    })

  /** Centred and zinc-800, unlike the benefits grid's emerald. */
  expect(read.align).toBe("center")
  expect(read.colour).toBe(DRAWN.zinc800)
  expect(read.family).toContain("Hedvig")
  expect(read.gap).toBe(DRAWN.headToStack)
})

test("the index takes its drawn width beside the drawn stack", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  expect((await box(page, "[data-slot='segment-rows-index']")).width).toBe(
    DRAWN.index,
  )
  expect((await box(page, "[data-slot='segment-rows-list']")).width).toBe(
    DRAWN.stack,
  )

  const read = await page
    .locator("[data-slot='segment-rows']")
    .evaluate((node) => {
      const index = node.querySelector("[data-slot='segment-rows-index']")
      const list = node.querySelector("[data-slot='segment-rows-list']")

      if (!index || !list) {
        return null
      }

      return {
        between: Math.round(
          list.getBoundingClientRect().left -
            index.getBoundingClientRect().right,
        ),
        padding: getComputedStyle(index).paddingTop,
        gap: getComputedStyle(index).rowGap,
        /** It hugs its names rather than stretching down the stack. */
        height: Math.round(index.getBoundingClientRect().height),
        stack: Math.round(list.getBoundingClientRect().height),
      }
    })

  expect(read?.between, "1200 less 265 and 896").toBe(DRAWN.between)
  expect(read?.padding).toBe(DRAWN.indexPad)
  expect(read?.gap).toBe(DRAWN.indexGap)
  expect(read?.height).toBeLessThan(read?.stack ?? 0)
})

test("the index lights one name and mutes the rest", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='segment-rows-index-item']")
    .evaluateAll((nodes) =>
      nodes.map((node) => ({
        weight: getComputedStyle(node).fontWeight,
        colour: getComputedStyle(node).color,
        active: node.hasAttribute("data-active"),
        /** No anchor and no handler: the live page reports where you are
         *  rather than taking you there. */
        link: node.querySelector("a, button") !== null,
        transition: getComputedStyle(node).transitionProperty,
      })),
    )

  expect(read).toHaveLength(3)
  expect(read[0]?.active).toBe(true)
  expect(read[0]?.weight).toBe("600")
  expect(read[0]?.colour).toBe(DRAWN.zinc800)
  expect(read[1]?.active).toBe(false)
  expect(read[1]?.weight).toBe("400")
  expect(read[1]?.colour).toBe(DRAWN.zinc500)
  expect(read.every((item) => !item.link)).toBe(true)
  expect(read[0]?.transition).toContain("color")

  /** And it moves where it is told to. */
  await page.goto(`${SPECIMEN}?active=1`)
  const second = await page
    .locator("[data-slot='segment-rows-index-item']")
    .evaluateAll((nodes) =>
      nodes.map((node) => node.hasAttribute("data-active")),
    )

  expect(second).toEqual([false, true, false])
})

test("the card stands on its own colour, with no thread and no shadow", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const card = await box(page, "[data-slot='segment-rows-card']")
  expect(card.width).toBe(DRAWN.card.width)
  expect(card.height).toBe(DRAWN.card.height)

  const read = await page
    .locator("[data-slot='segment-rows-card']")
    .first()
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        padding: style.padding,
        gap: style.rowGap,
        radius: style.borderRadius,
        direction: style.flexDirection,
        ground: style.backgroundImage,
        border: style.borderWidth,
        shadow: style.boxShadow,
        thread: getComputedStyle(node, "::before").content,
      }
    })

  expect(read.padding).toBe(DRAWN.card.pad)
  expect(read.gap).toBe(DRAWN.card.gap)
  expect(read.radius).toBe(DRAWN.card.radius)
  expect(read.direction).toBe("row")
  expect(read.ground).toContain(DRAWN.violet.ground)
  expect(read.ground).toContain(DRAWN.beige)
  /** The only card in the system that stands on nothing but its colour. */
  expect(read.border).toBe("0px")
  expect(read.shadow).toBe("none")
  expect(read.thread).toBe("none")
})

test("the halves split the drawn 412 and 412", async ({ page }) => {
  await page.goto(SPECIMEN)

  const copy = await box(page, "[data-slot='segment-rows-copy']")
  const art = await box(page, "[data-slot='segment-rows-illustration']")

  /** Half the row each, to within the pixel the split rounds to. A zero
   *  basis would have left the white card's own 48 of padding outside the
   *  space being divided, which puts the drawn 412 and 412 at 388 and 436. */
  expect(copy.width).toBeGreaterThanOrEqual(DRAWN.half - 1)
  expect(copy.width).toBeLessThanOrEqual(DRAWN.half + 1)
  expect(art.width).toBeGreaterThanOrEqual(DRAWN.half - 1)
  expect(art.width).toBeLessThanOrEqual(DRAWN.half + 1)
  expect(Math.abs(copy.width - art.width)).toBeLessThanOrEqual(2)
  expect(art.height, "372 at every width; the copy is what grows").toBe(
    DRAWN.illustration,
  )
})

test("each tone dresses its ground, its ink and its bar together", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='segment-rows-card']")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const copy = node.querySelector("[data-slot='segment-rows-copy']")
        const beam = node.querySelector("[data-slot='segment-rows-beam']")
        return {
          tone: node.getAttribute("data-tone"),
          ground: getComputedStyle(node).backgroundImage,
          ink: copy ? getComputedStyle(copy).color : null,
          beam: beam ? getComputedStyle(beam).backgroundColor : null,
        }
      }),
    )

  expect(read.map((item) => item.tone)).toEqual(["violet", "amber", "olive"])

  for (const [index, tone] of [
    DRAWN.violet,
    DRAWN.amber,
    DRAWN.olive,
  ].entries()) {
    expect(read[index]?.ground).toContain(tone.ground)
    expect(read[index]?.ground, "every ground runs to beige").toContain(
      DRAWN.beige,
    )
    expect(read[index]?.ink).toBe(tone.ink)
    expect(read[index]?.beam).toBe(tone.beam)
  }
})

test("the bar is as tall as the line beside it", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='segment-rows-card']")
    .first()
    .evaluate((node) => {
      const beam = node.querySelector("[data-slot='segment-rows-beam']")
      const line = node.querySelector("[data-slot='segment-rows-description']")

      if (!beam || !line) {
        return null
      }

      return {
        width: Math.round(beam.getBoundingClientRect().width),
        height: Math.round(beam.getBoundingClientRect().height),
        line: Math.round(line.getBoundingClientRect().height),
        radius: getComputedStyle(beam).borderRadius,
        hidden: beam.getAttribute("aria-hidden"),
      }
    })

  expect(read?.width).toBe(DRAWN.beam)
  expect(read?.radius).toBe("9999px")
  /** 72 where the copy runs two lines, 96 where it runs three — the copy's
   *  height, not a number anyone chose. */
  expect(read?.height).toBe(read?.line)
  expect(read?.hidden).toBe("true")
})

test("the index leaves and the card folds, at their own widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 810, height: 1000 })
  await page.goto(SPECIMEN)

  /** The file draws the index only at the desktop. */
  await expect(page.locator("[data-slot='segment-rows-index']")).toBeHidden()
  expect((await box(page, "[data-slot='segment-rows-list']")).width).toBe(
    DRAWN.narrow.stack,
  )

  /** And the card keeps its two columns here — it folds at the mobile. */
  expect(
    await page
      .locator("[data-slot='segment-rows-card']")
      .first()
      .evaluate((node) => getComputedStyle(node).flexDirection),
  ).toBe("row")

  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto(SPECIMEN)

  expect(
    await page
      .locator("[data-slot='segment-rows-card']")
      .first()
      .evaluate((node) => getComputedStyle(node).flexDirection),
  ).toBe("column")
  expect(
    (await box(page, "[data-slot='segment-rows-illustration']")).width,
  ).toBe(DRAWN.mobile.illustration)
  expect(
    (await box(page, "[data-slot='segment-rows-illustration']")).height,
    "the white card holds 372 even folded",
  ).toBe(DRAWN.illustration)
})

test("a fourth segment joins without a fourth palette", async ({ page }) => {
  await page.goto(`${SPECIMEN}?fourth=on`)

  const tones = await page
    .locator("[data-slot='segment-rows-card']")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-tone")))

  /** Three is what the file draws, not what the block takes. */
  expect(tones).toEqual(["violet", "amber", "olive", "violet"])
  await expect(
    page.locator("[data-slot='segment-rows-index-item']"),
  ).toHaveCount(4)
})

type ToneRead = {
  tone: string | null
  ink: number
  beam: number
  art: boolean
  copy: number
  inner: number
}

/** WCAG 2.1 contrast, computed off pixels the browser actually painted — the
 *  ramps are authored in hex but the grounds resolve through oklab, so the
 *  only honest reading is one taken after compositing. */
const readTones = (page: Page) =>
  page.evaluate<ToneRead[]>(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext("2d", { willReadFrequently: true })

    const pixel = (value: string) => {
      if (!context) {
        return [0, 0, 0]
      }
      context.fillStyle = "#000"
      context.fillStyle = value
      context.fillRect(0, 0, 1, 1)
      const data = context.getImageData(0, 0, 1, 1).data
      return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0]
    }

    const channel = (value: number) => {
      const v = value / 255
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    }

    const luminance = (c: number[]) =>
      0.2126 * channel(c[0] ?? 0) +
      0.7152 * channel(c[1] ?? 0) +
      0.0722 * channel(c[2] ?? 0)

    const ratio = (a: number[], b: number[]) => {
      const hi = Math.max(luminance(a), luminance(b))
      const lo = Math.min(luminance(a), luminance(b))
      return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100
    }

    return [
      ...document.querySelectorAll("[data-slot='segment-rows-card']"),
    ].map((card) => {
      const copy = card.querySelector("[data-slot='segment-rows-copy']")
      const beam = card.querySelector("[data-slot='segment-rows-beam']")
      const art = card.querySelector("[data-slot='segment-rows-illustration']")
      const stops =
        getComputedStyle(card).backgroundImage.match(/rgb\([^)]+\)/g) ?? []
      const ground = pixel(stops[0] ?? "#ffffff")

      return {
        tone: card.getAttribute("data-tone"),
        ink: copy ? ratio(ground, pixel(getComputedStyle(copy).color)) : 0,
        beam: beam
          ? ratio(ground, pixel(getComputedStyle(beam).backgroundColor))
          : 0,
        art: art ? getComputedStyle(art).display !== "none" : false,
        copy: copy ? Math.round(copy.getBoundingClientRect().width) : 0,
        inner: Math.round(card.getBoundingClientRect().width) - 48,
      }
    })
  })

test("every tone reads at AA on its own ground, in both themes", async ({
  page,
}) => {
  await page.goto(SPECIMEN)
  const light = await readTones(page)

  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(SPECIMEN)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  const dark = await readTones(page)

  for (const set of [light, dark]) {
    expect(set.map((card) => card.tone)).toEqual(["violet", "amber", "olive"])

    for (const card of set) {
      expect(card.ink, `${card.tone ?? "?"} ink`).toBeGreaterThanOrEqual(4.5)
      /** A mark that is not text still owes 3 to 1. As drawn the violet's
       *  beam reads 2.39 and the olive's 1.99, so both step darker in the
       *  light — DESIGN-FEEDBACK 83. */
      expect(card.beam, `${card.tone ?? "?"} beam`).toBeGreaterThanOrEqual(3)
    }
  }
})

test("a tonal ground is a tint, so it darkens", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='segment-rows-card']")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const copy = node.querySelector("[data-slot='segment-rows-copy']")
        return {
          ground: getComputedStyle(node).backgroundImage,
          ink: copy ? getComputedStyle(copy).color : null,
        }
      }),
    )

  /** Each ramp turns end for end: the 200 behind becomes the 950 and the 900
   *  on the ink becomes the 100. The olive keeps its brand override but has
   *  to step out from `--primary`, which is chosen against the page's
   *  near-black and reads 2.33 on olive-950. */
  expect(read[0]?.ground).toContain("rgb(53, 47, 85)")
  expect(read[0]?.ink).toBe("rgb(244, 238, 255)")
  expect(read[1]?.ground).toContain("rgb(64, 41, 14)")
  expect(read[1]?.ink).toBe("rgb(253, 233, 219)")
  expect(read[2]?.ground).toContain("rgb(59, 67, 53)")
  expect(read[2]?.ink).toBe("rgb(121, 207, 171)")

  /** And every ground still runs to the page's own, which the browser keeps
   *  in the space the token was written in. */
  for (const card of read) {
    expect(card.ground).toContain("oklch(0.145 0 none)")
  }
})

test("the artwork keeps its place and turns with the page", async ({
  page,
}) => {
  /** Every surface inside the white card is a token, so the mock is the same
   *  arrangement in either theme rather than a light picture that has to be
   *  hidden on a dark page. The bubbles take `--popover`, a step above
   *  `--card`; the field takes `--background`, a step below. In the light all
   *  three are white and the hairline does the separating, which is what the
   *  drawing does. */
  const read = async () =>
    page
      .locator("[data-slot='segment-rows-illustration']")
      .first()
      .evaluate((node) => {
        const canvas = document.createElement("canvas")
        canvas.width = 1
        canvas.height = 1
        const context = canvas.getContext("2d", { willReadFrequently: true })
        const pixel = (value: string) => {
          if (!context) return [0, 0, 0]
          context.fillStyle = "#000"
          context.fillStyle = value
          context.fillRect(0, 0, 1, 1)
          const data = context.getImageData(0, 0, 1, 1).data
          return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0]
        }
        const channel = (v: number) => {
          const c = v / 255
          return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        }
        const lum = (c: number[]) =>
          0.2126 * channel(c[0] ?? 0) +
          0.7152 * channel(c[1] ?? 0) +
          0.0722 * channel(c[2] ?? 0)
        const ratio = (a: number[], b: number[]) => {
          const hi = Math.max(lum(a), lum(b))
          const lo = Math.min(lum(a), lum(b))
          return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100
        }
        const paint = (
          selector: string,
          property: "color" | "backgroundColor",
        ) => {
          const found = node.querySelector(selector)
          return found ? pixel(getComputedStyle(found)[property]) : [0, 0, 0]
        }

        return {
          shown: getComputedStyle(node).display !== "none",
          width: Math.round(node.getBoundingClientRect().width),
          bubble: ratio(
            paint("[data-mock='bubble']", "backgroundColor"),
            paint("[data-mock='bubble-ink']", "color"),
          ),
          field: ratio(
            paint("[data-mock='field']", "backgroundColor"),
            paint("[data-mock='field-ink']", "color"),
          ),
          list: ratio(
            pixel(getComputedStyle(node).backgroundColor),
            paint("[data-slot='icon-list-label']", "color"),
          ),
          glyph: ratio(
            pixel(getComputedStyle(node).backgroundColor),
            paint("[data-slot='icon-list-face']", "color"),
          ),
          /** Nothing may be left painted a fixed pale colour on a dark card. */
          strays: [...node.querySelectorAll("*")].filter(
            (child) =>
              child.getClientRects().length > 0 &&
              /^rgb\(2[3-9]\d, 2[3-9]\d, 2[3-9]\d\)$/.test(
                getComputedStyle(child).backgroundColor,
              ),
          ).length,
        }
      })

  await page.goto(SPECIMEN)
  const light = await read()

  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(SPECIMEN)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  const dark = await read()

  /** Same section, second theme — not a second arrangement. */
  expect(light.shown).toBe(true)
  expect(dark.shown).toBe(true)
  expect(dark.width).toBe(light.width)

  for (const [name, set] of [
    ["light", light],
    ["dark", dark],
  ] as const) {
    expect(set.bubble, `${name} bubble`).toBeGreaterThanOrEqual(4.5)
    expect(set.field, `${name} field`).toBeGreaterThanOrEqual(4.5)
    expect(set.list, `${name} list`).toBeGreaterThanOrEqual(4.5)
    expect(set.glyph, `${name} check`).toBeGreaterThanOrEqual(4.5)
  }

  expect(dark.strays, "no pale patch left on a dark card").toBe(0)
})

test("the section and the words on it follow the page", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='segment-rows']")
    .evaluate((node) => {
      const heading = node.querySelector("[data-slot='segment-rows-heading']")
      const name = node.querySelector("[data-slot='segment-rows-index-item']")

      return {
        ground: getComputedStyle(node).backgroundColor,
        image: getComputedStyle(node).backgroundImage,
        heading: heading ? getComputedStyle(heading).color : null,
        name: name ? getComputedStyle(name).color : null,
      }
    })

  expect(read.ground).toBe("oklch(0.145 0 none)")
  expect(read.image).toBe("none")
  expect(read.heading).toBe("oklch(0.985 0 none)")
  expect(read.name).toBe("oklch(0.985 0 none)")
})

test("the catalog frames the section at all three widths", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  await expect(page.locator("iframe")).toHaveCount(3)

  expect(
    await page
      .locator("iframe")
      .first()
      .evaluate((node) => Math.round(node.getBoundingClientRect().width)),
  ).toBe(1440)

  await page.getByRole("button", { name: "Mobile", exact: true }).click()
  await measured(page)

  expect(
    await page
      .locator("iframe")
      .first()
      .evaluate((node) => Math.round(node.getBoundingClientRect().width)),
  ).toBe(390)
})
