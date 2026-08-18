"use client"

import { cn } from "@brevy/ui"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { components, filterComponents } from "@/registry"
import { BrevyLogo } from "./brevy-logo"
import { useSearch } from "./search-provider"
import { SectionTabs } from "./section-tabs"

export function Sidebar() {
  const pathname = usePathname()
  const { query } = useSearch()

  const activeSlug = pathname.split("/")[2]
  const matched = new Set(filterComponents(query).map((entry) => entry.slug))
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

      <div className="px-4 pt-4">
        <SectionTabs />
      </div>

      <nav aria-label="Components" className="flex flex-col gap-1 p-4">
        {matches.length > 0 && (
          <p className="px-3 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Primitives
          </p>
        )}

        {matches.map((entry) => {
          const href = `/components/${entry.slug}`
          const active = pathname === href

          return (
            <Link
              key={entry.slug}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              {entry.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
