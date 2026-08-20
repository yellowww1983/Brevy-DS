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

## The preloader flake has two histories

Closed, kept because the record is misleading without it. Searching the log for
"the preloader flake" turns up a fix that did not end the failures.

**First race — timers.** The specs asserted the overlay was on screen while it
was removing itself on a real 2.4s timer, so a slow page load could lose the
race. Fixed by freezing the clock with `page.clock`, and the fix holds.

**Second race — hydration.** Freezing the clock meant the reload spec could no
longer wait on the overlay's disappearance, so that wait was replaced by reading
the session flag directly. The flag is written by an effect, and reading it
without waiting races hydration instead. Same file, same test, a different
mechanism — roughly one failure in three under load. Fixed by polling.

So the timer fix did not cause the second failure so much as uncover it: the
`toHaveCount` it removed had been synchronising the test with hydration as a
side effect nobody had noticed. Anything that removes a wait from these specs
should be checked for what that wait was quietly doing.

---

## An unexplained failure on the layout page

`copy-page.spec.ts` failed once on `Layout hands itself to Claude as text`. The
saved snapshot showed `Application error: a client-side exception has occurred`,
so the page had gone down rather than the test being early.

**What was found and fixed.** A frame partway through a navigation has a
document with no `documentElement` yet. Both frame effects reached through it,
and `observe(null)` throws in the body of an effect, which takes the whole page
with it rather than just the frame. Guarded in `frame-theme.ts` and
`container-frame.tsx`. Measured: three failures in seven runs before, none in
ten after.

**Why it stays open.** A single failure came back after that fix, on a later
build, and its `error-context.md` was deleted before anyone read it. Nothing has
failed since, across roughly a hundred runs spanning three builds, so there is
no evidence to say whether it was the same race surviving in a rarer form or a
one-off. Two changes since then removed plausible feeding ground: the frame no
longer measures its own height, which ended a resize loop between the frame's
height and the document's, and nothing thin is drawn inside the scaled frame any
more.

**On the next failure, read `test-results/*/error-context.md` before cleaning.**
It carries the page snapshot, which is the difference between knowing whether
the page crashed or the test was early, and guessing. That artefact is why the
first race was found in one pass and why this one is still open.

---

## Carried over, not scheduled

- **Badge icon stroke.** Renders at 2, the app file draws 1.25. Button was fixed
  against the website board; Badge needs its own value, and 1.25 is odd enough
  that normalising may be preferable to copying it.
- **Stale screenshots.** `.screenshots/button-web-full-*` and
  `button-web-primary-*` show the six-variant grid that no longer exists.
- **`DESIGN-FEEDBACK.md` handoff.** 17 findings, 3 of them blocking, still to be
  walked through with the designer.
