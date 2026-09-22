import { expect, test, type Page } from "./catalog-test"

const SPECIMEN = "/specimens/feature-slider"

/** What was measured, and where.
 *
 *  The geometry and the colours come from the design file (`24990:688` and
 *  the five slides beside it). Everything about movement comes from the live
 *  page at brevy.com/caregiver-app, because the file draws five still frames
 *  and says nothing about what happens between two of them. */
const DRAWN = {
  fade: {
    property: "opacity",
    duration: "0.3s",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  hover: "0.15s",
  copyFloor: "240px",
  mediaFloor: "420px",
  /** The top stop of each panel, painted.
   *
   *  Two are not the colours the file draws. The fourth is `blue-200`
   *  standing in for an `indigo/200` this system does not ship. The fifth is
   *  `violet-200` rather than the drawn `purple/200`, because `SegmentRows`
   *  already paints a violet and paints it `violet-200`; the two sat 0.0231
   *  apart, which is close enough to read as a slip. The test below is what
   *  holds the two blocks together; this only pins what the slider paints. */
  tints: {
    yellow: "253,228,178,255",
    olive: "220,231,207,255",
    emerald: "207,230,222,255",
    blue: "191,219,254,255",
    violet: "233,222,255,255",
  },
  ground: {
    beige: "245,242,239,255",
    white: "255,255,255,255",
    hover: "252,250,248,255",
    /** `--background` in the dark, which is what the copy panel drops to
     *  while the tints beside it stay exactly where the file put them. */
    dark: "10,10,10,255",
  },
}

/** Resolves a colour the way the screen does: laid into a one pixel canvas
 *  and read back as channels. The stops arrive as `rgb()`, the tokens as
 *  `oklch()` and an empty ground as `rgba(0, 0, 0, 0)`; none of the three
 *  compares against another as text, and painted they all do. */
async function painted(page: Page, css: string) {
  return await page.evaluate((value) => {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1

    const context = canvas.getContext("2d")

    if (!context) {
      throw new Error("no 2d context to paint into")
    }

    context.fillStyle = value
    context.fillRect(0, 0, 1, 1)

    return [...context.getImageData(0, 0, 1, 1).data].join(",")
  }, css)
}

/** The first colour in a gradient, which is the stop the tint sets. */
const TOP_STOP = /rgb\([^)]*\)|oklch\([^)]*\)|oklab\([^)]*\)|lab\([^)]*\)/

async function slide(page: Page) {
  return await page.evaluate(() => {
    const copy = [...document.querySelectorAll("[data-feature]")]
    const lit = document.querySelector("[data-tint][data-current]")
    const current = copy.find((node) => node.hasAttribute("data-current"))

    if (!lit || !current) {
      throw new Error("no slide is showing")
    }

    const style = getComputedStyle(current)

    return {
      count: copy.length,
      index: copy.indexOf(current),
      tint: lit.getAttribute("data-tint") ?? "",
      gradient: getComputedStyle(lit).backgroundImage,
      property: style.transitionProperty,
      duration: style.transitionDuration,
      easing: style.transitionTimingFunction,
      /** Everything not showing is faded out and taken out of the way, which
       *  is what keeps a hidden panel from swallowing a click. */
      hidden: copy
        .filter((node) => node !== current)
        .map((node) => {
          const other = getComputedStyle(node)

          return `${other.opacity}/${other.pointerEvents}`
        }),
    }
  })
}

/** The specimen is the block on its own, so there is no frame around it
 *  carrying `data-measures` and nothing for `measured()` to wait on. What
 *  this waits for instead is the condition the reads below actually need: a
 *  slide that has been marked as the one showing. */
async function specimen(page: Page, width = 1440) {
  await page.setViewportSize({ width, height: 1200 })
  await page.goto(SPECIMEN)
  await expect(page.locator("[data-tint][data-current]")).toHaveCount(1)
  await expect(page.locator("[data-feature][data-current]")).toHaveCount(1)
}

test("five features, one showing, the rest faded out and out of the way", async ({
  page,
}) => {
  await specimen(page)

  const showing = await slide(page)

  expect(showing.count, "the five the file draws").toBe(5)
  expect(showing.index, "and the first is the one in").toBe(0)
  expect(
    [...new Set(showing.hidden)],
    "every other panel is transparent and untouchable",
  ).toEqual(["0/none"])
})

test("moving between two features is a fade, not a slide", async ({ page }) => {
  await specimen(page)

  const showing = await slide(page)

  /** The live page stacks every panel at `absolute inset-0` and puts only
   *  opacity in transition. A block that slid would need a transform here,
   *  and there is none: this fails the moment one is added. */
  expect(showing.property, "opacity is the only thing that moves").toBe(
    DRAWN.fade.property,
  )
  expect(showing.duration, "over the measured 300ms").toBe(DRAWN.fade.duration)
  expect(showing.easing, "on the browser's own ease-in-out").toBe(
    DRAWN.fade.easing,
  )
})

test("each feature brings the tint the file gives it", async ({ page }) => {
  await specimen(page)

  const seen: string[] = []

  for (let step = 0; step < 5; step++) {
    const showing = await slide(page)
    const stop = TOP_STOP.exec(showing.gradient)?.[0]

    expect(stop, `slide ${String(step)} paints a gradient`).toBeDefined()

    const tint = showing.tint as keyof typeof DRAWN.tints

    expect(await painted(page, stop ?? ""), `the ${tint} stop`).toBe(
      DRAWN.tints[tint],
    )

    seen.push(tint)

    await page.getByLabel("Next feature").click()
  }

  expect(seen, "in the order the file lists them").toEqual([
    "yellow",
    "olive",
    "emerald",
    "blue",
    "violet",
  ])
})

test("it loops both ways, so neither arrow is ever dead", async ({ page }) => {
  await specimen(page)

  const previous = page.getByLabel("Previous feature")
  const next = page.getByLabel("Next feature")

  /** Measured on the live page: `prev` on the first feature goes to the last,
   *  and neither button is ever disabled. A block that stopped at the ends
   *  would need one, which is why both are asserted rather than the wrap
   *  alone. */
  await previous.click()
  expect((await slide(page)).index, "back from the first is the last").toBe(4)

  await next.click()
  expect(
    (await slide(page)).index,
    "and forward from the last is the first",
  ).toBe(0)

  await expect(previous, "the back arrow is never disabled").toBeEnabled()
  await expect(next, "nor the forward one").toBeEnabled()
})

test("the reading side holds still while the picture side turns", async ({
  page,
}) => {
  await specimen(page)

  const panels = await page.evaluate(() => {
    const frame = document.querySelector("[data-slot='feature-slider-frame']")
    const left = frame?.children[0]
    const copy = document.querySelector("[data-slot='feature-slider-copy']")
    const media = document.querySelector("[data-slot='feature-slider-media']")

    if (!left || !copy || !media) {
      throw new Error("the frame is not built the way this reads it")
    }

    const ground = getComputedStyle(left).backgroundImage

    return {
      stops: [...ground.matchAll(/rgb\([^)]*\)/g)].map((match) => match[0]),
      copyFloor: getComputedStyle(copy).minHeight,
      mediaFloor: getComputedStyle(media).minHeight,
      live: copy.getAttribute("aria-live"),
    }
  })

  /** The copy panel's gradient is the same on all five. Only the panel beside
   *  it carries the tint, which is what lets a reader keep their place. */
  expect(
    await Promise.all(panels.stops.map((stop) => painted(page, stop))),
    "beige into white, whichever feature is showing",
  ).toEqual([DRAWN.ground.beige, DRAWN.ground.white])

  /** Floors rather than fixed heights: the fifth feature is three lines
   *  longer than the third, and without these the frame would jump as the
   *  words changed. */
  expect(panels.copyFloor, "the copy panel has a floor").toBe(DRAWN.copyFloor)
  expect(panels.mediaFloor, "so does the artwork").toBe(DRAWN.mediaFloor)
  expect(panels.live, "and the change is announced").toBe("polite")
})

test("the words hold the middle and the arrows hold the floor", async ({
  page,
}) => {
  await specimen(page)

  /** Two things at once, because one without the other is what went wrong:
   *  the arrows are pushed to the bottom of the panel and the copy centres in
   *  whatever is left. Built with the copy at the top of that space instead,
   *  a two-line feature left the panel looking top-heavy while the arrows sat
   *  a long way under it.
   *
   *  Measured as the gap above the words against the gap below them, on every
   *  feature, because the five are 95 to 153 pixels tall and a centring that
   *  only held for one of them would not be one. */
  for (let step = 0; step < 5; step++) {
    const room = await page.evaluate(() => {
      const frame = document.querySelector("[data-slot='feature-slider-frame']")
      const panel = frame?.children[0]
      const copy = document.querySelector("[data-feature][data-current]")
      const arrows = document.querySelector(
        "[aria-label='Previous feature']",
      )?.parentElement

      if (!panel || !copy || !arrows) {
        throw new Error("the panel is not built the way this reads it")
      }

      const box = panel.getBoundingClientRect()
      const words = copy.getBoundingClientRect()
      const controls = arrows.getBoundingClientRect()
      const style = getComputedStyle(panel)

      return {
        title: copy.textContent.slice(0, 20),
        above: Math.round(words.top - (box.top + parseFloat(style.paddingTop))),
        below: Math.round(
          controls.top - parseFloat(style.rowGap) - words.bottom,
        ),
        footed: Math.round(
          box.bottom - controls.bottom - parseFloat(style.paddingBottom),
        ),
      }
    })

    expect(
      room.above - room.below,
      `"${room.title}" sits in the middle of the room it has`,
    ).toBe(0)
    expect(room.footed, "and the arrows are on the panel's floor").toBe(0)

    await page.getByLabel("Next feature").click()
  }
})

test("the arrow lights on hover and does nothing else", async ({ page }) => {
  await specimen(page)

  const next = page.getByLabel("Next feature")
  const read = async () =>
    await next.evaluate((node) => {
      const style = getComputedStyle(node)

      return {
        ground: style.backgroundColor,
        border: style.borderTopColor,
        shadow: style.boxShadow,
        transform: style.transform,
        duration: style.transitionDuration,
      }
    })

  await page.mouse.move(0, 0)

  const rest = await read()

  await next.hover()

  /** The ground takes 150ms to get there, so this waits for it to arrive
   *  rather than reading the colour it was on the way from. Read straight
   *  after the hover, the answer is still white. */
  await expect
    .poll(async () => await painted(page, (await read()).ground))
    .toBe(DRAWN.ground.hover)

  const over = await read()

  /** White to beige-100, and measured on the live page that is the whole of
   *  it: the border, the shadow and the geometry are the same either way. */
  expect(await painted(page, rest.ground), "white at rest").toBe(
    DRAWN.ground.white,
  )
  expect(over.duration, "over the measured 150ms").toBe(DRAWN.hover)
  expect(over.border, "the border does not move").toBe(rest.border)
  expect(over.shadow, "nor the shadow").toBe(rest.shadow)
  expect(over.transform, "nor the geometry").toBe(rest.transform)
})

test("the tints do not turn on a dark page, and the panel beside them does", async ({
  page,
}) => {
  /** Set before the first style is computed, and on `DOMContentLoaded` rather
   *  than sooner: an init script runs before the root element is parsed, so
   *  reaching for `document.documentElement` there throws and takes the
   *  listener with it. */
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add("dark")
    })
  })

  await specimen(page)
  await expect(page.locator("html")).toHaveClass(/\bdark\b/)

  /** The decision this locks: the five tints carry straight through, and the
   *  panel of copy beside them drops to the page's own ground. Two other
   *  treatments were built and turned down — each ramp at its 950, and no
   *  colour at all — so a `dark:` appearing on a tint later is a reversal
   *  rather than a fix, and this is what says so. */
  for (let step = 0; step < 5; step++) {
    const showing = await slide(page)
    const stop = TOP_STOP.exec(showing.gradient)?.[0]
    const tint = showing.tint as keyof typeof DRAWN.tints

    expect(
      await painted(page, stop ?? ""),
      `the ${tint} stop is the one the file draws, in either theme`,
    ).toBe(DRAWN.tints[tint])

    await page.getByLabel("Next feature").click()
  }

  const copy = await page.evaluate(() => {
    const frame = document.querySelector("[data-slot='feature-slider-frame']")
    const panel = frame?.children[0]

    if (!panel) {
      throw new Error("no copy panel to measure")
    }

    const style = getComputedStyle(panel)

    return { ground: style.backgroundColor, image: style.backgroundImage }
  })

  expect(copy.image, "the beige wash is dropped in the dark").toBe("none")
  expect(
    await painted(page, copy.ground),
    "and the copy panel stands on the page's own ground",
  ).toBe(DRAWN.ground.dark)
})

test("one system, one violet: the slider and the segment rows agree", async ({
  page,
}) => {
  /** The regression this exists for. Both blocks were read out of the design
   *  file on their own and both got a violet, but not the same one: the file
   *  draws this slide in `purple/200` and the segment in `violet/200`, 0.0231
   *  apart in OKLab. Close enough that neither page looked wrong by itself,
   *  and only wrong when someone put them side by side.
   *
   *  Pinning the slider's hex alone would not have caught it, because the
   *  slider was never the one that drifted. So this reads both, and a change
   *  to either fails it. */
  const stop = async (path: string, selector: string) => {
    await page.goto(path)
    await expect(page.locator(selector)).toHaveCount(1)

    return await page.evaluate((target) => {
      const node = document.querySelector(target)

      if (!node) {
        throw new Error(`nothing at ${target}`)
      }

      const found = /rgb\([^)]*\)|oklch\([^)]*\)|oklab\([^)]*\)/.exec(
        getComputedStyle(node).backgroundImage,
      )

      if (!found) {
        throw new Error(`no gradient at ${target}`)
      }

      return found[0]
    }, selector)
  }

  const slider = await stop(SPECIMEN, "[data-tint='violet']")
  const segment = await stop(
    "/specimens/segment-rows",
    "[data-slot='segment-rows-card'].from-violet-200",
  )

  expect(await painted(page, slider), "the slider's violet").toBe(
    DRAWN.tints.violet,
  )
  expect(
    await painted(page, segment),
    "and the segment rows paint the same one",
  ).toBe(DRAWN.tints.violet)
})

test("the two halves stack below the one breakpoint there is", async ({
  page,
}) => {
  const columns = async () =>
    await page.evaluate(() => {
      const frame = document.querySelector("[data-slot='feature-slider-frame']")

      if (!frame) {
        throw new Error("no frame to measure")
      }

      return getComputedStyle(frame).gridTemplateColumns.split(" ").length
    })

  await specimen(page, 1024)
  expect(await columns(), "two halves at the breakpoint").toBe(2)

  await specimen(page, 1023)
  expect(await columns(), "and one column a pixel below it").toBe(1)
})
