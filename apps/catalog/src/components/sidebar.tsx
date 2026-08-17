"use client"

import { cn } from "@brevy/ui"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { components } from "@/registry"
import { BrevyLogo } from "./brevy-logo"
import { ThemeToggle } from "./theme-toggle"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-start justify-between gap-4 border-b border-sidebar-border px-6 py-5">
        <Link
          href="/components"
          className="rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <BrevyLogo />
          <span className="mt-1.5 block text-xs text-muted-foreground">
            Design System
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <nav aria-label="Components" className="flex flex-col gap-1 p-4">
        <p className="px-3 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Primitives
        </p>
        {components.map((entry) => {
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
