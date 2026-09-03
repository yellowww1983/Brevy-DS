import { expect, test } from "./catalog-test"
import { measured } from "./settled"

/** The Logo page states rules and then draws them, which is the only reason
 *  anyone should believe it. These check that what it draws still agrees with
 *  what it says.
 *
 *  The rules themselves are a reading of the drawing rather than guidelines
 *  handed down, so if the drawing changes these fail and the page has to be
 *  read again. That is the point of them. */

const PAGE = "/getting-started/logo"

test.use({ viewport: { width: 1440, height: 1000 } })

test("the lockup holds its ratio at every size the page draws", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const rows = page.locator("[data-logo-size]")

  await expect(rows).toHaveCount(5)

  const drawn = await rows.evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.querySelector("span")?.getBoundingClientRect()

      return {
        asked: Number(node.getAttribute("data-logo-size")),
        width: Math.round(box?.width ?? 0),
        height: Math.round(box?.height ?? 0),
        says: node.querySelector("[data-logo-measured]")?.textContent ?? "",
      }
    }),
  )

  for (const row of drawn) {
    expect(row.height, `drawn at the ${String(row.asked)} it asked for`).toBe(
      row.asked,
    )

    /** The caption is the element's own box, not a number typed beside it. */
    expect(row.says.replace(/\s/g, "")).toBe(
      `${String(row.width)}×${String(row.height)}`,
    )

    const ratio = row.width / row.height

    /** 2.875 for the lockup and square for the mark, both fixed. A tenth of a
     *  pixel of rounding at 16 is a hundredth of a ratio, so the tolerance is
     *  the rasteriser's rather than a licence to drift. */
    expect(
      Math.min(Math.abs(ratio - 2.875), Math.abs(ratio - 1)),
      `${String(row.width)}x${String(row.height)} is neither shape`,
    ).toBeLessThan(0.02)
  }
})

test("the clear space drawn is half the height of the logo inside it", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const ring = page.locator("#clear-space ~ div [class*='border-dashed']")
  const logo = ring.locator("svg")

  const [outer, inner] = await Promise.all([
    ring.boundingBox(),
    logo.boundingBox(),
  ])

  expect(outer, "the diagram is there").not.toBeNull()
  expect(inner, "and the logo inside it").not.toBeNull()

  const height = inner?.height ?? 0
  const left = (inner?.x ?? 0) - (outer?.x ?? 0)
  const top = (inner?.y ?? 0) - (outer?.y ?? 0)

  /** The border is a pixel of the difference, which is why this is not exact. */
  expect(left - height / 2, "half a height to the left").toBeLessThan(2)
  expect(top - height / 2, "half a height above").toBeLessThan(2)
})

test("the animation is not fetched until it is asked for, and wears the theme", async ({
  page,
}) => {
  const fetched: string[] = []

  page.on("request", (request) => {
    if (new URL(request.url()).pathname.startsWith("/lottie/")) {
      fetched.push(request.url())
    }
  })

  await page.goto(PAGE)
  await measured(page)
  await page.locator("[data-logo-stage]").scrollIntoViewIfNeeded()

  expect(fetched, "the still is the component, not a download").toEqual([])

  await page.getByRole("button", { name: "Play the logo" }).click()

  const paths = page.locator("[data-logo-stage] svg path")
  await expect(paths.first()).toBeAttached()

  /** The colour is baked into the export, so a player left alone paints the
   *  light theme's green on a dark page. This is the page saying it rewrote
   *  it. */
  const worn = await paths.evaluateAll((nodes) => {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1

    const context = canvas.getContext("2d")

    if (!context) {
      return []
    }

    return [
      ...new Set(
        nodes
          .map(
            (node) => node.getAttribute("fill") ?? node.getAttribute("stroke"),
          )
          .filter((value) => value !== null)
          .map((value) => {
            context.fillStyle = value
            context.fillRect(0, 0, 1, 1)

            const pixel = context.getImageData(0, 0, 1, 1).data

            return `#${[pixel[0], pixel[1], pixel[2]]
              .map((channel) => (channel ?? 0).toString(16).padStart(2, "0"))
              .join("")}`
          }),
      ),
    ]
  })

  expect(worn, "one colour throughout, and it is the light theme's").toEqual([
    "#066e3d",
  ])
})
