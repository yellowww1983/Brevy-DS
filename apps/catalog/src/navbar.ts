import type { NavbarCta, NavbarLink } from "@brevy/ui"

import { join, preamble, table } from "./doc"

/** The first block, so its prose carries what a block page is: what the block
 *  is for, what it takes, and what it does at each width. */

export const INTRO =
  "The page header. A pill holding the logo on the left and the links on the right, on a band the width of the screen. Below the tablet width the links move into a menu that covers the page."

export const USE = [
  "`Navbar` takes the logo, the links and an optional call to action. It is fixed to the top of the screen, so it belongs at the top of a document and whatever the page opens with passes underneath it.",
  "Everything inside the pill is a `Button`. The links are the ghost variant and the menu's call to action is the primary variant, both matching what the design draws without a class of their own.",
]

export const WIDTH = [
  "The pill is 794px wide and centred. Below that it takes whatever the container gives it, which is 762px at tablet and 358px at mobile.",
  "The band around it is 112px tall at every width: 24px above and below a pill of 64px.",
]

export const SCROLL = [
  "The pill itself never changes. The same opaque beige, the same hairline, no blur and no shadow, at the top of the page and a thousand pixels down it.",
  "One thing moves. Once the page has scrolled by the height of the band, the call to action opens out of nothing on the right, fading in over 300ms. Scroll back to the top and it closes again.",
]

export const MENU = [
  "At mobile the links leave the pill and an icon takes their place. Opening it covers the page, stops the page behind it scrolling, and turns the icon into a close button.",
  "The menu lists the same links at 20px, and pins the call to action to the foot of the screen in the same container as the rest of the page. It is drawn at the full button height there, and at `compact` in the bar.",
]

/** What the design draws at each width, and what the block owes there. The page
 *  reads these off the rendered block rather than printing them. */
export const WIDTHS = [
  { label: "Mobile", width: 390, bar: 112, pill: 358, links: 0, height: 844 },
  { label: "Tablet", width: 810, bar: 112, pill: 762, links: 2, height: 460 },
  { label: "Desktop", width: 1440, bar: 112, pill: 794, links: 2, height: 460 },
] as const

export type Width = (typeof WIDTHS)[number]

function entryFor(width: number) {
  return WIDTHS.find((entry) => entry.width === width) ?? WIDTHS[2]
}

/** Mobile gets a phone's height because the menu covers the screen and a frame
 *  shorter than a screen would cut it off. The other two only ever show a bar
 *  and a strip of the page under it. */
export function heightFor(width: number) {
  return entryFor(width).height
}

export const CTA: NavbarCta = {
  label: "New chat",
  href: "#chat",
}

/** The set the design draws on the home pages. Two of the ten pages in the file
 *  draw three links instead, and one draws a label rather than links, so the
 *  block takes them rather than owning them. */
export const LINKS: readonly NavbarLink[] = [
  { label: "Get paid for caregiving", href: "#caregiving" },
  { label: "Eldercare Guide", href: "#guide" },
]

export function navbarDoc() {
  return join([
    preamble("Navbar", "block"),
    "",
    "# Navbar",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { BrevyLockup, Navbar } from "@brevy/ui"',
    "",
    "<Navbar",
    '  logo={<BrevyLockup className="h-10 w-auto text-brand-500" />}',
    "  links={[",
    '    { label: "Get paid for caregiving", href: "/caregiving" },',
    '    { label: "Eldercare Guide", href: "/guide" },',
    "  ]}",
    '  cta={{ label: "New chat", href: "/chat" }}',
    "/>",
    "```",
    "",
    "## Width",
    "",
    ...WIDTH.flatMap((paragraph) => [paragraph, ""]),
    table(
      ["Width", "Band", "Pill", "Links in the pill"],
      WIDTHS.map((entry) => [
        `${String(entry.width)}px`,
        `${String(entry.bar)}px`,
        `${String(entry.pill)}px`,
        entry.links === 0 ? "none, an icon instead" : String(entry.links),
      ]),
    ),
    "",
    "## Once the page scrolls",
    "",
    ...SCROLL.flatMap((paragraph) => [paragraph, ""]),
    "## The menu",
    "",
    ...MENU.flatMap((paragraph) => [paragraph, ""]),
  ])
}
