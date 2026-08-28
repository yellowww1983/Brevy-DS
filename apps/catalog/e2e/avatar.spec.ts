import { expect, test, type Page } from "./catalog-test"

const PAGE = "/components/avatar"

const section = (page: Page, title: string) =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: title, exact: true }) })

test("the avatar is the drawn 32, fully round and unringed", async ({
  page,
}) => {
  await page.goto(PAGE)

  const avatar = section(page, "Photo").locator("[data-slot='avatar']").first()

  /** Radix mounts the picture only once it has loaded, so the geometry is
   *  read after that rather than a moment before it. */
  await expect(avatar.locator("[data-slot='avatar-image']")).toBeVisible()

  const read = await avatar.evaluate((node) => {
    const style = getComputedStyle(node)
    const box = node.getBoundingClientRect()
    const image = node.querySelector("[data-slot='avatar-image']")

    return {
      width: Math.round(box.width),
      height: Math.round(box.height),
      radius: style.borderRadius,
      overflow: style.overflow,
      /** A solo avatar wears no ring: the drawn white one belongs to the
       *  stack, which is the only place it separates anything. */
      ring: style.boxShadow,
      image: image
        ? {
            width: Math.round(image.getBoundingClientRect().width),
            fit: getComputedStyle(image).objectFit,
          }
        : null,
    }
  })

  expect(read.width, "the size 252 of the file's 363 avatars use").toBe(32)
  expect(read.height).toBe(32)
  expect(read.radius).toBe("9999px")
  expect(read.overflow).toBe("hidden")
  expect(read.ring, "no rim on a solo avatar").toBe("none")
  expect(read.image?.width, "the picture fills the circle").toBe(32)
  expect(read.image?.fit).toBe("cover")
})

test("the second size is the drawn 40 and changes nothing else", async ({
  page,
}) => {
  await page.goto(PAGE)

  const avatar = section(page, "Photo").locator("[data-slot='avatar']").nth(1)

  await expect(avatar.locator("[data-slot='avatar-image']")).toBeVisible()

  const read = await avatar.evaluate((node) => {
    const style = getComputedStyle(node)
    const box = node.getBoundingClientRect()
    const image = node.querySelector("[data-slot='avatar-image']")

    return {
      width: Math.round(box.width),
      height: Math.round(box.height),
      radius: style.borderRadius,
      ring: style.boxShadow,
      image: image ? Math.round(image.getBoundingClientRect().width) : null,
    }
  })

  /** Every 40 in the file is the author of a testimonial; nothing else about
   *  the circle moves with it. */
  expect(read.width, "the testimonial author's size").toBe(40)
  expect(read.height).toBe(40)
  expect(read.radius).toBe("9999px")
  expect(read.ring, "still no rim on a solo avatar").toBe("none")
  expect(read.image, "the picture still fills the circle").toBe(40)
})

test("the larger stack overlaps by the same drawn 8", async ({ page }) => {
  await page.goto(PAGE)

  const group = section(page, "Group")
    .locator("[data-slot='avatar-group']")
    .nth(1)

  const read = await group.evaluate((node) => {
    const members = [...node.querySelectorAll("[data-slot='avatar']")]
    const boxes = members.map((member) => member.getBoundingClientRect())

    return {
      overlaps: boxes
        .slice(1)
        .map((box, index) => Math.round((boxes[index]?.right ?? 0) - box.left)),
      widths: boxes.map((box) => Math.round(box.width)),
      ring: getComputedStyle(members[0] ?? node).boxShadow,
    }
  })

  /** The overlap is a fixed 8 rather than a fraction of the circle, so the
   *  size axis and the stack are square to one another. */
  expect(read.widths).toEqual([40, 40, 40])
  expect(read.overlaps).toEqual([8, 8])
  expect(read.ring).toContain("rgb(255, 255, 255) 0px 0px 0px 2px")
})

test("the fallback arrives because the picture does not", async ({ page }) => {
  await page.goto(PAGE)

  const avatar = section(page, "Initials")
    .locator("[data-slot='avatar']")
    .first()
  const fallback = avatar.locator("[data-slot='avatar-fallback']")

  await expect(fallback).toBeVisible()

  const read = await fallback.evaluate((node) => {
    const style = getComputedStyle(node)
    const root = node.closest("[data-slot='avatar']")

    return {
      text: node.textContent,
      background: style.backgroundColor,
      colour: style.color,
      type: `${style.fontSize}/${style.lineHeight}`,
      family: style.fontFamily.split(",")[0]?.replace(/"/g, ""),
      /** Radix removes the image once it fails, which is what makes this a
       *  fallback rather than a second variant switched on by a prop. */
      imageGone: root?.querySelector("[data-slot='avatar-image']") === null,
    }
  })

  expect(read.text).toBe("MW")
  expect(read.imageGone).toBe(true)
  /** beige-500 with the page's own text colour: the values the app file gives
   *  this corner, where the website file left shadcn's Geist and neutral-100. */
  expect(read.background).toBe("rgb(245, 242, 239)")
  expect(read.colour).toBe("oklch(0.274 0.006 286.033)")
  expect(read.type, "Rethink Sans 14 on 20").toBe("14px/20px")
  expect(read.family).toBe("Rethink Sans")
})

test("a group overlaps by the drawn 8 and separates with the ground", async ({
  page,
}) => {
  await page.goto(PAGE)

  const group = section(page, "Group")
    .locator("[data-slot='avatar-group']")
    .first()
  const avatars = group.locator("[data-slot='avatar']")

  await expect(avatars).toHaveCount(3)

  const read = await group.evaluate((node) => {
    const members = [...node.querySelectorAll("[data-slot='avatar']")]
    const boxes = members.map((member) => member.getBoundingClientRect())

    return {
      overlaps: boxes
        .slice(1)
        .map((box, index) => Math.round((boxes[index]?.right ?? 0) - box.left)),
      ring: getComputedStyle(members[0] ?? node).boxShadow,
      widths: boxes.map((box) => Math.round(box.width)),
    }
  })

  /** 35 groups in the file and every one of them at -8. */
  expect(read.overlaps).toEqual([8, 8])
  expect(read.widths).toEqual([32, 32, 32])
  expect(read.ring, "2px of the ground, sitting outside the edge").toContain(
    "rgb(255, 255, 255) 0px 0px 0px 2px",
  )
})

test("on a dark page the fallback and the ring follow the ground", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(PAGE)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  const fallback = await section(page, "Initials")
    .locator("[data-slot='avatar-fallback']")
    .first()
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return { background: style.backgroundColor, colour: style.color }
    })

  /** The app file draws the fallback neutral-800 with neutral-50 on it there,
   *  which is `--muted` and `--foreground` to the value. */
  expect(fallback.background).toBe("oklch(0.269 0 none)")
  expect(fallback.colour).toBe("oklch(0.985 0 none)")

  const ring = await section(page, "Group")
    .locator("[data-slot='avatar']")
    .first()
    .evaluate((node) => getComputedStyle(node).boxShadow)

  /** And it draws the separator in the ground rather than in white: `#0a0a0a`
   *  on a dark page (`17378:86756`), which is `--background`. */
  expect(ring).toContain("oklch(0.145 0 none) 0px 0px 0px 2px")
})
