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

### 36. The navbar has no interaction states at all

**website**, `23205:1216` desktop, `23205:1918` tablet, `23205:2589` mobile

The bar is drawn once per page and only at rest. There is no hover on the links,
no focus, no state for a page that has been scrolled, and nothing saying the bar
sticks. Searching the file for `hover`, `active`, `pressed`, `scrolled`, `sticky`
and `focus` returns fifteen nodes, all of them body copy or the two boards that
cover something else: "Buttons States" and "Chat States".

The shipped site has all four. The links take a `#dedad6` background on hover,
the bar is `sticky` at the top of the page, and past 50px of scroll the pill
drops to 70% opacity, gains a 12px blur behind it and swaps its shadow.

`@brevy/ui` ships them, taken from the site, because a header without them reads
as broken. Please draw them so the two sides agree, and so the hover colour in
particular is a decision rather than an inheritance: `#dedad6` is the same value
the drawing already uses for the pill's own border.

### 37. Five measurements where the shipped bar and the drawing disagree

**website**, same three nodes

Taken from the drawing in every case, so this is a list of what the code will
have to change rather than the other way round.

|                             | Drawn                             | Shipped                           |
| --------------------------- | --------------------------------- | --------------------------------- |
| Band height                 | 112 at all three widths           | 104 desktop and tablet, 80 mobile |
| Pill width at desktop       | 794                               | 816                               |
| Pill padding                | 16 top and bottom, 24 either side | 12 and 24                         |
| Pill border                 | 1px `#dedad6`                     | none                              |
| Gutter at tablet and mobile | 24 and 16                         | 32 and 20                         |

The last row is the same gutter divergence already recorded against the content
container, so the bar is the second place it shows.

### 38. The open mobile menu is drawn inside the hero and has no surface of its own

**website**, `22687:2120`, the fourth variant of `22659:5737`

The menu is drawn as a version of the hero: the links sit where the hero's own
text sits, over the same mountain artwork, and the call to action takes the place
of the hero's button. There is no panel behind them.

That works as a picture of one page and does not survive being a block, because a
menu opened over a page that does not begin with a hero has nothing behind it.
The frame's own fill is white, so white is what has been built. Please confirm,
or draw the surface the menu is meant to have.

Two smaller things in the same node. The menu names its second link **Eldercare
Guide** while the bar on the same page names it **Blog**, and the shipped site
uses Eldercare Guide in both places. And the menu's links are set at 20/28 while
the type scale reads 20/29, so either the scale or the drawing is a pixel out.

### 39. The Winter page set has two variants with the same name

**website**, `22659:5737`

`Breakpoint=Mobile` appears twice: once as the page and once as the page with the
menu open. Figma reports the set as having errors, and reading properties off any
variant in it throws. The open state is a state rather than a breakpoint, so it
wants a property of its own, something like `Menu=Open`.

Worth saying plainly: this is why the menu was reported as missing the first time
the file was searched. It was found only when the node was pointed at directly.

### 40. The tall input's placeholder is 14 in the footer and 16 everywhere else

**website**, footer inputs across all page sets against the funnel forms and
`24975:935`

The same 48px box, radius 8, `#d4d4d4` hairline, is drawn 66 times. The 25 in
the footers set their placeholder at 14; the 38 funnel fields and the app
page's password field set it at 16. One box, two type sizes, and nothing about
the contexts explains the split.

`@brevy/ui` ships the tall size at 16, with the majority. Please align the
footers.

### 41. The 34px date segments are one-offs, not a size

**website**, Funnel page, two fields ("Mar", 58 and 69 wide)

They differ from every other input in all three dimensions that define the
box: 34 tall against 48, padding 6/8 against 4/12, and a `#dedad6` border
against `#d4d4d4`. Two occurrences on one page. Left out of the system on
purpose; if a date field is meant to become a pattern, it needs a drawing
that agrees with the input it is built from.

### 42. The pill family, mapped

**website**, 167 chips and badges across both drawn pages, plus two pill
shapes the name search does not catch

Four families. A: the fully round chips on the white to `#f5f5f5` gradient,
in three shapes: the 24px eyebrow at 14/Regular `#023620` with an optional
step counter, the 32px chat suggestion at 14/Regular `#27272a`, and the 32px
filter at 16/Medium `#3f3f46`. B: the 24px badges on a radius of 8 at
14/SemiBold, in three skins: white on a `#d4d4d4` hairline, olive on
`#d7e4c9`, beige on `#f5f2ef`, the coloured two with a 16px icon. C: the 40px
notification pill on `#023620` with a gradient hairline, drawn 15 times but
only inside the home pages' hero artwork, which reads as illustration rather
than component. D: the 44px feature pill on white with a gradient disc,
drawn 3 times in the Mobile App section.

A and B are now `Chip` and `Badge` in `@brevy/ui`. C and D are not: C lives
inside artwork, and D is closer to a future block's list item than to a
badge.

### 43. Strays in the chip family

**website**, For Organizations and Caregiving pages

Two eyebrows are drawn 48 tall instead of 24, with vertical padding zeroed
out to hold the height, one of them the only chip whose horizontal padding is 16. And two chips carry gradients ending at `#e5e5e5` and `#f8f5f2` instead
of the `#f5f5f5` the other 129 share, each exactly once. All four read as
copies that drifted rather than as intent. The system ships the majority
values.

### 44. The standalone number badge is drawn once

**website**, "Badge Number" in the Mobile App section

A 24px counter on the badge's olive skin, but fully round where every badge
is drawn at a radius of 8, and padded 0/4 where every badge is padded 2/8.
Both properties that define the box differ, so it is not a fourth badge
variant; it is one occurrence of something else. Left out of the system. The
chip's eyebrow counter, which is drawn twenty times, is shipped instead.

### 45. The hairline is a system pattern drawn three ways

**website**, the chips everywhere, the FAQ cards (`20919:11030` and kin), the
footer's social buttons

The same thin grey thread hugs all three, and the file draws it three ways:
a 1px blur of half black on the chips, a `#e5e5e5` to `#d4d4d4` gradient
stroke on the FAQ cards and the social buttons. The shipped site flattens
them again, differently: the chip keeps the black ring, the FAQ card and the
socials become a solid 1px `#e5e5e5` border.

This is one pattern, not three coincidences, so `@brevy/ui` ships it as one
utility, `hairline`, in the gradient form the FAQ cards and the socials draw:
a crisp 1px line inside the edge, `#e5e5e5` at the top to `#d4d4d4` at the
bottom, painted as a masked overlay so it takes no pixel out of the layout
and holds the full round of a pill. The chips move with it, a step lighter
than the half black ring they were drawn with. Please align the drawings the
other way too, so all three places show the one hairline the system ships.

### 46. The primary green ships darker than it is drawn

**website**, the FAQ contact card's button and the navbar's call to action,
against the shipped site

The file draws both on `#023620`, which is the token the system binds as
primary. The shipped site renders both on `#022f1a`, a step darker, and
nothing in the file draws that value anywhere. The system follows the file;
the production shade reads as a build-time drift, not a decision. Please
confirm `#023620` so the two sides converge.

### 47. The chat mixes both greens in one component

**website**, the hero chat card, against the shipped site

Entry 46's pair, now inside a single component. The file draws the send
button's arrow and its active fill both on `#023620`. The shipped site
renders the resting arrow on `#022f1a` and the active fill on `#023620`, so
the two shades sit a state change apart in the same 48px circle. The system
draws both from the one primary token; please confirm `#023620` so
production can too.

### 48. The chat arrow is drawn at 1.5 and shipped at 2

**website**, the send button's arrow, against the shipped site

The file draws the arrow's vectors at a stroke of 1.5 on the 24 grid, which
is the weight every icon in the file draws. The shipped site renders the
same arrow at 2, lucide's presentation default, so the one icon inside the
hero is heavier than the system around it. The system ships the drawn 1.5.

### 49. The chat placeholder exists in three versions

**website**, the hero chat and the chat states board, against the shipped
site

The states board writes "What can I help you with today?", the hero
instances write "Hi! I can help you check your eligibility in under 3
minutes. What state do you live in?", and the shipped site writes "What can
we help you with today?", which matches neither. The catalog carries the
states board's line. Please settle one voice per surface so the copy stops
drifting.

### 50. The suggestion chips wear a third outline, and more of entry 45

**website**, the rows under the hero chat, against the shipped site

The file draws the hero's suggestion chips with no stroke at all: two inner
shadows and a 1px halo stand in for the thread every other chip wears. The
shipped site gives the same chips the old half-black blur ring that entry 45
already flagged, plus its own arithmetic: padding 6/12 on a 20 line where
the file draws 8/12 on 24, centred rows at a gap of 8 where the file draws
left-aligned rows at 16, and a 16 gap under the card where the file draws 8.
Same height, different everything else. One chip, one outline: the system's
`hairline`, per entry 45.

### 51. The footer's brand links ship five steps away from the drawing

**website**, the footer's social buttons, against the shipped site

The file draws these 103 times across every artboard's footer, always the
same: a 36 square at a radius of 8, white, wearing the gradient thread and
the drawn `0 1 2` shadow, with a 16 mark stroked at 1 in `#3f3f46`. The
shipped site renders five of those properties differently, and one of them
differently from itself.

| property    | drawn                           | shipped                  |
| ----------- | ------------------------------- | ------------------------ |
| outline     | gradient `#e5e5e5` to `#d4d4d4` | flat `#e5e5e5`           |
| radius      | 8                               | 10                       |
| mark stroke | 1 on the 16 box                 | 2                        |
| mark colour | `#3f3f46` (zinc-700)            | zinc-800                 |
| TikTok      | stroked, like the other three   | filled, alone among them |

The outline is entry 45 and 50 again: the same thread, flattened a third
time in a third place. The stroke of 2 is entry 48's twin, and for the same
reason — an icon set's default left in place over the drawn weight. The
radius and the mark colour are each one step off a value the system already
has.

The last one is not a Figma-versus-code question at all: the shipped site
draws three of the four marks as outlines and TikTok as a solid, so the row
is inconsistent with itself. The system takes all four as the file draws
them, outlined. Please confirm that reading, or redraw TikTok filled and
say the row is meant to mix.

The hover is the one thing that already agrees: both sides turn the outline
`#023620` and change nothing else.

### 52. The footer's newsletter ships six steps away from the drawing

**website**, the footer, against the shipped site

The footer is drawn 25 times across the file and every page draws the same
one. The band, the container, the rule, the legal line and the brand links
all ship as drawn. The newsletter does not: six of its properties differ,
and one of them is entry 46 for the third time.

| property       | drawn                   | shipped                 |
| -------------- | ----------------------- | ----------------------- |
| Subscribe fill | `#023620`               | `#022f1a`               |
| field radius   | 8                       | 16                      |
| field outline  | `#d4d4d4` (neutral-300) | `#e5e5e5` (neutral-200) |
| field shadow   | `0 1 2` at 5%           | none                    |
| field padding  | 4 / 12                  | 12 / 16                 |
| placeholder    | `#71717a` (zinc-500)    | zinc-600                |
| card width     | 592                     | 568                     |

The green is the same drift entry 46 records on the FAQ's contact button
and the navbar's call to action; this is its third home, and the pattern is
now firm enough to be worth one decision rather than three.

Everything the field differs on, the system's own `Input` at its tall size
already draws correctly: 48 tall, radius 8, `#d4d4d4`, `shadow-xs`, 12 of
horizontal padding, a zinc-500 placeholder. So the block built from our
parts lands on the file, and it is production that has drifted.

The legal links carry no hover in the file and `hover:underline` in
production. Nothing else in the footer draws a link, so there is no second
drawing to check it against: please confirm whether the underline is
intended, in which case the file should show it.

### 53. For Organizations swaps the eyebrow for the social proof row on mobile

**website**, the For Organizations hero, across its three breakpoints

The slot above the heading holds one thing at a time, and this page changes
which thing at the narrow width. Desktop (`23205:3306`) and tablet both open
with the eyebrow "No cost. No integration. No onboarding. No catch." and draw
no faces. Mobile (`23402:998`) draws the faces, the stars and "Join 2,000+
caregivers already using Brevy", and drops the eyebrow entirely.

Every other hero in the file keeps whichever one it opens with at all three
widths: the four home pages carry the faces at 1440, 810 and 390, the partner
page carries an eyebrow. This is the only page that trades one for the other.

The block treats the slot as one prop with three states, so either reading is
one word to change. Please confirm whether the swap is intended — a page that
leads with a promise on a wide screen and with proof on a narrow one is a
defensible choice, but it is the only one of its kind in the file and reads
equally well as an oversight.

### 54. The hero's illustration band keeps its 1440 frame at every width

**website**, the illustration band under every centred hero

The band's frame is 1440 by 426 in all three breakpoints. What changes inside
it is the artwork — the main illustration is 1406, 1082 and 524 across desktop,
tablet and mobile, and the character shrinks with it — but the frame around
them does not, so at 390 the band is a 1440 canvas centred and cropped by a
390 window rather than a band fitted to the page.

Two details follow from it. The `Fade` mask does resize with the page (1440,
810, 389), so the mask and the frame it masks disagree about how wide the hero
is. And the birds hold at 93 by 68 at every width while everything else around
them scales, which makes them proportionally almost three times larger on
mobile than on desktop.

The block fits the picture to the page instead, because a client's image
carries none of these hand-placed layers. Please confirm whether the drawn
crop is deliberate framing or a frame nobody resized.

### 55. The stacked social proof uses two different gaps

**website**, the row of faces where it stacks, on four pages

The row of faces, stars and a claim stacks — faces and stars on one line, the
sentence beneath — in two places, and the two are drawn 8px apart from each
other.

| where                        | node         | gap |
| ---------------------------- | ------------ | --- |
| Home, mobile                 | `22626:8697` | 12  |
| For Organizations, mobile    | `23402:998`  | 12  |
| Caregiving, all three widths | `22653:4862` | 4   |

Everything else about the two is identical: the same 80 by 32 stack overlapping
by 8, the same five 16 by 15 stars 6 apart, the same 12 between the faces and
the stars, the same 14/24 sentence underneath.

Caregiving is also the only page that stacks at every width rather than only
where the row runs out of room, which is its own answer — the picture beside
the copy leaves no space for the 555 the wide row measures. That part is clear.
The 4 is not.

The system ships 4. Three samples draw 12 and one draws 4, so the count points
the other way — but Caregiving is the page that draws this arrangement at the
size it is meant to be read at, beside a picture and inside a hero, and at 12
the sentence reads as a second thing rather than as a caption on the row above
it. The other three stack only because a narrow page ran out of room for the
wide row, which makes them the incidental case rather than the drawn one.

Please confirm the other direction from the one we first asked: is the 12 on
Home and For Organizations mobile an oversight, or is the looser pairing meant
where the stack is a fallback rather than the intended arrangement?
