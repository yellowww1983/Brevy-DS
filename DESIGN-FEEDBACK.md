# Figma findings

Collected while building `brevy-ds`. Every entry carries a node id so it can be
located directly. None of it has been worked around in code — the components
mirror what is drawn.

Files:

- **app** — `Brevy_app_shadcn`, fileKey `6NGEMJh4TItgcDPi2KzQG7`
- **website** — `Brevy Website`, fileKey `2n63p266wr49k1FNXjT1uw`

---

## Blocking

### 1. The website Button has no Focus state

**website**, frame `22912:1932` "Buttons States"

The columns are Default / Hover / Disabled / Active. Without Focus there is no
keyboard focus indicator, which makes the buttons unusable without a mouse.

`@brevy/ui` now ships the website Button only, and it carries a 3 px `ring/50`
focus ring taken from the app language regardless of Figma. Please add the state
so the two sides agree.

### 2. The website Button binds to the raw palette instead of the semantic layer

**website**, frame `22912:1932`

The buttons resolve to `tailwind colors/emerald/500`, `tailwind colors/olive/500`
and `tailwind colors/beige/600` — a collection with a **single mode**. In the same
places, the app file uses `base/primary`, `base/accent` and `base/input` from the
`3. Mode` collection, which carries Light and Dark.

Consequence: the website buttons will not change in dark mode. Please rebind them
to the semantic layer.

### 3. Badge `default` and `destructive` also hang off the raw palette

**app**, component set `26:169`

- `default` → `tailwind colors/olive/500` + `tailwind colors/brand/500`
- `destructive` → `tailwind colors/red/200` + `tailwind colors/red/800`

Neither variant responds to dark mode. The file already contains the pairs nobody
used here: `custom/olive-500 dark:neutral-700`, `custom/red-200 dark:red-950`,
`custom/red-800 dark:red-300`.

That this is an oversight rather than a decision is suggested by the `Verified`
variant — it **is** bound to the mode-aware `custom/blue-500 dark:blue-600`.

---

## Contradictions inside the files

### 4. `base/primary` bypasses its own indirection

**app**, collection `3. Mode`

All 32 `base/*` tokens point at `colors/*-light`. The single exception is
`base/primary`, which in Light points straight at `tailwind colors/emerald/500`.
That leaves `colors/primary-light` (= `neutral/900`) dead — nothing uses it.

Either delete it or rebind, depending on what was intended. The code follows
`base/primary`, so `emerald/500`.

### 5. The `olive` ramp breaks monotonicity

**app**, collection `1. TailwindCSS`

`olive/400` = `#d4e2c6` is **darker** than `olive/500` = `#d7e4c9`. Checked by
luminance across all ten Brevy ramps — this is the only inversion.

### 6. `border-width/border-7` holds the value 6

**app**, collection `1. TailwindCSS`

Identical to `border-6`. Looks like a typo.

---

## Gaps and open questions

### 7. Badge is missing `Secondary/Hover` and `Outline/Hover`

**app**, component set `26:169` — 13 variants instead of 15.

### 8. Badge `Destructive/Hover` and `Verified/Hover` are identical to `Default`

**app**, component set `26:169`

The variants exist but differ in nothing measurable. Deliberate or unfinished?
Omitted in code.

### 9. Button is missing 11 combinations

**app**, component set `37:931` — 133 out of 144.

The whole of `Link/icon/*` (6 states) is absent, as is
`{Default, Secondary, Destructive, Outline, Ghost}/icon/Loading` (5). `@brevy/ui`
no longer ships this Button — it follows the website board instead — so the gap
blocks nothing today. Recorded in case the set is ever used as a source again.

### 10. Active changes size

**website**, circular button `22912:1918`

In the Active state the button grows from 48×48 to **50×50**, and its radius
changes from `9999` to `45.5`. No other button in the frame changes size.
Deliberate, or an accidental stretch?

### 11. The palette is Tailwind v3

**app**, collection `1. TailwindCSS`

49 sampled steps match `tailwindcss@3.4.17` byte for byte. The project runs on
Tailwind v4, which recomputed the palette in oklch — hence deltas up to Δ38
(for example `red/600` `#dc2626` in Figma versus `#e7000b` in v4).

The families Brevy rebranded (`emerald`, `green`, `orange`, `stone`, `violet`,
`yellow`) and the Brevy-only ones (`brand`, `olive`, `beige`, `taupe`) are not
affected.

The code keeps the Figma values. Migrating to v4 is a separate decision.

### 12. The logo has no dedicated dark-background version

**website**

The primary lockup `20919:10347` is in `brand/500`. The only occurrence of the
wordmark in a light colour is `25187:629` — lifted from an Open Graph image, in
`olive/500`.

The two lockups have **incompatible proportions**: at the same height the wordmark
in the light version is 56% smaller (15.9 px versus 24.8 px) while its mark is
larger (28 px versus 24.1 px).

The catalog uses the geometry of `25187:629` in both themes, tinted through a
token. Please supply one pair with matching proportions.

---

## To relocate, not to fix

### 13. Material for `packages/blocks`

- **website** `22912:1932` — the circular 48 px button with a gradient stroke,
  inner shadow and an `#aee177` glow at 30%
- **website** `22912:1214` — the 36 px icon button on white with a drop shadow
  and a `neutral/200 → neutral/300` gradient stroke
- **website** `22912:1932` — "Chips" 132×32
- **app** `15003:160044` and following — `Pro Blocks / Card / 1.–8.`
- **app** `297:2355` — `Input + Button`

These are compositions, not primitives. They do not belong in `@brevy/ui`.

---

## The website Button board

### 14. The board is a hand-drawn board, not a component set

`22912:1932` draws four Button rows across four state columns: primary 48 px with
a label, primary 48 px with an icon and a label, ghost 36 px with a label, ghost
36 px with an icon alone. `@brevy/ui` now ships exactly those four forms and
nothing else.

Because the rows are loose frames rather than variants of a component set, the
matrix cannot be verified mechanically — every cell was read one at a time. A
proper component set would let us diff the build against the design.

### 15. `Primary · label` has no Active, but `Primary · icon + label` does

Row `22912:1924 / 1941 / 1967` stops after Default, Hover and Disabled. The row
directly below it, `22912:1956 / 1962 / 1969 / 2589`, adds Active. The two rows
are the same button with and without an icon, so the missing cell reads as an
omission rather than a decision.

The catalog marks that one combination as `missing in Figma` and draws 19 cells
instead of 20.

Also worth noting: the Active cell that does exist is **identical to Hover** —
white fill, `emerald/500` stroke, `emerald/500` label, the same hexes. If a press
is meant to look different from a hover, it is not drawn anywhere.

---

## The outline and secondary variants

Both were found outside the states board and are now part of `@brevy/ui`.
`outline` is drawn as white with an `emerald/500` stroke — `24977:629` with a
label, `24936:9004` and `24936:9010` with an icon before it, `24977:616` and
`24977:620` as a square icon button. `secondary` is drawn as an `olive/500`
fill with no stroke — `25109:1705`, `25297:4541`, `25318:12356`, `25109:1672`.

### 18. Horizontal padding: the file says 24, production ships 28

Every leaf button in Figma declares `12/24`. Every leaf button on
`brevy-mobile-lp.vercel.app` computes to `0px/28px`, read from live CSS rather
than inferred. The code follows the file at 24 so the four variants stay
internally consistent, but one of the two sources is wrong and they should be
brought together.

### 19. `outline` renders at font-weight 500 in production

Primary, secondary and ghost all compute to 400, and Figma specifies Regular
for all four. Only `outline` on the live site is 500 — production disagreeing
with itself rather than with the file, so the code stays at 400 for every
variant. Worth correcting on the Brevy side.

### 20. Neither `outline` nor `secondary` has an Active state

Nothing is drawn in Figma and nothing is defined in the production CSS beyond
hover and disabled. Primary carries Active only in its icon-and-label form. The
catalog marks four combinations as `missing in Figma` and draws 31 cells rather
than 35.

### 21. The app drains olive out of dark, and the code overrides that

Read through `valuesByMode` rather than a raw fill, the app file answers the
question explicitly and the answer is grey. A whole family exists in
`3. Mode`:

| variable                            | Light     | Dark      |
| ----------------------------------- | --------- | --------- |
| `custom/olive-200 dark:neutral-800` | `#e6eedc` | `#262626` |
| `custom/olive-300 dark:neutral-900` | `#dce7cf` | `#171717` |
| `custom/olive-400 dark:neutral-800` | `#d4e2c6` | `#262626` |
| `custom/olive-500 dark:neutral-700` | `#d7e4c9` | `#404040` |
| `custom/olive-600 dark:neutral-600` | `#b8c7aa` | `#525252` |

The names say it outright: the entire olive ramp becomes a neutral grey in
dark, and `base/secondary` does the same — `beige/500` in light,
`neutral/800` in dark. The `tailwind colors/olive/*` ramp itself carries one
mode only, so there is no olive value for dark to read.

`@brevy/ui` deliberately departs from that and keeps `olive/500` in both
modes, so the brand stays in the variant instead of turning into a grey
block. Only the outline colour flips between modes, because `emerald/500`
reads on white and `olive/500` reads on near-black.

This is a decision, not a gap. It is recorded so the two sides can agree on
one answer rather than discovering the difference later.

### 22. `secondary` hover: production drops the outline, the code adds one

Both sources agree that hovering `secondary` turns the `olive/500` fill white
and leaves no border: Figma draws no hover at all, and production computes
`#d7e4c9 → #ffffff` with `border-width: 0` throughout. The code deliberately
departs from that and adds a green outline on hover, matching what `primary`
does, so the button keeps a visible edge in every context.

Worth knowing why the sources look thinner than they are: `secondary` sits on a
`#023620` surface in production, where turning white is the strongest contrast
available rather than a disappearance. On a light surface — which is where the
catalog previews it — the same hover has no edge at all. The added outline
covers both cases; production should pick one and match it.

### 23. Primary carries a stroke in its own fill colour in production

The board draws primary with no stroke at all. Production gives it
`1px solid #023620` on a `#023620` fill — invisible, and there to keep the box
from shifting when hover inverts it. The code does the same.

---

## Missing dark values for the web Button

The web Button needs two interaction colours the Figma board only defines for
light. Each ships with an explicit fallback rather than a guessed colour, so dark
mode stays legible — but the interaction it should express is currently absent.

### 16. `--surface-hover` has no dark value

Light is `beige/600`, the hover fill drawn for the ghost rows. Dark falls back to
`accent` (`neutral/700`).

### 17. `--surface-active` has no dark value

Light is `beige/700`. Dark also falls back to `accent`, so **hover and active are
indistinguishable in dark mode** for ghost.

Together these need one pair of neutral interaction surfaces for dark, a step
apart from each other.

---

### 24. `neutral` and `zinc` are missing from the palette, so both fall back to Tailwind v4

The `@theme` block defines seventeen families — brand, olive, beige, taupe,
emerald and the rest — but neither `neutral` nor `zinc`. Every
`--color-neutral-*` and `--color-zinc-*` reference therefore resolves against
Tailwind v4's built-in ramps in oklch rather than the Figma values pinned to v3.

Counted across the website design page, these are not marginal families — they
are the two most-used in the file:

| family    | uses in the design               | semantic tokens that resolve to it |
| --------- | -------------------------------- | ---------------------------------- |
| `zinc`    | 2182, more than any other family | 6 in light — all body text         |
| `neutral` | 750                              | 8 in light, **19 in dark**         |

Nineteen of the thirty-three semantic tokens resolve to `neutral` in dark mode,
including `--background`, `--card`, `--popover`, `--muted`, `--accent` and every
foreground. In light, `--foreground`, `--border`, `--input` and `--ring` are the
same story. The differences are small because v4 recomputed the same colours,
but the whole skeleton of the system currently hangs off two ramps nobody wrote
down. Either emit both families alongside the others or state that they are
intentionally Tailwind's.

---

## Typography

### 25. The hero is drawn at two sizes, and the larger one is the exception

Across the website page, every top-level page frame opens with a Hedvig hero.
Seven of them are drawn at **42/36/30** for desktop, tablet and mobile — the four
seasonal Home Pages, Caregiving, For Organizations and the partner page, plus the
Open Graph card. One page, **Mobile App**, opens at **60** and is the only frame
in the file drawn that way; it also has no tablet or mobile variant, so 60 has no
smaller counterpart anywhere.

The two are not distinguished in the file. Both are local text with no shared
style and no name, so the distinction between "a page opens" and "this page opens
louder" exists only as a size. We have named them: **`h1` is 42**, the opening
seven pages share, and **`display` is 60**, the Mobile App exception.

Two things to confirm:

1. **Is `display` a role or a one-off?** If the louder hero belongs only to the
   Mobile App landing, it is a page-level exception rather than a system role and
   should be called that. If other pages are meant to reach for it, it needs a
   rule for when.
2. **Mobile App has no tablet or mobile frame.** `display` is drawn at exactly one
   width. Its behaviour below 1440 is inferred, not designed.

### 26. Our sizes deliberately differ from production

Production ships `display` at up to **72** and `h1` at up to **60**, both sized
around the Mobile App landing — the only page built so far — and neither matches
the 42 hero the other seven pages share. That hero has no size in the code at all
today.

We have overridden production: **`display` 60, `h1` 42**. The system serves seven
pages, not one, so the size seven of them share is the one that gets the primary
name. Production's 72 is not drawn anywhere in the file and has been dropped.

### 27. The h1 steps are not on a straight line — resolved, no action needed

Recorded so nobody re-derives it later. The drawn sizes are 30 at 390, 36 at 810
and 42 at 1440. The first step gains 6px over 420px of width; the second gains the
same 6px over 630px, so the three points are not collinear and no single fluid
size — which is a straight line — can pass through all of them.

Two lines can, one per segment, meeting at 36. Because the first is the lower of
the two below 810 and the second is lower above it, `min()` selects the right
segment at every width with no breakpoint involved. **h1 now renders 30 / 36 / 42
at 390 / 810 / 1440 exactly**, and stays fluid in between.

This is a technique, not a divergence. It costs one thing worth knowing: the curve
bends at tablet rather than running straight, so h1 grows faster below 810 than
above it. If the intent was a constant rate of growth instead, the drawn tablet
value is the one to revisit.

### 28. Body leading and letter-spacing differ from the file

Two smaller divergences carried knowingly:

- **Body leading.** Production authors 1.6; the file draws 1.5. We ship 1.5.
- **Letter-spacing.** The file applies **−0.9%** tracking to the headings. We ship
  0, because production does, and the difference is invisible below 42px.

Production also authors two values nothing in the file uses — an `h3` that runs
24→30 and a 13px `label`. We ignore both.

---

## Colour

### 29. Two fifths of the colour in the design is a raw hex

Of 13,396 colour applications on the website design page, **5,662 carry no
variable** — they are hexes typed onto a layer. The rest resolve to a named
token.

Spot-checking the largest of them (`#1c3c6e`, `#cc7c5e`, `#2b2e34`, `#ffc709`,
`#008bcc`, `#009fab`, `#da2d5b`) they look like illustration art, partner
logotypes and stock imagery rather than interface colour, which would make this
expected rather than wrong. Two things are worth confirming:

1. **Is all of it artwork?** If any interface surface is painted with a raw hex,
   it will not follow a theme and will not appear in the system at all.
2. **`#066e3d` appears 62 times as a raw hex** while also existing as
   `brand/500`. That one is certainly the brand green typed in by hand rather
   than picked, and it is the pattern most likely to drift.

### 30. Six ramps exist only to feed five chart colours nothing renders

`amber`, `blue`, `cyan`, `purple`, `rose` and `teal` are defined in full — 66
tokens. Nothing in the design draws any of them, and the only thing in code that
names them is `--chart-1` through `--chart-5`, which no component uses. The
chain ends in nothing:

```
6 families  →  10 references  →  --chart-1..5  →  (unused)
```

Charts are not on the roadmap, so this is not urgent. It is recorded because the
ramps read as "available palette" when they are closer to leftovers from the
shadcn starter. Either a charting component is coming and they should stay, or
they and the chart tokens can go together. The colours page omits all six and
says so rather than showing sixty-six swatches nobody can use.

---

## Spacing

### 31. The logo strip is fitted by hand, and fitted twice

Across the six page templates, 3,163 gaps and paddings were measured. **96.4% of
them land on a four-pixel grid**, which is a strong result and the reason the
spacing scale needed no invention — Tailwind's ladder already is that grid.

Three values sit outside the scale for a reason worth stating. **40, 56 and 60
appear in one place only: the strip of partner logos.** None is used as a gap
anywhere; all three are padding on that one block, evidently nudged so marks of
different widths sit evenly. That is a fitting rather than a step, and it is why
the spacing page omits them.

Within that block, **the same horizontal padding is drawn as 56 in one place and
60 in another** — 44 times and 12 times. If the strip is meant to be even, one of
the two is wrong; if the two are deliberate, the reason is not visible in the
file.

### 32. A hundred and fifteen measurements sit off the grid

The remaining 3.6% never resolve to a four-pixel step:

| value                  | uses    | reading             |
| ---------------------- | ------- | ------------------- |
| `41`                   | 20      | nudged 40           |
| `6`                    | 26      | nudged 4 or 8       |
| `2`                    | 21      | nudged 4            |
| `33`, `39`             | 10 each | nudged 32 and 40    |
| `42`                   | 6       | nudged 40           |
| `129`, `349`           | 6 each  | one-off layout gaps |
| `10`, `31`, `102`, `1` | 1–5     | one-offs            |

The cluster at **31, 33, 39, 41, 42** is the telling one: 48 measurements that
are all within two pixels of 32 or 40. They read as dragged rather than typed,
and each one is a place where a developer has to decide which step was meant.

---

## Radii

### 33. The radius ramp came from the app file, not the website

The token file defines eight radii — `xs` through `4xl` — and their values match
the app file rather than anything drawn on the website. Two consequences follow,
and both are visible in code today.

**Four of the eight are never drawn.** Across the six page templates, `2`, `14`,
`24` and `32` appear zero times. They are the same kind of leftover as the six
colour ramps that exist only to feed unused chart tokens.

**The names no longer mean what Tailwind means by them.** Because the values came
from elsewhere, five of them sit a step away from the framework's own:

| class         | here | stock Tailwind |
| ------------- | ---- | -------------- |
| `rounded-sm`  | 6px  | 4px            |
| `rounded-md`  | 8px  | 6px            |
| `rounded-lg`  | 10px | 8px            |
| `rounded-xl`  | 14px | 12px           |
| `rounded-2xl` | 16px | 16px           |

This is the opposite of the spacing result, where Tailwind's ladder turned out to
be the design's own grid and nothing had to be overridden. Here the override is
real, so anyone typing `rounded-md` from habit gets a different corner than they
expect. The radii page carries a warning about it; the reason it happened is
recorded here.

### 34. `full` was the most-drawn radius and had no token

`9999` is used **171 times across all six pages** — avatars, chips, dots, rules —
more than any other radius including the 16 that cards and photographs use. It
was absent from the token file entirely.

It has been added as `--radius-full`. Recorded because it is the third foundation
where the most-used value in the design was the one missing from the tokens,
after `neutral` and `zinc` in colour.

### 35. The leaf is a brand shape and was locked inside one component

`6px 16px 6px 16px` — tight on one diagonal, wide on the other — is drawn **46
times on five of the six pages, and never once inside the app mockup**. It is the
website's own signature, and it is not only a button: **18 of those uses are
photographs**, and roughly 30 further elements round a subset of their corners at
16 in the same spirit.

In code it existed as a private string inside `button.tsx`, so nothing but a
button could reach for it. It is now `rounded-leaf`, defined beside the radius
scale. Worth confirming with the designer that the corner-subset variants are
meant as the same signature rather than as separate shapes.
