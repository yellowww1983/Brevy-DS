"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import type { Axis, ComponentEntry } from "@/registry"
import {
  bestMatch,
  combinationKey,
  combinationMatches,
  combinations,
  getComponent,
  isOmitted,
  matchingCombinations,
  variantCount,
} from "@/registry"
import { useSearch } from "./search-provider"

function caption(axes: readonly Axis[], combination: Record<string, string>) {
  return axes.map((axis) => combination[axis.label] ?? "").join(" · ")
}

function Preview({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li>
      <div
        data-preview
        className="flex min-h-24 items-center justify-center rounded-lg border border-border bg-background p-6 font-sans"
      >
        {children}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
    </li>
  )
}

function Section({
  title,
  children,
}: {
  title: string | null
  children: ReactNode
}) {
  return (
    <section>
      {title && (
        <h2 className="mb-5 text-sm font-semibold tracking-wide uppercase">
          {title}
        </h2>
      )}
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {children}
      </ul>
    </section>
  )
}

function groupsOf(entry: ComponentEntry, query: string) {
  const [first, ...rest] = entry.axes

  if (!first) {
    return combinationMatches(entry, {}, query)
      ? [{ title: null, axes: [] as readonly Axis[], rows: [{}] }]
      : []
  }

  return first.values
    .map((value) => ({
      title: value,
      axes: rest,
      rows: combinations(rest)
        .map((row) => ({ [first.label]: value, ...row }))
        .filter(
          (row) =>
            !isOmitted(entry, row) && combinationMatches(entry, row, query),
        ),
    }))
    .filter((group) => group.rows.length > 0)
}

export function ComponentView({ slug }: { slug: string }) {
  const { query } = useSearch()
  const entry = getComponent(slug)

  if (!entry) {
    return null
  }

  const groups = groupsOf(entry, query)
  const total = variantCount(entry)
  const matching = matchingCombinations(entry, query).length
  const suggestion = bestMatch(query, entry.slug)

  return (
    <>
      <header className="mb-20">
        <h1 className="text-4xl font-bold tracking-tight">{entry.name}</h1>
        <p className="mt-3 text-base text-muted-foreground">
          {matching === total
            ? String(total)
            : `${String(matching)} of ${String(total)}`}{" "}
          {total === 1 ? "variant" : "variants"}
        </p>
      </header>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-medium">
            No {entry.name} variants match “{query}”
            {suggestion ? (
              <>
                {" — "}
                <Link
                  href={`/components/${suggestion.slug}`}
                  className="rounded-sm text-primary underline underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  see {suggestion.name} instead
                </Link>
              </>
            ) : null}
            .
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Clear the search to see all {String(total)} variants.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-14">
          {groups.map((group, index) => (
            <Section key={group.title ?? String(index)} title={group.title}>
              {group.rows.map((row) => (
                <Preview
                  key={combinationKey(entry, row)}
                  label={
                    group.axes.length > 0
                      ? caption(group.axes, row)
                      : (group.title ?? entry.name)
                  }
                >
                  {entry.render(row)}
                </Preview>
              ))}
            </Section>
          ))}
        </div>
      )}
    </>
  )
}
