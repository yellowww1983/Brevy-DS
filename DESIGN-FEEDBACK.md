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
