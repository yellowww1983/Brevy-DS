# @brevy/ui

Brevy's components and page blocks. Internal to this workspace: the catalog in
`apps/catalog` consumes it, and nothing is published to npm.

Everything comes out of the one entry point.

```tsx
import { Button, CtaBand, Navbar } from "@brevy/ui"
```

Styles come from `@brevy/tokens`, which the consuming app imports once. Without
it the components render unstyled: the package ships no CSS of its own and
every colour, size and radius is a token.

## What is in it

**Components** — the parts. Accordion, Avatar, Badge, Button, Chat, Chip,
Container, Form, IconList, IllustrationPanel, Input, Label, LineMarker, Marker,
QuoteCard, ShapedImage, SocialProof, StatFigure.

**Blocks** — whole sections of a page. Navbar, HeroCentered, HeroSplit,
CardGrid, LogoCloud, MediaCopy, SegmentRows, FAQ, Steps, Tiles, Testimonials,
CtaBand, Footer.

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
skeleton in several shapes, that is a prop — `Steps` has `layout="cards"` and
`layout="panel"` — and where it draws two different things, they are two
blocks.

Artwork is a slot rather than a shape. A block that holds a picture takes a
node, because the drawings are hand-placed compositions rather than something
the system can name.

## Conventions inside the package

- Every component and block carries a `data-slot`, which is how the specs, the
  catalog frames and one component styling the inside of another all find
  things. It is written **after** `{...props}` so a caller cannot take it.
- Variants are CVA. Colours are tokens; a hex in source is a lint error, and so
  is an arbitrary Tailwind value.
- Exports are a list at the foot of the file, not inline.
- Dark is a `dark:` variant on the same element, never a second component.
- Anything that animates carries `motion-reduce`.

## Building it

```sh
pnpm --filter @brevy/ui test       # vitest
pnpm --filter @brevy/ui build      # tsup, to dist
```

The package's `exports` points at `src/index.ts`, so the catalog reads the
workspace source directly and a change shows up there without building. The
`tsup` build is left in place for the day this is consumed from outside the
workspace; nothing here depends on `dist` today.
