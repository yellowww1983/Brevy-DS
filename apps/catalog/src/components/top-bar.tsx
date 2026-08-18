"use client"

import { Search } from "lucide-react"

import { useSearch } from "./search-provider"
import { ThemeToggle } from "./theme-toggle"

export function TopBar() {
  const { query, setQuery } = useSearch()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-5 border-b border-sidebar-border px-6">
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
          placeholder="Search components and states…"
          aria-label="Search components"
          className="h-8 w-full appearance-none rounded-md border border-input bg-background pr-3 pl-8 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
      </div>

      <ThemeToggle />
    </header>
  )
}
