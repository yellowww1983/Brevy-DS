"use client"

import { cn } from "@brevy/ui"
import Link from "next/link"
import { usePathname } from "next/navigation"

const SECTIONS = [
  { label: "Components", href: "/components", available: true },
  { label: "Blocks", href: "/blocks", available: false },
]

const TAB = "flex-1 rounded-md px-3 py-1.5 text-center text-sm font-medium"

export function SectionTabs() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 rounded-lg bg-sidebar-accent p-1">
      {SECTIONS.map((section) => {
        if (!section.available) {
          return (
            <span
              key={section.label}
              aria-disabled="true"
              className={cn(TAB, "cursor-not-allowed text-muted-foreground/50")}
            >
              {section.label}
            </span>
          )
        }

        const active = pathname.startsWith(section.href)

        return (
          <Link
            key={section.label}
            href={section.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              TAB,
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active
                ? "bg-background text-foreground shadow-sm dark:bg-accent"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {section.label}
          </Link>
        )
      })}
    </div>
  )
}
