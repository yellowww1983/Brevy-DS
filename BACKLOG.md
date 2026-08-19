# Backlog

Work that is decided but deliberately not scheduled yet, with the reason for
the ordering. Figma problems belong in `DESIGN-FEEDBACK.md`, not here.

---

## Global search — after Blocks

**Decided direction.** The top bar search stops filtering and starts navigating:
one index over components, blocks and content pages, returning labelled results
(`Button · component`, `Introduction · page`, `Pricing table · block`) that take
you there. Filtering a variant grid becomes a local control on the component
page, separate from finding things in the catalog.

**Why it waits for Blocks.** An index built now would cover a catalog that is
missing half its content, and it would be rewritten the moment blocks land.
Building it after Phase 2 means indexing the real catalog once.

**Interim.** The field hides on pages with nothing to filter, and a query typed
earlier stops applying there. The chrome shifting between pages is accepted as
temporary and goes away when search becomes global.

---

## The preloader specs race the overlay

**Diagnosis.** The preloader takes itself down after roughly 2.4s, and its
specs assert `toBeVisible()` on the overlay before acting on it. With five
workers on a loaded machine the page can take long enough that the overlay is
already gone by the time the assertion runs, so a different test fails on each
run and a rerun passes. Observed on `feat/button-variants` and reproduced with
identical code: once `Escape takes it down`, once `dark mode repaints the
animation`, once a clean pass of all five.

Nothing in the button work touches the overlay; the flake arrived with the
preloader itself and is already on `main`.

**Fix.** Install Playwright's clock (`page.clock`) in those specs so the
dismissal happens when the test advances time rather than whenever the machine
gets there. Deliberately not done alongside the button work — it is a third
subject and belongs in its own change.

---

## Carried over, not scheduled

- **Badge icon stroke.** Renders at 2, the app file draws 1.25. Button was fixed
  against the website board; Badge needs its own value, and 1.25 is odd enough
  that normalising may be preferable to copying it.
- **Stale screenshots.** `.screenshots/button-web-full-*` and
  `button-web-primary-*` show the six-variant grid that no longer exists.
- **`DESIGN-FEEDBACK.md` handoff.** 17 findings, 3 of them blocking, still to be
  walked through with the designer.
