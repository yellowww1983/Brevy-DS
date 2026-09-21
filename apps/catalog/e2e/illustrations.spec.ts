import { expect, test, type Page } from "./catalog-test"

test.use({ viewport: { width: 1280, height: 1100 } })

const PAGE = "/getting-started/illustrations"

const FIGURE = "figure[data-slot='illustration']"

/** Brings every drawing into view and waits until the one showing has loaded.
 *
 *  They are lazy, which is the point of the gallery, and a lazy image that has
 *  not loaded reports an empty `currentSrc`. Reading straight after `goto`
 *  gets that empty string and compares it happily against another one. */
async function loaded(page: Page) {
  const figures = page.locator(FIGURE)

  for (let index = 0; index < (await figures.count()); index++) {
    const figure = figures.nth(index)

    await figure.scrollIntoViewIfNeeded()
    await figure
      .locator("img:visible")
      .first()
      .evaluate((image) =>
        image instanceof HTMLImageElement &&
        image.complete &&
        image.naturalWidth > 0
          ? null
          : new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true })
            }),
      )
  }
}

/** Reads every drawing on the page: which file is showing, how it is drawn,
 *  and how many files the tile carries. */
async function drawings(page: Page) {
  return await page.locator(FIGURE).evaluateAll((figures) =>
    figures.map((figure) => {
      const images = [...figure.querySelectorAll("img")]
      const shown = images.filter(
        (image) => image.getBoundingClientRect().width > 0,
      )
      const first = shown[0]

      return {
        id: figure.getAttribute("data-id") ?? "",
        files: images.length,
        showing: shown.length,
        source: first
          ? decodeURIComponent(first.currentSrc)
              .replace(/^.*?url=/, "")
              .split("&")[0]
          : "",
        ratio: first
          ? Math.round(
              (Number(first.getAttribute("width")) /
                Number(first.getAttribute("height"))) *
                100,
            ) / 100
          : 0,
        lazy: images.every((image) => image.loading === "lazy"),
      }
    }),
  )
}

const inTheme = async (page: Page, theme: "light" | "dark") => {
  await page.goto(PAGE)
  await page.evaluate((name) => {
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(name)
  }, theme)

  await loaded(page)

  return drawings(page)
}

test("one drawing shows at a time, whichever theme is on", async ({ page }) => {
  const light = await inTheme(page, "light")
  const dark = await inTheme(page, "dark")

  expect(light.length, "an empty gallery would pass on nothing").toBe(5)
  expect(dark).toHaveLength(light.length)

  for (const drawing of [...light, ...dark]) {
    expect(
      drawing.showing,
      `${drawing.id}: a pair swapped by class shows one of the two, never both`,
    ).toBe(1)
  }
})

test("the seasons run in the order a year does", async ({ page }) => {
  await page.goto(PAGE)
  await loaded(page)

  /** They are one composition painted four times, so the row is read as a set
   *  and a set in the wrong order reads as four unrelated pictures. */
  const seasons = await page
    .locator("[data-slot='seasons'] figure[data-slot='illustration']")
    .evaluateAll((figures) =>
      figures.map((figure) => figure.getAttribute("data-id") ?? ""),
    )

  expect(seasons).toEqual(["spring", "summer", "fall", "winter"])
})

test("one file each, because a scene carries no ground of its own", async ({
  page,
}) => {
  const light = await inTheme(page, "light")
  const dark = await inTheme(page, "dark")

  /** Nothing here is drawn twice. The sky and the ground are clear, so the page
   *  supplies them and the theme changes that rather than the drawing. A second
   *  file turning up would mean somebody had painted a ground in. */
  for (const [index, drawing] of light.entries()) {
    expect(drawing.files, `${drawing.id}: one file`).toBe(1)
    expect(dark[index]?.id, "the same drawings in the same order").toBe(
      drawing.id,
    )
    expect(
      dark[index]?.source,
      `${drawing.id}: and it holds in both themes`,
    ).toBe(drawing.source)
  }
})

test("the seasons ship on white, not on the design tool's grey", async ({
  page,
}) => {
  await page.goto(PAGE)
  await loaded(page)

  /** They come out of the file on a flat `#ededed`, which is about half of
   *  every one of them, because the sky is clear there. It is replaced with
   *  white on the way in. A re-export that skipped that step would ship half a
   *  rectangle of grey behind the painting, which reads as a box rather than a
   *  drawing and is invisible in a diff. */
  /** Polled rather than read once. The optimizer can still be generating on
   *  the first request after a build, and a canvas drawn from a half-served
   *  image reports whatever it has so far. */
  const sample = async () =>
    await page.locator("[data-slot='seasons'] img").evaluateAll((images) =>
      images.map((image) => {
        if (!(image instanceof HTMLImageElement) || image.naturalWidth === 0) {
          return "not ready"
        }

        const canvas = document.createElement("canvas")
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight

        const context = canvas.getContext("2d")

        if (!context) {
          return "no canvas"
        }

        context.drawImage(image, 0, 0)

        /** The top left corner is sky in all four. */
        const pixel = context.getImageData(4, 4, 1, 1).data

        return `${String(pixel[0])},${String(pixel[1])},${String(pixel[2])},${String(pixel[3])}`
      }),
    )

  await expect
    .poll(sample, {
      message: "white, opaque, and not the tool's #ededed",
    })
    .toEqual([
      "255,255,255,255",
      "255,255,255,255",
      "255,255,255,255",
      "255,255,255,255",
    ])

  const grounds = await sample()

  expect(grounds, "four of them").toHaveLength(4)

  expect(
    grounds.every((ground) => ground === "255,255,255,255"),
    "and it stays that way once it has settled",
  ).toBe(true)
})

test("each drawing keeps its own proportion, and none of them plays", async ({
  page,
}) => {
  await page.goto(PAGE)
  await loaded(page)

  const shapes = await drawings(page)

  /** The seasons are bands at 1440 by 426 and the wash is 1440 by 685. One
   *  aspect for all of them would crop something, so the gallery has no shared
   *  one and this is what notices if it gains one. */
  expect(new Set(shapes.map((drawing) => drawing.ratio)).size).toBeGreaterThan(
    1,
  )
  expect(
    shapes.find((drawing) => drawing.id === "spring")?.ratio,
    "a season is a band",
  ).toBeGreaterThan(3)
  expect(
    shapes.find((drawing) => drawing.id === "wash")?.ratio,
    "and the wash is deeper than one",
  ).toBeLessThan(3)

  /** The first drawing is above the fold, so it is the one told to load with
   *  the page. Everything after it waits to be reached, which is the whole of
   *  what this gallery needs in place of a play button. */
  const [first, ...rest] = shapes

  expect(first?.lazy, `${first?.id ?? "?"}: the first one is not lazy`).toBe(
    false,
  )

  for (const drawing of rest) {
    expect(drawing.lazy, `${drawing.id}: waits to be reached`).toBe(true)
  }

  /** The difference between this gallery and the two in Animations. Those
   *  carry a button because a video must not be fetched until somebody asks;
   *  a picture has no such problem and a button would be furniture. */
  await expect(page.locator(`${FIGURE} button`)).toHaveCount(0)
})

test("the page shows the five that have no moving version", async ({
  page,
}) => {
  await page.goto(PAGE)
  await loaded(page)

  /** The whole reason for choosing these five. Four scenes in `Animations:
   *  Video` are the same artwork moving and the login panel is a still of one
   *  of them, so any of those here would be the same drawing under two
   *  headings. */
  const sources = (await drawings(page)).map((drawing) => drawing.source)

  const moving = await page.request
    .get("/llms-full.txt")
    .then((response) => response.text())

  expect(
    moving,
    "the video library is still there to be distinct from",
  ).toContain("# Animations: Video")

  for (const source of sources) {
    expect(
      source,
      "no poster from the video library is shown here",
    ).not.toContain("/video/poster/")
    expect(source, "and not the login panel, which is one of those").not.toBe(
      "/auth/photo.webp",
    )
  }
})
