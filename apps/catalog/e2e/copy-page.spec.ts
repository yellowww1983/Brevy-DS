import { expect, test } from "./catalog-test"

test.use({ viewport: { width: 1440, height: 900 } })

/** Every foundation, and the heading its copied text has to carry. A page that
 *  copies nothing, or copies a shell with no body, fails on the heading. */
const PAGES = [
  ["/getting-started/typography", "Typography", "foundation"],
  ["/getting-started/colors", "Colors", "foundation"],
  ["/getting-started/spacing", "Spacing", "foundation"],
  ["/getting-started/radius", "Radius", "foundation"],
  ["/getting-started/shadows", "Shadows", "foundation"],
  ["/getting-started/icons", "Icons", "foundation"],
  ["/getting-started/layout", "Layout", "foundation"],
  ["/blocks/navbar", "Navbar", "block"],
] as const

for (const [path, name, kind] of PAGES) {
  test(`${name} hands itself to Claude as text`, async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    await page.goto(path)

    const button = page.getByRole("button", {
      name: "Copy this page for Claude",
    })

    await expect(button).toBeVisible()
    await button.click()
    await expect(button).toHaveText("Copied")

    const copied = await page.evaluate(() => navigator.clipboard.readText())

    expect(copied, "the instruction has to name the page").toContain(
      `documentation for the ${name} ${kind}`,
    )
    expect(
      copied,
      "a shell with no body would still pass a length check",
    ).toContain(`# ${name}`)
    expect(
      copied.length,
      "an empty or truncated copy is the failure worth catching",
    ).toBeGreaterThan(400)
    expect(copied, "no em-dashes reach the clipboard either").not.toContain("—")
  })
}
