"use client"

import { cn } from "@brevy/ui"
import {
  ChevronDown,
  CircleHelp,
  Clapperboard,
  Columns3,
  Layers,
  Images,
  LayoutGrid,
  Loader,
  Megaphone,
  Move,
  Palette,
  PanelBottom,
  Grid2x2,
  Rows3,
  ListOrdered,
  LogIn,
  PanelTop,
  Quote,
  Signpost,
  Shapes,
  Squircle,
  Type,
  Wrench,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentType, ReactNode } from "react"

import { components, entriesOf, filterComponents, type Kind } from "@/registry"
import { BrevyLogo } from "./brevy-logo"
import { useSearch, useSearchable } from "./search-provider"
import { useSidebar } from "./sidebar-provider"

type Entry = {
  label: string
  icon: ComponentType<{ className?: string }>
  href?: string
}

/** A block drawn in more than one shape. The heading is the family and the
 *  pages under it are the shapes, which is how the file thinks about heroes:
 *  one skeleton, several arrangements. It renders with the indent the
 *  Components list already uses rather than a second mechanism. */
type Family = {
  label: string
  icon: ComponentType<{ className?: string }>
  variants: readonly { label: string; href: string }[]
}

/** A registry entry names its icon; this is where the name becomes one. It
 *  lives in the sidebar because lucide is the sidebar's business, and keeping
 *  it out of the registry is what lets the registry stay a list of data. */
const ICONS: Readonly<Record<string, ComponentType<{ className?: string }>>> = {
  Clapperboard,
  CircleHelp,
  Columns3,
  Grid2x2,
  Images,
  Layers,
  LayoutGrid,
  ListOrdered,
  Loader,
  LogIn,
  Megaphone,
  Move,
  Palette,
  PanelBottom,
  PanelTop,
  Quote,
  Rows3,
  Shapes,
  Signpost,
  Squircle,
  Type,
}

const GETTING_STARTED: readonly Entry[] = [
  {
    label: "Introduction",
    icon: Zap,
    href: "/getting-started/introduction",
  },
  { label: "How to use", icon: Wrench, href: "/getting-started/how-to-use" },
]

/** Application screens rather than landing sections: what a signed-in product
 *  shows, drawn in the app file but built from this system's parts. Their own
 *  group so a reader assembling a landing page does not reach for one by
 *  mistake. */
const SCREENS: readonly Entry[] = entriesOf("screen").map((entry) => ({
  label: entry.name,
  icon: ICONS[entry.icon ?? ""] ?? Shapes,
  href: entry.href,
}))

const FOUNDATIONS: readonly (Entry | Family)[] = grouped("foundation")

/** A list read from the registry rather than written again here. An entry
 *  arriving used to mean two edits, and the second one was easy to skip.
 *
 *  A family is a heading with shapes under it, which is how the file thinks
 *  about heroes: one skeleton, several arrangements. The two libraries of
 *  motion read the same way. The registry says which family an entry belongs
 *  to and the grouping happens here, because it is a way of drawing a list
 *  rather than a fact about the thing. */
function grouped(kind: Kind): readonly (Entry | Family)[] {
  return entriesOf(kind).reduce<(Entry | Family)[]>((rows, entry) => {
    const item = {
      label: entry.name,
      icon: ICONS[entry.icon ?? ""] ?? Shapes,
      href: entry.href,
    }

    if (!entry.family) {
      return [...rows, item]
    }

    const open = rows.at(-1)

    if (open && "variants" in open && open.label === entry.family) {
      return [
        ...rows.slice(0, -1),
        {
          ...open,
          variants: [...open.variants, { label: entry.name, href: entry.href }],
        },
      ]
    }

    return [
      ...rows,
      {
        label: entry.family,
        icon: item.icon,
        variants: [{ label: entry.name, href: entry.href }],
      },
    ]
  }, [])
}

const BLOCKS: readonly (Entry | Family)[] = grouped("block")

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details
      open
      className="group border-b border-sidebar-border px-4 py-4 last:border-b-0"
    >
      <summary className="flex cursor-pointer list-none items-center rounded-md px-3 py-1.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="ml-auto size-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>

      <div className="mt-2">{children}</div>
    </details>
  )
}

const ITEM = "flex items-center gap-2 px-3 py-2 text-sm"

/** The indent the Components list wears, lifted out so a block family uses the
 *  same one rather than a second that could drift from it. */
const NESTED = "block py-2 pr-3 pl-5 text-sm"
/** The catalog's own accent in the light and the brand's one green in the
 *  dark, which are two tokens because they are two different jobs.
 *
 *  `--sidebar-primary` is the chrome's, brand-500, and it is what this row
 *  wore until the dark palette was pulled onto one green: `--primary` was the
 *  only token that reads `#0e8a4d` there, and taking it for the dark took it
 *  for the light too, where it is emerald-500. So the theme picks. Dark is
 *  untouched by this and stays on the one green the logos and the button
 *  share. */
const NESTED_ACTIVE = cn(
  "font-medium text-sidebar-primary dark:text-primary",
  "before:absolute before:inset-y-0 before:-left-px before:w-0.5",
  "before:bg-sidebar-primary dark:before:bg-primary",
)
const NESTED_REST = "text-muted-foreground hover:text-foreground"

/** Keyboard focus has to stay visible, so the ring stays, tinted to the active
 *  colour rather than the default grey, which read as a box around the item. */
const FOCUS =
  "rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"

/** A family: a heading that goes nowhere and the pages under it. The heading
 *  is a label rather than a disabled link, because there is no page it is
 *  waiting for. It is the name of the group. */
function NavFamily({
  label,
  icon: Icon,
  variants,
  pathname,
}: Family & { pathname: string }) {
  return (
    <div data-family={label}>
      <p className={cn(ITEM, "text-muted-foreground")}>
        <Icon className="size-4" />
        {label}
      </p>

      <ul className="ml-3 border-l border-sidebar-border">
        {variants.map((variant) => {
          const active = pathname === variant.href

          return (
            <li key={variant.href} className="relative">
              <Link
                href={variant.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  NESTED,
                  FOCUS,
                  active ? NESTED_ACTIVE : NESTED_REST,
                )}
              >
                {variant.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** An entry without an href has no page yet: a link would lead to a 404, so it
 *  renders as visibly inert until the page lands. */
function NavEntry({
  label,
  icon: Icon,
  href,
  active,
}: Entry & { active: boolean }) {
  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={cn(ITEM, "cursor-not-allowed text-muted-foreground/60")}
      >
        <Icon className="size-4" />
        {label}
      </span>
    )
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        ITEM,
        FOCUS,
        active
          ? "font-medium text-sidebar-primary dark:text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { query } = useSearch()
  const searchable = useSearchable()
  const { collapsed } = useSidebar()

  const activeSlug = pathname.split("/")[2]
  const matched = new Set(
    filterComponents(searchable ? query : "").map((entry) => entry.slug),
  )
  const matches = components.filter(
    (entry) => matched.has(entry.slug) || entry.slug === activeSlug,
  )

  return (
    <aside
      id="catalog-nav"
      hidden={collapsed}
      /** Out of the way entirely rather than narrowed to a rail. What the
       *  room is wanted for is a preview drawn at 1440, and a rail of icons
       *  standing beside it is 72px of nothing anybody asked to see. */
      className="flex w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar"
    >
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-6">
        <Link
          /** Where the root goes. The two used to disagree, so the way in
           *  depended on whether you typed the address or pressed the logo. */
          href="/getting-started/introduction"
          className="block rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <BrevyLogo />
          <span className="mt-0.5 block text-xs leading-none text-muted-foreground">
            Design System
          </span>
        </Link>
      </div>

      <nav aria-label="Catalog" className="flex-1 overflow-y-auto">
        <Section title="Getting Started">
          {GETTING_STARTED.map((entry) => (
            <NavEntry
              key={entry.label}
              {...entry}
              active={pathname === entry.href}
            />
          ))}
        </Section>

        <Section title="Components">
          <ul data-nav="components" className="border-l border-sidebar-border">
            {matches.map((entry) => {
              const href = `/components/${entry.slug}`
              const active = pathname === href

              return (
                <li key={entry.slug} className="relative">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      NESTED,
                      FOCUS,
                      active ? NESTED_ACTIVE : NESTED_REST,
                    )}
                  >
                    {entry.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </Section>

        <Section title="Blocks">
          {BLOCKS.map((entry) =>
            "variants" in entry ? (
              <NavFamily key={entry.label} {...entry} pathname={pathname} />
            ) : (
              <NavEntry
                key={entry.label}
                {...entry}
                active={pathname === entry.href}
              />
            ),
          )}
        </Section>

        <Section title="Screens">
          {SCREENS.map((entry) => (
            <NavEntry
              key={entry.label}
              {...entry}
              active={pathname === entry.href}
            />
          ))}
        </Section>

        <Section title="Foundations">
          {FOUNDATIONS.map((entry) =>
            "variants" in entry ? (
              <NavFamily key={entry.label} {...entry} pathname={pathname} />
            ) : (
              <NavEntry
                key={entry.label}
                {...entry}
                active={pathname === entry.href}
              />
            ),
          )}
        </Section>
      </nav>
    </aside>
  )
}
