"use client"

import Link from "next/link"

import { filterComponents, variantLabel } from "@/registry"
import { useSearch } from "./search-provider"

export function ComponentGrid() {
  const { query } = useSearch()
  const matches = filterComponents(query)

  if (matches.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="font-medium">No components match “{query}”.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Clear the search to see all {filterComponents("").length} primitives.
        </p>
      </div>
    )
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {matches.map((entry) => (
        <li key={entry.slug}>
          <Link
            href={`/components/${entry.slug}`}
            className="block rounded-xl border border-border bg-card p-6 hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="block text-lg font-semibold">{entry.name}</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {variantLabel(entry, query)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
