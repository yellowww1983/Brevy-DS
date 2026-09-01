"use client"

import { Search } from "lucide-react"

import { CopySystem } from "./copy-system"
import { useSearch, useSearchable } from "./search-provider"
import { SidebarToggle } from "./sidebar-toggle"
import { ThemeToggle } from "./theme-toggle"

export function TopBar() {
  const { query, setQuery } = useSearch()
  const searchable = useSearchable()

  return (
    /* Indented to the page's own column rather than to the bar. The bar had
       24 where the page has 48, which nobody could see until something stood
       at the left end of it: the toggle sat a hair inside the breadcrumb, the
       heading and the first preview, all three of which start at 48. */
    <header className="flex h-14 shrink-0 items-center justify-end gap-5 border-b border-sidebar-border px-12">
      {/* The shell's own controls, held to the left. Grouped so the toggle
          keeps its place on a page that has no search field. */}
      <div className="mr-auto flex items-center gap-3">
        <SidebarToggle />

        {searchable && (
          <div className="relative w-64 shrink-0">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setQuery("")
                }
              }}
              placeholder="Search…"
              aria-label="Search components"
              className="h-8 w-full appearance-none rounded-md border border-input bg-background pr-3 pl-8 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
        )}
      </div>

      <CopySystem />
      <ThemeToggle />
    </header>
  )
}
