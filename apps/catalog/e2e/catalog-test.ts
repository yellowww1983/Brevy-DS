import { test as base } from "@playwright/test"

/** Every spec except the preloader's own starts past the intro animation.
 *  Seeding the flag the blocking script reads keeps a 2.4s overlay from
 *  swallowing clicks and making unrelated tests look flaky. */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("preloader", "seen")
    })
    await use(page)
  },
})

export { expect, type Page } from "@playwright/test"
