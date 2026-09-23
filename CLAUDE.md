# Working in this repository

## The catalog measures rather than declares

A typography badge reads its font size off the sample beside it. A colour swatch
reads its hex off the colour it paints. A preview frame reads its height off its
own content. None of these numbers is written down next to what it describes.

This is deliberate, and it is what makes the catalog worth trusting: a page
cannot claim a value the system does not ship, because the value it shows is the
one the browser produced. When a token changes, the page changes with it, and no
one has to remember to update a caption.

It has one consequence, and it is the source of most of the trouble this project
has had with CI:

**Every measured number arrives after an effect, not with the HTML.** A
navigation resolving is not the page being ready. A spec that reads a measured
value the moment `goto` returns reads an empty string — on a fast enough machine,
and the machine that runs CI is faster than the dev server.

Four red builds came from this, each in a different place: a preloader timer, a
preloader flag, 196 blank colour labels, and a page that grew 320px taller after
a test had already scrolled to the bottom of it.

### The rule

**A spec that reads a measured value waits for it through a retrying helper.
Never a single read after `goto`.**

- `measured(page)` — waits until everything that measures itself has a number.
  Components declare this themselves: anything that measures carries
  `data-measures` from the start and gains `data-measured` once the value is in.
  **A new component that measures itself must carry both**, or the suite will not
  know to wait for it.
- `atFoot(page)` — scrolls to the end of a page whose end keeps moving, and stops
  only when two rounds agree on the height.
- `expect.poll` for anything else that resolves late.

Both helpers live in `apps/catalog/e2e/settled.ts`.

**A hard sleep in a spec is a bug, not a fix.** `waitForTimeout` is a guess about
how fast the machine is, and it is banned by lint under `apps/catalog/e2e/`. Wait
on the condition the sleep was standing in for — it is always shorter and always
more honest than the duration.

This matters most for whatever measures itself next. Phase 2 blocks will, and
they should not have to discover any of this again.

## When the catalog does not have it

The catalog is a signpost rather than a warehouse. It documents the language a
page is built in — tokens, spacing, the grid, the type roles — not a block for
every section anybody might need.

So a section with no block gets built rather than refused, in the system's own
values: a colour from the semantic tokens, padding from the spacing steps, a
radius from the scale, type from the roles.

Two lines it does not cross.

- **Nothing new is added to the catalog.** A section built for one page is not
  everyone's, and the registry is what the whole system reads.
- **Nothing in `@brevy/ui` is edited or given a variant of its own.** A
  component that behaves differently on one page is the drift all of this
  exists to prevent. Compose out of what is there; leave the parts alone.

And never a raw value. `bg-[#f5f2ef]` is wrong even when the colour is right,
because the colour is `bg-secondary`; the same goes for `p-[24px]` against
`p-6`. Worth saying out loud here rather than leaving to the linter: the rule
against hex colours and arbitrary values is enforced by lint **in this
repository only**. Someone composing a page in their own project has the rule
and no guard, so the rule has to travel in words.

## Before pushing

`pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test` and
`pnpm --filter catalog test:e2e`. The first four run in the pre-commit hook; the
e2e suite needs a production build, so it runs in CI and by hand.

`pnpm build` deletes `.next`, so a dev server started before it is serving
nothing afterwards. Restart it after every build.
