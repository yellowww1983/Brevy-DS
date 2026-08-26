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

## An unexplained failure on the layout page, since caught

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

**It happened again, and the artefact was lost again.** One `toHaveCount`
failure on the first run after a server restart, name unread, and three
passing runs launched before anyone looked at `test-results`, which cleans
itself on every run. Three deliberate cold starts afterwards stayed green.
The count stands at two unexplained failures, both swallowed the same way.

**On the next failure, read `test-results/*/error-context.md` before cleaning.**
It carries the page snapshot, which is the difference between knowing whether
the page crashed or the test was early, and guessing. That artefact is why the
first race was found in one pass and why this one stayed open.

**Caught on the third occurrence, because the artefact was finally read
first.** The reduced-motion preloader spec. The first diagnosis blamed
`runFor` outrunning hydration and guarded every advance behind the session
flag; the failure came back anyway, and instrumenting the page found the
real mechanism, two layers down. Installing Playwright's clock does not stop
it: time keeps flowing until `pauseAt`, so the suite's frozen-clock premise
had silently never been true, the overlay's timers fired on the machine's
schedule, and advancing the flowing clock jumped the page's wall time, which
the app answers by remounting, resurrecting the overlay a test had already
watched leave. The suite now pauses the clock before every navigation and
advances it in nudges until the overlay is gone, because the removal timer
is armed by an effect React schedules outside the fake clock. Measured: 120
runs of the spec clean after the fix. The hydration guard from the first
diagnosis stays, because it closes a real, if narrower, race of its own.

---

## Carried over, not scheduled

- **Badge icon stroke.** Renders at 2, the app file draws 1.25. Button was fixed
  against the website board; Badge needs its own value, and 1.25 is odd enough
  that normalising may be preferable to copying it.
- **Stale screenshots.** `.screenshots/button-web-full-*` and
  `button-web-primary-*` show the six-variant grid that no longer exists.
- **`DESIGN-FEEDBACK.md` handoff.** 17 findings, 3 of them blocking, still to be
  walked through with the designer.

## The product's face is not the default one

The catalog's `body` carries `font-catalog`, the chrome's Inter, and the
system's own face arrives only where something asks for it: the class on the
preview box in `component-view`, one wrapper in `specimen.tsx`, and now
`app/specimens/layout.tsx`. That is the wrong way round. The catalog exists to
show the product, so the product's face should be the default and the chrome
should be the exception that names itself.

The symptom this treated: every component text inside a frame that carried no
face of its own rendered in Inter, measured through CDP
`CSS.getPlatformFontsForNode` at 15 of 68 text elements — the navbar's three
buttons, the FAQ's questions, answers, description and contact card, and the
chat's placeholder. The specimens layout fixes those. It does not fix the
arrangement that allowed them.

The trap left behind, for whoever picks this up: an inline preview keeps the
system face **through the box around it**, and a registry entry carrying the
`viewport` flag has no box, because a framed preview draws no second border.
Such an entry is safe today only because its content lives in a frame, which
the specimens layout covers. An entry with the flag rendered inline would fall
through both and come out in Inter, and nothing would fail.

The real fix is to flip the default: `font-sans` on the body, `font-catalog`
on the chrome shell. It touches every catalog page, which is why it is written
here rather than done in passing.

## Two light objects have no dark drawing, and three pairs have no drawing at all

The chip and the FAQ band paint themselves in ramp colours, so they stay light
whatever the page does. Their labels used to be on theme tokens and turned with
the page, which put near-white text on a white pill and on a beige band: 1.04
and 1.07 to 1, against 14.89 and 13.36 in the light. Both are now pinned to the
ramp, so the objects are light through and through and simply sit bright on a
dark page.

That is the honest half-measure. **What is missing is the drawing**: what a
suggestion pill and what the FAQ's beige-to-white band look like in dark mode.
With that, the gradient and the band can move to tokens (`from-card`,
`to-background` and kin) and the labels can go back to `text-foreground`, which
is where they wanted to be. Until then the system ships a light object on a
dark page on purpose.

The same conversation should settle the pairs no drawing describes: ramp text
on a surface that _is_ a token, so the surface turns and the text does not.

| pair                                                                   | then                  | now                 |
| ---------------------------------------------------------------------- | --------------------- | ------------------- |
| accordion answer and chevron, `zinc-700` on `bg-background`            | 1.9:1                 | **6.94:1**, closed  |
| chat placeholder and value, `zinc-600` / `zinc-800` on `bg-background` | 2.56:1                | **17.18:1**, closed |
| primary button label, `--primary-foreground` on the dark `--primary`   | pixel spread 108 → 49 | **open**            |

The first two closed when dark mode was read off the app file and the surfaces
were brought to the values it draws: a card is `--card`, a page is
`--background`, an outline is flat white at 10%, and text is `--foreground`
over `--muted-foreground`. The third did not, because it is not a surface
question.

**Also worth keeping from the detour.** A rule was once derived from the
website file and applied — light objects declaring themselves light so they
keep their colours on a dark page — and it was reverted: pinning every such
object is switching dark mode off rather than designing it. The reading behind
it still stands. That file draws no dark mode at all (no `dark`-named node on
any of its five pages, every dark surface in it is the brand `#023620`), it
draws the chip on that dark green with the same white gradient it wears on
white and only its text turned (`22616:8593`), and it draws a thread on a dark
ground in that ground's own ramp stepped one lighter (`22616:8603`). The app
file is the better source for dark and is what the surfaces now follow.

## `text-body-lg` is a ratio the file does not draw

The token sets `--text-body-lg--line-height: 1.45`, so 20px body text renders
on a 29px line. Measured across the design file, **1121 of the 1151** 20px text
nodes draw on 28, a ratio of 1.4; the remaining 30 draw on 30. Nothing in the
file draws 29, and the shipped site renders its own `text-body-lg` at 20/28.

It costs a pixel a line, which is why nothing caught it before: the footer
misses the drawn heights by 2 to 6px, all of it this. Moving the token to 1.4
would also move the FAQ's description and the navbar's menu links, which is why
it is written here rather than changed in passing.

## `.light` pins the tokens but not the `dark:` utilities — done

The token file offers `.light` so a subtree can be held in one theme while the
page is in the other, and the footer needs it: the file draws no dark footer.
It worked for anything reading a custom property and stopped at anything keyed
on the class itself, so `@custom-variant dark (&:is(.dark *))` still matched
inside a pinned subtree and the Input's `dark:bg-input/30` turned the
newsletter field translucent on a dark page.

Fixed at the root rather than in the block: the variant now reads
`&:is(.dark *):not(.light *)`, so a pin stops the variant as well as the
palette, and the workaround the footer carried is gone. Every other user of
`.light` was checked first — the shadow stage and the colour swatches — and
neither had a `dark:` utility inside the pin, so nothing depended on the leak.

One simplification is written into the comment beside it: a pin now wins
wherever it appears, where the palette obeys the nearest theme class, so
`.dark` nested inside `.light` would resolve dark tokens with `dark:` utilities
off. Nothing nests them, and CSS cannot express "nearest wins" here without
`:has`.
