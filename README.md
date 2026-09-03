# Brevy Design System

The components Brevy's product and marketing pages are built from, and a
catalog that documents them well enough for someone to assemble a page without
a designer in the room.

That last part is the point. The audience is a product manager working with
Claude: they describe a page, Claude reaches for the blocks, and the result
looks like Brevy because the blocks are Brevy rather than because anybody
remembered the brand guidelines. Every page in the catalog can hand itself over
as text, and `/llms-full.txt` hands over all of it at once.

The design is a Figma file. Where the file does not answer a question, the
shipped brevy.com does, and where neither does, the decision is written down in
`DESIGN-FEEDBACK.md` and asked about rather than quietly made.

## What is where

|                   |                                                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/tokens` | One stylesheet. Colour ramps, the type scale, spacing, radii, shadows, and the brand's own masks. Everything else reads from here.                                     |
| `packages/ui`     | The components: 18 of them, 13 page blocks and one screen. Internal to this workspace, not published. See its own README.                                              |
| `apps/catalog`    | The Next.js site that documents the package. Also the only consumer of it, which is deliberate: if the catalog cannot show a component, the component is not finished. |

The catalog's `src/registry.tsx` lists all 36 entries — 12 components, 13
blocks, 10 foundations, 1 screen — and everything else reads from it: the
sidebar, `/llms.txt`, `/llms-full.txt`, and the test that checks nobody wrote a
page without wiring it in.

## Running it

```sh
pnpm install
pnpm --filter catalog dev     # the catalog at localhost:3000
```

```sh
pnpm format:check             # prettier
pnpm lint                     # eslint, and the house rules below
pnpm typecheck                # tsc across the workspace
pnpm test                     # vitest: the package's units and the docs guard
pnpm --filter catalog test:e2e   # playwright, needs a production build
pnpm build                    # tsup for the package, next build for the catalog
```

The first four run in the pre-commit hook. The end-to-end suite needs a
production build, so it runs in CI and by hand.

**`pnpm build` deletes `.next`.** A dev server started before it is serving
nothing afterwards, and the failure looks like the app rather than the build.
Restart it after every build.

## The rules worth knowing before reading the code

### The catalog measures rather than declares

A typography badge reads its font size off the sample beside it. A colour
swatch reads its hex off the colour it paints. The Logo page reads the
lockup's rendered width off the element. None of those numbers is typed in
next to what it describes.

This is what makes the catalog worth trusting: a page cannot claim a value the
system does not ship, because the value it shows is the one the browser
produced. Change a token and the page changes with it.

It has one consequence, and it is the source of most of the trouble this
project has had with CI. **Every measured number arrives after an effect, not
with the HTML.** A component that measures itself carries `data-measures` from
the start and gains `data-measured` once the number is in; a spec that reads
one waits through `measured(page)` from `e2e/settled.ts`. A new component that
measures itself must carry both attributes or the suite will not know to wait
for it.

### Tests wait on a condition, never on a clock

`waitForTimeout` is banned by lint under `apps/catalog/e2e`, and there are zero
of them. A duration is a guess about how fast the machine is, and CI is faster
than the dev server. Wait on the condition the sleep was standing in for:
`measured(page)`, `atFoot(page)`, or `expect.poll`.

### The registry is one file on purpose

`registry.tsx` is the largest file here and it is deliberately not split. It is
the single source for 36 entries, and a guard checks that every doc written is
in it and every entry in it is checked. Splitting it into a file per kind would
reintroduce exactly the drift it exists to prevent: a page written, wired
nowhere, and nobody noticing.

### The dark theme is inherited, and the brand is one green in it

Dark values come from Brevy's app file rather than from us, so they are not
moved on a whim. The one deliberate divergence is that everything reading as
the brand on a dark page is a single green, `#0e8a4d`, where the file paints
three. That is recorded as DESIGN-FEEDBACK 92 and guarded by
`e2e/brand-green.spec.ts`, which checks seven places at once because they are
never on screen together.

### Two export conventions, split along a line

`packages/ui` exports with a list at the foot of each file, all 31 of them.
`apps/catalog` exports inline, all 56. The line is published surface against
application code, and each side is consistent within itself. It looks like an
inconsistency and is not one.

## House rules for changes

- No hex colours in source and no arbitrary Tailwind values. Both are lint
  errors. Add a token instead.
- Variants go through CVA, not through string concatenation.
- A component's `data-slot` goes **after** `{...props}`. Written before, a
  caller's own slot silently wins, nothing breaks where it was written, and a
  spec somewhere else stops finding an element that is still on the page under
  another name. It happened three times; `packages/ui/src/slots.test.tsx`
  keeps it from happening again.
- Comments explain decisions, not syntax. If the code says what it does, the
  comment says why it does it that way.
- `DESIGN-FEEDBACK.md` is where a question for the designer goes. A divergence
  from the file is written down there rather than absorbed silently, whichever
  way it was decided.

## Also here

- `CLAUDE.md` — the same ground rules, aimed at an agent working in the repo.
- `DESIGN-FEEDBACK.md` — 93 entries of things the design file leaves open,
  contradicts itself on, or draws in a way worth confirming.
- `BACKLOG.md` — what is not built yet.
