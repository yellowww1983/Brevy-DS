import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1280, height: 1000 } })

const PAGE = "/screens/login"
const SPECIMEN = "/specimens/auth"

/** What the app file draws (`20786:176843`, the split variant at 1280;
 *  `20786:176863`, its mobile). The tablet is this system's own composition
 *  and lands on the file's centred tablet (`20786:176608`). */
const DRAWN = {
  pad: "24px",
  padNarrow: "16px",
  gap: 24,
  column: 360,
  columnNarrow: 328,
  height: 960,
  heightNarrow: 782,
  photo: { width: 604, height: 912 },
  /** 16 is this system's step; the file draws 14, off both ramps —
   *  DESIGN-FEEDBACK 71. */
  photoRadius: "16px",
  wash: { height: 670, top: 100 },
  lockupToHeading: 48,
  headingToDescription: 12,
  flow: 16,
  inField: 8,
  field: { height: "48px", radius: "8px", text: "16px" },
  label: { size: "14px", weight: "500" },
  eye: { size: 16, inset: 12 },
  emerald: "rgb(2, 54, 32)",
  olive: "rgb(215, 228, 201)",
  brand: "rgb(6, 110, 61)",
}

const box = async (page: Page, selector: string, index = 0) =>
  page
    .locator(selector)
    .nth(index)
    .evaluate((node) => {
      const rectangle = node.getBoundingClientRect()
      return {
        width: Math.round(rectangle.width * 10) / 10,
        height: Math.round(rectangle.height * 10) / 10,
        x: Math.round(rectangle.x * 10) / 10,
        y: Math.round(rectangle.y * 10) / 10,
      }
    })

test("the shell is the drawn frame: padding, ground, halves", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='auth-split']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        padding: style.padding,
        minHeight: style.minHeight,
        ground: style.backgroundImage,
        height: Math.round(node.getBoundingClientRect().height),
      }
    })

  expect(read.padding).toBe(DRAWN.pad)
  expect(read.minHeight).toBe(`${String(DRAWN.height)}px`)
  expect(read.height, "the drawn frame, not outgrown by the photograph").toBe(
    DRAWN.height,
  )
  /** The centred hero's own ground: beige-500 down to white. */
  expect(read.ground).toContain("rgb(245, 242, 239)")
  expect(read.ground).toContain("rgb(255, 255, 255)")

  const photo = await box(page, "[data-slot='auth-split-photograph']")
  expect(photo.width).toBe(DRAWN.photo.width)
  expect(photo.height).toBe(DRAWN.photo.height)

  expect(
    await page
      .locator("[data-slot='auth-split-photograph']")
      .evaluate((node) => getComputedStyle(node).borderRadius),
  ).toBe(DRAWN.photoRadius)

  const wash = await box(page, "[data-slot='auth-split-wash']")
  expect(wash.height).toBe(DRAWN.wash.height)
  expect(wash.y, "hung 100 down, as placed at every drawn width").toBe(
    DRAWN.wash.top,
  )
})

test("the column carries the drawn rhythm", async ({ page }) => {
  await page.goto(SPECIMEN)

  const copy = await box(page, "[data-slot='auth-split-copy'] > div")
  expect(copy.width).toBe(DRAWN.column)

  const read = await page
    .locator("[data-slot='auth-split']")
    .evaluate((node) => {
      const one = (selector: string) => {
        const found = node.querySelector(selector)
        return found ? found.getBoundingClientRect() : null
      }
      const lockup = one("[data-slot='auth-split-copy'] svg")
      const heading = one("[data-slot='auth-split-heading']")
      const description = one("[data-slot='auth-split-description']")
      const labelRow = one("[data-slot='form-label-row']")
      const label = one("[data-slot='form-label']")
      const input = one("input")

      if (
        !lockup ||
        !heading ||
        !description ||
        !labelRow ||
        !label ||
        !input
      ) {
        return null
      }

      const style = node.querySelector("[data-slot='auth-split-heading']")

      return {
        lockupToHeading: Math.round(heading.top - lockup.bottom),
        headingToDescription: Math.round(description.top - heading.bottom),
        descriptionToForm: Math.round(labelRow.top - description.bottom),
        labelToInput: Math.round(input.top - label.bottom),
        heading: style
          ? {
              family: getComputedStyle(style).fontFamily,
              colour: getComputedStyle(style).color,
              leading:
                Math.round(
                  (parseFloat(getComputedStyle(style).lineHeight) /
                    parseFloat(getComputedStyle(style).fontSize)) *
                    1000,
                ) / 1000,
            }
          : null,
      }
    })

  expect(read?.lockupToHeading).toBe(DRAWN.lockupToHeading)
  expect(read?.headingToDescription).toBe(DRAWN.headingToDescription)
  expect(read?.descriptionToForm).toBe(DRAWN.flow)
  expect(read?.labelToInput).toBe(DRAWN.inField)

  expect(read?.heading?.family).toContain("Hedvig")
  expect(read?.heading?.colour).toBe(DRAWN.brand)
  /** The h1's own 1.333, not the typed 42/60 — DESIGN-FEEDBACK 71. */
  expect(read?.heading?.leading).toBeCloseTo(1.333, 2)
})

test("the field is the system's tall input with the eye in its slot", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("input")
    .first()
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        height: style.height,
        radius: style.borderRadius,
        text: style.fontSize,
        type: node.getAttribute("type"),
      }
    })

  expect(read.height).toBe(DRAWN.field.height)
  /** The drawn 8 and the system's `rounded-md` are the same number: this
   *  scale sets md at 0.5rem. */
  expect(read.radius).toBe(DRAWN.field.radius)
  expect(read.text).toBe(DRAWN.field.text)
  expect(read.type).toBe("password")

  const input = await box(page, "input")
  const eye = await box(page, "[data-slot='input-trailing']")
  expect(eye.width).toBe(DRAWN.eye.size)
  expect(
    Math.round(input.x + input.width - (eye.x + eye.width)),
    "12 off the field's edge",
  ).toBe(DRAWN.eye.inset)

  const label = await page
    .locator("[data-slot='form-label']")
    .first()
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return { size: style.fontSize, weight: style.fontWeight }
    })

  expect(label.size).toBe(DRAWN.label.size)
  expect(label.weight).toBe(DRAWN.label.weight)

  /** The link sharing the label's row, flush with the column's right edge. */
  const row = await box(page, "[data-slot='form-label-row']")
  const link = await box(page, "[data-slot='form-label-row'] a")
  expect(Math.round(row.x + row.width - (link.x + link.width))).toBe(0)
})

test("the eye reveals the password and says so", async ({ page }) => {
  await page.goto(SPECIMEN)

  const field = page.locator("input").first()
  const eye = page.locator("[data-slot='reveal']").first()

  await expect(field).toHaveAttribute("type", "password")
  await expect(eye).toHaveAttribute("aria-pressed", "false")

  await eye.click()

  await expect(field).toHaveAttribute("type", "text")
  await expect(eye).toHaveAttribute("aria-pressed", "true")

  /** Both boxes reveal together: one secret, one switch. */
  await expect(page.locator("input").nth(1)).toHaveAttribute("type", "text")

  await eye.click()
  await expect(field).toHaveAttribute("type", "password")
})

test("a refused value paints the field's own error, once", async ({ page }) => {
  await page.goto(SPECIMEN)

  const field = page.locator("input").first()

  await field.fill("short")
  await page.getByRole("button", { name: "Continue" }).click()

  await expect(field).toHaveAttribute("aria-invalid", "true")

  const message = page.locator("[data-slot='form-message']").first()
  await expect(message).toHaveText("Use at least 8 characters.")

  const read = await page
    .locator("[data-slot='auth-split']")
    .evaluate((node) => {
      const input = node.querySelector("input")
      const line = node.querySelector("[data-slot='form-message']")
      return {
        border: input ? getComputedStyle(input).borderColor : null,
        text: line ? getComputedStyle(line).color : null,
      }
    })

  /** The border is the Input's `aria-invalid` state — the red-500 measured
   *  off the funnel's failed field — and the message reads the same error. */
  expect(read.border).toContain("rgb(239, 68, 68)")
  expect(read.text).toContain("rgb(239, 68, 68)")

  await field.fill("long enough now")
  await page.getByRole("button", { name: "Continue" }).click()
  await expect(field).toHaveAttribute("aria-invalid", "false")
})

test("the helper wears one colour, the written one", async ({ page }) => {
  await page.goto(SPECIMEN)

  const helper = page.locator("[data-slot='form-description']").first()

  /** Drawn under the confirm field, in zinc-700 — the drawn zinc-500 line
   *  was shadcn's own placeholder copy. DESIGN-FEEDBACK 70. */
  await expect(helper).toHaveText(
    "Min. 8 characters. You won't need this for daily logins.",
  )

  expect(await helper.evaluate((node) => getComputedStyle(node).color)).toBe(
    "oklch(0.37 0.013 285.805)",
  )
})

test("the button is the leaf and the footnote lost its Geist", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const button = await page
    .getByRole("button", { name: "Continue" })
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        height: Math.round(node.getBoundingClientRect().height),
        radii: [
          style.borderTopLeftRadius,
          style.borderTopRightRadius,
          style.borderBottomRightRadius,
          style.borderBottomLeftRadius,
        ],
        background: style.backgroundColor,
        colour: style.color,
      }
    })

  expect(button.height).toBe(48)
  expect(button.radii, "the leaf: tight and wide by diagonal").toEqual([
    "6px",
    "16px",
    "6px",
    "16px",
  ])
  expect(button.background).toBe(DRAWN.emerald)
  expect(button.colour).toBe(DRAWN.olive)

  const footer = await page
    .locator("[data-slot='login-footer']")
    .evaluate((node) => {
      const link = node.querySelector("a")
      return {
        family: getComputedStyle(node).fontFamily,
        link: link
          ? {
              colour: getComputedStyle(link).color,
              underline: getComputedStyle(link).textDecorationLine,
            }
          : null,
      }
    })

  /** The drawn footnote is the one Geist leftover on the screen. */
  expect(footer.family).toContain("Rethink Sans")
  expect(footer.link?.colour).toBe(DRAWN.brand)
  expect(footer.link?.underline).toBe("underline")
})

test("below the content width the screen is the drawn centred tablet", async ({
  page,
}) => {
  await page.setViewportSize({ width: 810, height: 1000 })
  await page.goto(SPECIMEN)

  /** No photograph: the file draws no tablet for the split, and its centred
   *  set's tablet is exactly this — the column alone on the wash. A
   *  composition, but one the file reaches the same way. */
  await expect(page.locator("[data-slot='auth-split-photograph']")).toBeHidden()

  const copy = await box(page, "[data-slot='auth-split-copy'] > div")
  expect(copy.width).toBe(DRAWN.column)

  const wash = await box(page, "[data-slot='auth-split-wash']")
  expect(wash.y).toBe(DRAWN.wash.top)
})

test("at mobile the frame tightens to the drawn 16", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='auth-split']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return { padding: style.padding, minHeight: style.minHeight }
    })

  expect(read.padding).toBe(DRAWN.padNarrow)
  expect(read.minHeight).toBe(`${String(DRAWN.heightNarrow)}px`)

  const copy = await box(page, "[data-slot='auth-split-copy'] > div")
  expect(copy.width).toBe(DRAWN.columnNarrow)

  /** Against the top below the tablet, which is where the file hangs it. */
  const wash = await box(page, "[data-slot='auth-split-wash']")
  expect(wash.y).toBe(0)
})

test("on a dark page the pictures go and the ground turns", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(SPECIMEN)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  await expect(page.locator("[data-slot='auth-split-wash']")).toBeHidden()
  await expect(page.locator("[data-slot='auth-split-photograph']")).toBeHidden()

  const read = await page
    .locator("[data-slot='auth-split']")
    .evaluate((node) => {
      const heading = node.querySelector("[data-slot='auth-split-heading']")
      return {
        ground: getComputedStyle(node).backgroundColor,
        image: getComputedStyle(node).backgroundImage,
        heading: heading ? getComputedStyle(heading).color : null,
      }
    })

  expect(read.ground).toBe("oklch(0.145 0 none)")
  expect(read.image).toBe("none")
  /** brand-vivid, where the token file sends `--primary` in the dark. */
  expect(read.heading).toBe("rgb(14, 138, 77)")
})

test("the Form page shows the wired states, not painted ones", async ({
  page,
}) => {
  await page.goto("/components/form")

  /** Two axes, two values each: the grid the new entry declares. */
  await expect(page.locator("header p")).toHaveText("4 variants")

  const message = page.locator("[data-slot='form-message']").first()
  await expect(message).toHaveText("Enter a valid email address.")

  const invalid = page.locator("input[aria-invalid='true']")
  await expect(invalid).toHaveCount(2)
})

test("the catalog frames the screen at all three widths", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  await expect(page.locator("iframe")).toHaveCount(2)

  const width = await page
    .locator("iframe")
    .first()
    .evaluate((node) => node.getBoundingClientRect().width)

  expect(width, "the desktop tab's own width, never shrunk").toBe(1440)

  await page.getByRole("button", { name: "Mobile", exact: true }).click()
  await measured(page)

  expect(
    await page
      .locator("iframe")
      .first()
      .evaluate((node) => node.getBoundingClientRect().width),
  ).toBe(390)
})
