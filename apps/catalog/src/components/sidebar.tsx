"use client"

import { cn } from "@brevy/ui"
import {
  ChevronDown,
  Move,
  Layers,
  Palette,
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

/** Keyboard focus has to stay visible, so the ring stays, tinted to the active
 *  colour rather than the default grey, which read as a box around the item. */
const FOCUS =
  "rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"

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
                      "block py-2 pr-3 pl-5 text-sm",
                      FOCUS,
                      active
                        ? "font-medium text-sidebar-primary before:absolute before:inset-y-0 before:-left-px before:w-0.5 before:bg-primary"
                        : "text-muted-foreground hover:text-foreground",
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
          <p className="px-3 py-2 text-sm text-muted-foreground/60">
            Coming soon
          </p>
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
