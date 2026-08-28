"use client"

import { cn } from "@brevy/ui"
import {
  ChevronDown,
  CircleHelp,
  Columns3,
  Layers,
  Megaphone,
  Move,
  Palette,
  PanelBottom,
  ListOrdered,
  PanelTop,
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

import { components, filterComponents } from "@/registry"
import { BrevyLogo } from "./brevy-logo"
import { useSearch, useSearchable } from "./search-provider"

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

const GETTING_STARTED: readonly Entry[] = [
  {
    label: "Introduction",
    icon: Zap,
    href: "/getting-started/introduction",
  },
  { label: "How to use", icon: Wrench, href: "/getting-started/how-to-use" },
]

const FOUNDATIONS: readonly Entry[] = [
  { label: "Colors", icon: Palette, href: "/getting-started/colors" },
  { label: "Typography", icon: Type, href: "/getting-started/typography" },
  { label: "Spacing", icon: Move, href: "/getting-started/spacing" },
  { label: "Radius", icon: Squircle, href: "/getting-started/radius" },
  { label: "Shadows", icon: Layers, href: "/getting-started/shadows" },
  { label: "Icons", icon: Shapes, href: "/getting-started/icons" },
  { label: "Layout", icon: Columns3, href: "/getting-started/layout" },
]

const BLOCKS: readonly (Entry | Family)[] = [
  { label: "Navbar", icon: PanelTop, href: "/blocks/navbar" },
  {
    label: "Hero",
    icon: Megaphone,
    variants: [
      { label: "Centered", href: "/blocks/hero/centered" },
      { label: "Split", href: "/blocks/hero/split" },
    ],
  },
  { label: "FAQ", icon: CircleHelp, href: "/blocks/faq" },
  { label: "Steps", icon: ListOrdered, href: "/blocks/steps" },
  { label: "CTA Band", icon: Signpost, href: "/blocks/cta" },
  { label: "Footer", icon: PanelBottom, href: "/blocks/footer" },
]

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
const NESTED_ACTIVE =
  "font-medium text-sidebar-primary before:absolute before:inset-y-0 before:-left-px before:w-0.5 before:bg-primary"
const NESTED_REST = "text-muted-foreground hover:text-foreground"

/** Keyboard focus has to stay visible, so the ring stays, tinted to the active
 *  colour rather than the default grey, which read as a box around the item. */
const FOCUS =
  "rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"

/** A family of blocks: a heading that goes nowhere and the shapes under it.
 *  The heading is a label rather than a disabled link — there is no page it is
 *  waiting for, it is the name of the group. */
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
          ? "font-medium text-sidebar-primary"
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

  const activeSlug = pathname.split("/")[2]
  const matched = new Set(
    filterComponents(searchable ? query : "").map((entry) => entry.slug),
  )
  const matches = components.filter(
    (entry) => matched.has(entry.slug) || entry.slug === activeSlug,
  )

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-6">
        <Link
          href="/components"
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
          <ul className="border-l border-sidebar-border">
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

        <Section title="Foundations">
          {FOUNDATIONS.map((entry) => (
            <NavEntry
              key={entry.label}
              {...entry}
              active={pathname === entry.href}
            />
          ))}
        </Section>
      </nav>
    </aside>
  )
}
