import { expect, test } from "./catalog-test"

/** The gallery's one promise is that it costs nothing to arrive at.
 *
 *  Sixteen animations are 767KB. A tile that drew its still by loading its
 *  animation would spend all of that on the way down the page, which is the
 *  weight the library was re-encoded to avoid. So a tile shows a poster until
 *  it is pressed, and the file is fetched then.
 *
 *  That is a promise about what the browser asks for, and nothing on the page
 *  shows whether it is being kept. It has to be watched from outside, which is
 *  what this does: every request is recorded, the whole page is scrolled, and
 *  the count of animations fetched has to still be zero. */

const LOTTIE = "/getting-started/animations/lottie"
const VIDEO = "/getting-started/animations/video"

/** The preloader plays the wordmark, so its own file turns up whatever the
 *  gallery does. It is not one of the sixteen. */
const PRELOADER = "brevy-logo.json"

test.use({ viewport: { width: 1440, height: 1000 } })

test("scrolling the whole gallery fetches no animation, and one press fetches one", async ({
  page,
}) => {
  const fetched: string[] = []

  page.on("request", (request) => {
    const url = new URL(request.url())

    if (url.pathname.startsWith("/lottie/") && url.pathname.endsWith(".json")) {
      fetched.push(url.pathname.split("/").pop() ?? "")
    }
  })

  await page.goto(LOTTIE)
  await page.locator("h1").waitFor()

  /** Every tile, not only the ones the first screen holds: the point is that
   *  passing over one costs nothing either. */
  const tiles = page.locator("[data-gallery='lottie'] li")
  const count = await tiles.count()

  expect(count, "the gallery is the whole library").toBe(16)

  for (let index = 0; index < count; index += 1) {
    await tiles.nth(index).scrollIntoViewIfNeeded()
  }

  /** The posters have to have arrived, or the scroll proved nothing about
   *  what a loaded tile costs. */
  await expect
    .poll(async () =>
      page.evaluate(() =>
        [...document.images].every((image) => image.complete),
      ),
    )
    .toBe(true)

  expect(
    fetched.filter((file) => file !== PRELOADER),
    "a tile that has not been pressed fetches nothing",
  ).toEqual([])

  const chat = tiles.filter({ hasText: "Eligibility in the chat" })
  await chat.getByRole("button").click()

  /** The player replaces the poster with an SVG of the animation's own
   *  canvas, which is how the page says the file arrived. */
  await expect(chat.locator("svg[viewBox='0 0 422 382']")).toBeVisible()

  expect(
    fetched.filter((file) => file !== PRELOADER),
    "pressing one tile fetches that one file and no other",
  ).toEqual(["11.json"])
})

test("a tile stands at the end of its animation before it is pressed", async ({
  page,
}) => {
  await page.goto(LOTTIE)
  await page.locator("h1").waitFor()

  /** Play until it has run to the end, and replay after. Nothing has been
   *  replayed on a page nobody has pressed, so the whole gallery reads the
   *  same way on arrival. */
  const controls = page.locator("[data-gallery='lottie'] button")

  await expect(controls).toHaveCount(16)

  for (const label of await controls.evaluateAll((buttons) =>
    buttons.map((button) => button.getAttribute("aria-label") ?? ""),
  )) {
    expect(label, "nothing offers a replay before it has played").not.toContain(
      "again",
    )
  }

  const poster = page.locator("[data-gallery='lottie'] img").first()

  await expect(poster).toHaveAttribute("src", /\/lottie\/poster\//)
  await expect
    .poll(async () =>
      poster.evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0)
})

test("play runs from the beginning, not from the frame the poster shows", async ({
  page,
}) => {
  await page.goto(LOTTIE)
  await page.locator("h1").waitFor()

  const chat = page
    .locator("[data-gallery='lottie'] li")
    .filter({ hasText: "Eligibility in the chat" })
  const control = chat.getByRole("button")

  await control.click()
  await expect(chat.locator("svg[viewBox='0 0 422 382']")).toBeVisible()

  /** The poster is the last frame. A player handed the file and left where
   *  the still was would finish the moment it started, and the control would
   *  already be offering a replay. Eight seconds of animation say otherwise. */
  await expect(control).toHaveAttribute(
    "aria-label",
    "Play Eligibility in the chat",
  )

  await expect(control).toHaveAttribute(
    "aria-label",
    "Play Eligibility in the chat again",
    { timeout: 15000 },
  )
})

/** The same promise, kept a different way.
 *
 *  Four videos are five and a half megabytes. `preload="none"` is a request
 *  rather than a rule, and a browser handed a `<video src>` on screen will go
 *  and fetch enough of it to draw a frame regardless. So the element gets no
 *  source at all until someone presses play, and this is what says so. */
test("scrolling the video gallery fetches no video, and one press fetches one", async ({
  page,
}) => {
  const fetched: string[] = []

  page.on("request", (request) => {
    const url = new URL(request.url())

    if (url.pathname.startsWith("/video/") && url.pathname.endsWith(".webm")) {
      fetched.push(url.pathname.split("/").pop() ?? "")
    }
  })

  await page.goto(VIDEO)
  await page.locator("h1").waitFor()

  const scenes = page.locator("[data-gallery='video'] li")
  const count = await scenes.count()

  expect(count, "the gallery is every background").toBe(4)

  for (let index = 0; index < count; index += 1) {
    await scenes.nth(index).scrollIntoViewIfNeeded()
  }

  await expect
    .poll(async () =>
      page.evaluate(() =>
        [...document.images].every((image) => image.complete),
      ),
    )
    .toBe(true)

  expect(fetched, "a scene that has not been pressed fetches nothing").toEqual(
    [],
  )

  const seasons = scenes.filter({ hasText: "A year of seasons" })
  await seasons.getByRole("button").click()

  const film = seasons.locator("video")
  await expect(film).toHaveAttribute(
    "src",
    "/video/seasons2_cycle_v4_F5F2EF.webm",
  )

  /** The attribute lands before the request does, so this waits on the
   *  request rather than reading the moment the element changed. */
  await expect
    .poll(() => fetched, {
      message: "pressing one scene fetches that one file and no other",
    })
    .toEqual(["seasons2_cycle_v4_F5F2EF.webm"])

  /** It runs once. Twenty four seconds of watercolour on a loop is a gallery
   *  nobody can read a caption in. */
  await expect
    .poll(async () => film.evaluate((node: HTMLVideoElement) => node.loop))
    .toBe(false)

  await expect
    .poll(async () => film.evaluate((node: HTMLVideoElement) => node.paused))
    .toBe(false)
})

test("a scene is handed over rather than played where motion is turned down", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" })
  const page = await context.newPage()

  await page.addInitScript(() => {
    sessionStorage.setItem("preloader", "seen")
  })

  const fetched: string[] = []

  page.on("request", (request) => {
    if (new URL(request.url()).pathname.endsWith(".webm")) {
      fetched.push(request.url())
    }
  })

  await page.goto(VIDEO)
  await page.locator("h1").waitFor()

  const seasons = page
    .locator("[data-gallery='video'] li")
    .filter({ hasText: "A year of seasons" })

  await seasons.getByRole("button").click()

  const film = seasons.locator("video")

  await expect(film).toHaveAttribute("controls", "")
  await expect
    .poll(async () => film.evaluate((node: HTMLVideoElement) => node.paused))
    .toBe(true)

  expect(fetched, "nothing is downloaded until the reader asks").toEqual([])

  await context.close()
})
