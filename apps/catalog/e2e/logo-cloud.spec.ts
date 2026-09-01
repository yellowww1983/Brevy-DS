import { expect, test } from "./catalog-test"
import { measured } from "./settled"

const PAGE = "/blocks/logo-cloud"
const SPECIMEN = "/specimens/logo-cloud"

/** The band as the file draws it (`22616:8666`) and as the live page runs it —
 *  the file draws it standing still, so the motion is measured off brevy.com. */
const DRAWN = {
  band: 122,
  narrow: 90,
  olive500: "rgb(215, 228, 201)",
  gap: "40px",
  marks: 4,
  mark: 36,
  lap: "40s",
  fade: 48,
}

/** Where the ramp is read. Four points inside the fade and two past it. */
const COLUMNS = [6, 18, 30, 42, 96, 400]

test("the band is a band and not a section", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='logo-cloud']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        height: Math.round(node.getBoundingClientRect().height),
        ground: style.backgroundColor,
        padding: style.padding,
        clipped: style.overflow,
        label: node.getAttribute("aria-label"),
        masked: style.maskImage,
      }
    })

  expect(read.height).toBe(DRAWN.band)
  expect(read.ground).toBe(DRAWN.olive500)
  /** Every other section in the file breathes 96 above and below. This one is
   *  given none, which is what makes it a band. */
  expect(read.padding).toBe("0px")
  /** The band clips nothing itself and wears no mask. Both belong to the
   *  strip inside it, because a mask is alpha over everything beneath it and
   *  would take the olive along with the marks. */
  expect(read.clipped).toBe("visible")
  expect(read.masked).toBe("none")
  /** Without it the band announces a list of pictures with no reason for
   *  being there. */
  expect(read.label).toBeTruthy()
})

test("the ends fade rather than cut, and the ground does not fade with them", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const mask = await page
    .locator("[data-slot='logo-cloud-clip']")
    .evaluate((node) => ({
      image: getComputedStyle(node).maskImage,
      clipped: getComputedStyle(node).overflow,
    }))

  /** The live page's own declaration, to the pixel. */
  expect(mask.image).toBe(
    "linear-gradient(to right, rgba(0, 0, 0, 0), rgb(0, 0, 0) 48px, rgb(0, 0, 0) calc(100% - 48px), rgba(0, 0, 0, 0))",
  )
  expect(mask.clipped).toBe("hidden")

  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme })

    /** The band keeps its own colour out to both edges. Read off the pixels,
     *  because hit testing ignores a mask entirely — the row is still under
     *  the cursor at the very edge, it is just no longer painted there. A
     *  mask one level up would have taken the ground with it and left the
     *  page showing through the ends. */
    const shot = (
      await page.locator("[data-slot='logo-cloud']").screenshot()
    ).toString("base64")

    const ends = await page
      .locator("[data-slot='logo-cloud']")
      .evaluate(async (node, shot) => {
        const bitmap = await createImageBitmap(
          await (await fetch(`data:image/png;base64,${shot}`)).blob(),
        )
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
        const context = canvas.getContext("2d")

        if (!context) {
          return null
        }

        context.drawImage(bitmap, 0, 0)

        const box = node.getBoundingClientRect()
        const ratio = bitmap.width / box.width
        const at = (x: number) => {
          const pixel = context.getImageData(
            Math.round(x * ratio),
            Math.round((box.height / 2) * ratio),
            1,
            1,
          ).data

          return [pixel[0] ?? 0, pixel[1] ?? 0, pixel[2] ?? 0]
        }

        const swatch = document.createElement("canvas").getContext("2d")

        if (!swatch) {
          return null
        }

        swatch.fillStyle = getComputedStyle(node).backgroundColor
        swatch.fillRect(0, 0, 1, 1)
        const ground = swatch.getImageData(0, 0, 1, 1).data

        return {
          left: at(1),
          right: at(box.width - 2),
          ground: [ground[0] ?? 0, ground[1] ?? 0, ground[2] ?? 0],
        }
      }, shot)

    expect(ends?.left, `left edge in ${scheme}`).toEqual(ends?.ground)
    expect(ends?.right, `right edge in ${scheme}`).toEqual(ends?.ground)
  }

  await page.emulateMedia({ colorScheme: null })
})

test("the marks are doubled, and the copy is not announced twice", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const rows = await page
    .locator("[data-slot='logo-cloud-row']")
    .evaluateAll((nodes) =>
      nodes.map((node) => ({
        hidden: node.getAttribute("aria-hidden"),
        width: Math.round(node.getBoundingClientRect().width),
        marks: node.querySelectorAll("[data-slot='logo-cloud-logo']").length,
        gap: getComputedStyle(node).gap,
      })),
    )

  expect(rows).toHaveLength(2)
  expect(rows[0]?.hidden).toBeNull()
  /** The spare copy exists so the loop has no seam, not so a reader hears the
   *  partners twice. */
  expect(rows[1]?.hidden).toBe("true")
  expect(rows[0]?.marks).toBe(DRAWN.marks)
  expect(rows[1]?.marks).toBe(DRAWN.marks)
  expect(rows[0]?.gap).toBe(DRAWN.gap)
  expect(rows[0]?.width).toBe(rows[1]?.width)

  const track = await page
    .locator("[data-slot='logo-cloud-track']")
    .evaluate((node) => Math.round(node.getBoundingClientRect().width))

  /** The slide is exactly one copy's width, so it can only be seamless if the
   *  track is exactly two of them. */
  expect(track).toBe((rows[0]?.width ?? 0) * 2)
})

test("the track is two copies wherever the marks overflow the band", async ({
  page,
}) => {
  /** The marks come from outside the block, so a copy can be wider than the
   *  band — and a flex item shrinks to its container by default, which left
   *  the track exactly as wide as the band and turned the 50% it slides into
   *  something that was not a copy. It held only while the marks were small
   *  enough to fit, which is why the first four placeholders never caught it. */
  for (const width of [1440, 900, 390]) {
    await page.setViewportSize({ width, height: 400 })
    await page.goto(SPECIMEN)

    const read = await page
      .locator("[data-slot='logo-cloud-track']")
      .evaluate((node) => ({
        shrink: getComputedStyle(node).flexShrink,
        track: Math.round(node.getBoundingClientRect().width),
        row: Math.round(
          node
            .querySelector("[data-slot='logo-cloud-row']")
            ?.getBoundingClientRect().width ?? 0,
        ),
        band: Math.round(
          node.parentElement?.getBoundingClientRect().width ?? 0,
        ),
      }))

    expect(read.shrink).toBe("0")
    expect(read.track).toBe(read.row * 2)
    /** And a copy is never narrower than the band, or the far end of it sits
     *  empty for part of every lap. */
    expect(read.row).toBeGreaterThanOrEqual(read.band)
  }
})

test("the marks fit the band and stand at one height", async ({ page }) => {
  for (const [width, band] of [
    [1440, DRAWN.band],
    [390, DRAWN.narrow],
  ] as const) {
    await page.setViewportSize({ width, height: 400 })
    await page.goto(SPECIMEN)
    await page.waitForFunction(() =>
      [...document.images].every((image) => image.complete),
    )

    const marks = await page
      .locator("[data-slot='logo-cloud-logo']")
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const box = node.getBoundingClientRect()
          return {
            width: Math.round(box.width),
            height: Math.round(box.height),
          }
        }),
      )

    expect(marks).toHaveLength(DRAWN.marks * 2)

    for (const mark of marks) {
      expect(mark.height).toBe(DRAWN.mark)
      expect(mark.height).toBeLessThan(band)
      /** A real mark is a wordmark, not a box: none of the four is square. */
      expect(mark.width).toBeGreaterThan(mark.height)
    }
  }
})

test("the band scrolls, and holds under the cursor", async ({ page }) => {
  await page.goto(SPECIMEN)

  const state = () =>
    page
      .locator("[data-slot='logo-cloud-track']")
      .evaluate((node) => getComputedStyle(node).animationPlayState)

  const animation = await page
    .locator("[data-slot='logo-cloud-track']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        name: style.animationName,
        lap: style.animationDuration,
        timing: style.animationTimingFunction,
        laps: style.animationIterationCount,
      }
    })

  expect(animation.name).toBe("marquee")
  expect(animation.lap).toBe(DRAWN.lap)
  expect(animation.timing).toBe("linear")
  expect(animation.laps).toBe("infinite")

  const box = await page.locator("[data-slot='logo-cloud']").boundingBox()
  const clear = { x: (box?.width ?? 0) / 2, y: (box?.height ?? 0) + 200 }

  /** Put the pointer somewhere before asking whether the band is hovered.
   *
   *  The pointer starts at 0,0, and on a specimen page that is the band —
   *  it runs edge to edge from the top of the document. So the band opens
   *  already held, and a spec that reads the play state without moving
   *  first is reading a hover nobody performed. It is only visible on a
   *  machine that leaves the pointer there, which is why this passed here
   *  and failed on CI three times running. */
  await page.mouse.move(clear.x, clear.y)
  await expect.poll(state).toBe("running")

  /** The band is the hover target and not the track: a cursor cannot hold
   *  still on a strip that is sliding out from under it. */
  await page.mouse.move(
    (box?.x ?? 0) + (box?.width ?? 0) / 2,
    (box?.y ?? 0) + (box?.height ?? 0) / 2,
  )

  await expect.poll(state).toBe("paused")

  await page.mouse.move(clear.x, clear.y)
  await expect.poll(state).toBe("running")
})

test("half a lap slides exactly half a copy, so the loop has no seam", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  /** Drive the timeline rather than wait on it.
   *
   *  Asking whether the track has moved yet is a question about the machine —
   *  the first version of this read the track's box, which a composited
   *  transform never touches, and the second read the animation's own clock,
   *  which did not advance on CI either. Neither was the thing worth
   *  asserting. Setting `currentTime` asks what the keyframes actually do,
   *  gets the same answer everywhere, and proves the claim the block rests
   *  on: one lap slides exactly one copy's width, so the second copy lands
   *  where the first began.
   *
   *  Read at half a lap rather than at the end. The animation loops, so the
   *  full duration is already the next lap's zero. */
  const read = await page
    .locator("[data-slot='logo-cloud-track']")
    .evaluate((node) => {
      const [animation] = node.getAnimations()

      if (!animation) {
        return null
      }

      animation.pause()
      animation.currentTime = 0
      const from = new DOMMatrix(getComputedStyle(node).transform).m41

      const lap = animation.effect?.getTiming().duration
      animation.currentTime = typeof lap === "number" ? lap / 2 : 0
      const half = new DOMMatrix(getComputedStyle(node).transform).m41

      const row = node.querySelector("[data-slot='logo-cloud-row']")

      return {
        from,
        half,
        row: row ? row.getBoundingClientRect().width : 0,
        track: node.getBoundingClientRect().width,
      }
    })

  expect(read).not.toBeNull()
  expect(read?.from).toBe(0)
  /** The track is two copies, and half a lap is a quarter of it. */
  expect(read?.half).toBeCloseTo(-(read?.row ?? 0) / 2, 0)
  expect(read?.track).toBeCloseTo((read?.row ?? 0) * 2, 0)
})

test("the seam measures the same as every other space in the band", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 400 })
    await page.goto(SPECIMEN)
    await page.waitForFunction(() =>
      [...document.images].every((image) => image.complete),
    )

    const gaps = await page
      .locator("[data-slot='logo-cloud-track']")
      .evaluate((node) => {
        const marks = [
          ...node.querySelectorAll("[data-slot='logo-cloud-logo']"),
        ]

        return marks
          .slice(1)
          .map((mark, index) =>
            Math.round(
              mark.getBoundingClientRect().left -
                (marks[index]?.getBoundingClientRect().right ?? 0),
            ),
          )
      })

    /** The middle one of these is the seam — the space between the last mark
     *  of the first copy and the first mark of the second. If it measured
     *  anything else, the loop would stutter once a lap. */
    expect(new Set(gaps).size, `gaps at ${String(width)}`).toBe(1)
  }
})

test("a mark arrives over 48 rather than at an edge", async ({ page }) => {
  await page.goto(SPECIMEN)
  await page.waitForFunction(() =>
    [...document.images].every((image) => image.complete),
  )

  /** Park a frame with a mark's own strokes lying right across the ramp, so
   *  there is something there to be faded. */
  await page.locator("[data-slot='logo-cloud-track']").evaluate((node) => {
    const [animation] = node.getAnimations()

    if (!animation) {
      return
    }

    animation.pause()

    const lap = animation.effect?.getTiming().duration
    const duration = typeof lap === "number" ? lap : 0
    let best = 0
    let reach = -Infinity

    for (let step = 0; step < 400; step++) {
      animation.currentTime = (duration * step) / 400

      for (const mark of node.querySelectorAll(
        "[data-slot='logo-cloud-logo']",
      )) {
        const box = mark.getBoundingClientRect()

        if (box.left < -20 && box.right > 30 && box.right > reach) {
          reach = box.right
          best = (duration * step) / 400
        }
      }
    }

    animation.currentTime = best
  })

  /** Read the fade off what it does rather than off what it says: the same
   *  frame twice, once masked and once not. The ratio between them is the
   *  mask's own alpha at that column. */
  const ink = async () => {
    const shot = (
      await page.locator("[data-slot='logo-cloud']").screenshot()
    ).toString("base64")

    return page.locator("[data-slot='logo-cloud']").evaluate(
      async (node, { shot, columns }) => {
        const bitmap = await createImageBitmap(
          await (await fetch(`data:image/png;base64,${shot}`)).blob(),
        )
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
        const context = canvas.getContext("2d")

        if (!context) {
          return []
        }

        context.drawImage(bitmap, 0, 0)

        const box = node.getBoundingClientRect()
        const ratio = bitmap.width / box.width
        const level = (x: number, y: number) => {
          const pixel = context.getImageData(
            Math.round(x * ratio),
            Math.round(y * ratio),
            1,
            1,
          ).data

          return ((pixel[0] ?? 0) + (pixel[1] ?? 0) + (pixel[2] ?? 0)) / 3
        }

        const ground = level(2, 2)

        return columns.map((x) => {
          let most = 0

          for (let y = 10; y < box.height - 10; y++) {
            most = Math.max(most, Math.abs(level(x, y) - ground))
          }

          return most
        })
      },
      { shot, columns: COLUMNS },
    )
  }

  const masked = await ink()

  await page.locator("[data-slot='logo-cloud-clip']").evaluate((node) => {
    node.style.setProperty("mask-image", "none")
  })

  const plain = await ink()

  expect(
    plain.some((value) => value > 20),
    "the frame has ink to fade",
  ).toBe(true)

  COLUMNS.forEach((x, index) => {
    const raw = plain[index] ?? 0

    if (raw < 20) {
      return
    }

    const alpha = (masked[index] ?? 0) / raw
    expect(alpha, `alpha at ${String(x)}px`).toBeCloseTo(Math.min(1, x / 48), 1)
  })
})

test("no moment in the lap leaves the band empty", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 400 })
    await page.goto(SPECIMEN)
    await page.waitForFunction(() =>
      [...document.images].every((image) => image.complete),
    )

    /** Walked rather than watched: forty points around the lap, each one a
     *  question about geometry rather than about how fast this machine is. */
    const uncovered = await page
      .locator("[data-slot='logo-cloud-track']")
      .evaluate((node) => {
        const [animation] = node.getAnimations()
        const band = node.parentElement

        if (!animation || !band) {
          return null
        }

        const lap = animation.effect?.getTiming().duration
        const duration = typeof lap === "number" ? lap : 0
        animation.pause()

        let worst = Infinity

        for (let step = 0; step <= 40; step++) {
          animation.currentTime = (duration * step) / 40
          const track = node.getBoundingClientRect()
          const box = band.getBoundingClientRect()
          worst = Math.min(
            worst,
            box.left - track.left,
            track.right - box.right,
          )
        }

        return Math.round(worst)
      })

    expect(uncovered, `uncovered at ${String(width)}`).toBeGreaterThanOrEqual(0)
  }
})

test("the sliding stops for anyone who asked it to", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='logo-cloud-track']")
    .evaluate((node) => getComputedStyle(node).animationName)

  expect(read).toBe("none")

  /** The band still reads. Only the sliding goes. */
  await expect(
    page.locator("[data-slot='logo-cloud-logo']").first(),
  ).toBeVisible()

  await context.close()
})

test("the marks are flattened, and nothing else is done to them", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='logo-cloud-logo']")
    .first()
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return { filter: style.filter, opacity: style.opacity }
    })

  expect(read.filter).toBe("grayscale(1)")
  /** The live page dims nothing — its filter is `grayscale(1)` and its
   *  opacity is 1. Its marks read muted because a brand mark flattened is a
   *  middle grey, which is the artwork's doing and not the band's. A dimming
   *  here would take a client's own mark lighter than the page it is copied
   *  from. */
  expect(read.opacity).toBe("1")

  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(SPECIMEN)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  const dark = await page
    .locator("[data-slot='logo-cloud']")
    .evaluate((node) => {
      const mark = node.querySelector("[data-slot='logo-cloud-logo']")
      return {
        ground: getComputedStyle(node).backgroundColor,
        filter: mark ? getComputedStyle(mark).filter : null,
      }
    })

  /** The olive band is a tint and darkens with the page — a pale band under a
   *  dark page is a light plate. */
  expect(dark.ground).toBe("oklch(0.145 0 none)")
  /** And the flattened marks invert, because a dark mark on a dark band is a
   *  hole. */
  expect(dark.filter).toBe("grayscale(1) invert(1)")
})

test("the band narrows on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await page.goto(SPECIMEN)

  expect(
    await page
      .locator("[data-slot='logo-cloud']")
      .evaluate((node) => Math.round(node.getBoundingClientRect().height)),
  ).toBe(DRAWN.narrow)
})

test("the catalog frames the band at all three widths", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  await expect(page.locator("iframe")).toHaveCount(1)

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
