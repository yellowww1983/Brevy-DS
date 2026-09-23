# @brevy/ui

Brevy's components and page blocks, and the documentation for them. The
catalog in `apps/catalog` is built from this package and documents it; a
project of its own installs it and gets the same documentation inside
`node_modules`.

Everything comes out of the one entry point.

```tsx
import { Button, CtaBand, Navbar } from "@brevy/ui"
```

Styles come from `@brevy/tokens`, which the consuming app imports once. Without
it the components render unstyled: the package ships no CSS of its own and
every colour, size and radius is a token.

## Using it in your own project

The package is not on npm. It is installed from a tarball built in this repo,
together with `@brevy/tokens`, which carries the stylesheet.

This procedure follows from the code and from the packed tarball, and has not
yet been through an install in a separate project. Treat it as the expected
path rather than a tested one: the token override in step 2 and the `@source`
path in step 3 are what the first real install will confirm.

### 1. Build the tarballs

In this repo:

```sh
pnpm --filter @brevy/ui pack --pack-destination <dir>
pnpm --filter @brevy/tokens pack --pack-destination <dir>
```

Packing builds the package first and checks its documentation against the
catalog, so a tarball cannot carry docs older than the code.

### 2. Install

Copy both into the project, say `vendor/`, then:

```sh
pnpm add ./vendor/brevy-ui-0.0.0.tgz ./vendor/brevy-tokens-0.0.0.tgz
pnpm add react@19 react-dom@19 radix-ui lucide-react react-hook-form zod @hookform/resolvers
pnpm add -D tailwindcss@4 @tailwindcss/postcss@4
```

and pin the tokens in `package.json`:

```json
"pnpm": {
  "overrides": { "@brevy/tokens": "file:./vendor/brevy-tokens-0.0.0.tgz" }
}
```

With npm the same field is `overrides`. `@brevy/ui` depends on
`@brevy/tokens@0.0.0`, which is on no registry; without the override the
install fails looking for it. `react-hook-form` is needed even on a page with
no form: the one entry point re-exports `Form`, which imports it.

### 3. Tailwind and the tokens

`postcss.config.mjs` with `plugins: ["@tailwindcss/postcss"]`, and in the global
stylesheet:

```css
@import "tailwindcss";
@import "@brevy/tokens/globals.css";
@source "../node_modules/@brevy/ui/dist";
```

In that order: the tokens build on Tailwind's palette. `@source` is not
optional — Tailwind 4 does not scan `node_modules`, and without it every
component renders unstyled. The path is relative to the stylesheet.

### 4. Typefaces

Rethink Sans for text, Hedvig Letters Serif (weight 400) for headings. With
`next/font`, load both with `variable: "--font-rethink-sans"` and
`variable: "--font-hedvig"`, put the variables on `<html>`, and point the
tokens at them:

```css
@theme inline {
  --font-sans: var(--font-rethink-sans), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-hedvig), ui-serif, Georgia, serif;
}
```

`next/font` renames the families it loads, so the names in the token file never
reach them without this.

### 5. The page

`<body className="bg-background text-foreground font-sans antialiased">` — the
tokens set no base styles. Light is the default; dark is the class `dark` on an
ancestor, usually `<html>`. There is no provider.

### 6. Check

Render a `Button`. If it has no fill, the `@source` path is wrong.

### Using it with Claude

The documentation is in `dist/docs`: an index, one file per foundation,
component, block and screen, and the rules for sections no block covers. It is
generated from the catalog's registry when the package is built, so it is the
same text the catalog pages hand over.

Add the contents of `node_modules/@brevy/ui/dist/docs/claude-md-snippet.md` to
the project's `CLAUDE.md`. It tells Claude to read the index first and open
only what the page needs.

## What is in it

**Components** — the parts. Accordion, Avatar, Badge, Button, Chat, Chip,
Container, Form, IconList, IllustrationPanel, Input, Label, LineMarker, Marker,
QuoteCard, ShapedImage, SocialProof, StatFigure.

**Blocks** — whole sections of a page. Navbar, Banner, HeroCentered,
HeroSplit, CardGrid, LogoCloud, MediaCopy, SegmentRows, Faq, Steps, Tiles,
Testimonials, CtaBand, Footer.

**Screens** — AuthSplit, the signed-in product's way in.

Plus `BrevyLockup`, the brand lockup, and the four social marks.

## Using a component

Variants are props, and the ones that exist are the ones the design draws.

```tsx
import { Button } from "@brevy/ui"

export function Actions() {
  return (
    <>
      <Button>Get started</Button>
      <Button variant="outline" size="compact">
        Learn more
      </Button>
    </>
  )
}
```

`Button` takes `variant` (`primary`, `outline`, `secondary`, `ghost`, `send`,
`social`) and `size` (`default`, `compact`). Every component's own props are
documented on its catalog page, which is generated from the same source as the
component.

A variant names what a thing is, so it can decide more than the paint. `Chip`
is the one place that shows: `eyebrow`, `suggestion` and `filter` are things a
page says, and render a `span`; `prompt` is a question the reader sends, so it
renders a `<button type="button">` and takes a button's props. Do not wrap a
chip in a button of your own to make it pressable — that is what `prompt` is,
and it nests a button inside a button.

## Using a block

A block is a section: it brings its own padding, its own container and its own
responsive behaviour, and it takes content rather than layout.

```tsx
import { CtaBand } from "@brevy/ui"

export function Closing() {
  return (
    <CtaBand
      tone="light"
      heading="Find what you qualify for"
      description="Answer a few questions and we will do the rest."
      button={{ label: "Start now", href: "/start" }}
      note="Free, and takes two minutes."
    />
  )
}
```

What a block will not do is rearrange itself. Where the design draws one
skeleton in several shapes, that is a prop — `Steps` has `layout="cards"`,
`layout="panel"` and `layout="app"` — and where it draws two different things,
they are two blocks.

Artwork is a slot rather than a shape. A block that holds a picture takes a
node, because the drawings are hand-placed compositions rather than something
the system can name.

## Working on the package

### Conventions inside the package

- Every component and block carries a `data-slot`, which is how the specs, the
  catalog frames and one component styling the inside of another all find
  things. It is written **after** `{...props}` so a caller cannot take it.
- Variants are CVA. Colours are tokens; a hex in source is a lint error, and so
  is an arbitrary Tailwind value.
- Exports are a list at the foot of the file, not inline.
- Dark is a `dark:` variant on the same element, never a second component.
- Anything that animates carries `motion-reduce`.

### Building it

```sh
pnpm --filter @brevy/ui test       # vitest
pnpm --filter @brevy/ui build      # tsup to dist, then the docs to dist/docs
pnpm --filter @brevy/ui pack       # build, check the docs, pack
```

The package's `exports` points at `src/index.ts`, so the catalog reads the
workspace source directly and a change shows up there without building. A
packed tarball points at `dist` instead, through `publishConfig.exports`.

The docs in `dist/docs` are written by `apps/catalog/scripts/emit-package-docs.ts`
from the catalog's registry, after tsup has cleaned `dist`. They are never
edited by hand: change the catalog page and rebuild.
