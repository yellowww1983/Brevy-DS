"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import type { Axis, ComponentEntry } from "@/registry"
import {
  bestMatch,
  combinationKey,
  combinationMatches,
  combinations,
  copyChoices,
  getComponent,
  isOmitted,
  subjectOf,
  variantCount,
  variantLabel,
} from "@/registry"
import { CopyIntent } from "./copy-intent"
import { useSearch } from "./search-provider"
import { ViewportProvider } from "./viewport-frame"

function caption(axes: readonly Axis[], combination: Record<string, string>) {
  return axes.map((axis) => combination[axis.label] ?? "").join(" · ")
}

/** A preview sits in a box of its own, which is what tells a sample apart from
 *  the page around it.
 *
 *  A framed preview does not: the frame already draws a border, and a second
 *  one around it outlines the room the frame is not using rather than the
 *  sample. The block pages have never drawn one, and the leftover space beside
 *  a narrow frame goes unpainted there for the same reason. */
function Preview({
  label,
  bare,
  children,
}: {
  label: string
  bare?: true
  children: ReactNode
}) {
  return (
    <li>
      {bare ? (
        children
      ) : (
        <div
          data-preview
          className="flex min-h-24 items-center justify-center rounded-lg border border-border bg-background p-6 font-sans"
        >
          {children}
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
    </li>
  )
}

function Section({
  title,
  action,
  wide,
  children,
}: {
  title: string | null
  action?: ReactNode
  wide?: boolean
  children: ReactNode
}) {
  return (
    <section>
      {title && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase">
            {title}
          </h2>
          {action}
        </div>
      )}
      <ul
        className={
          wide
            ? "flex flex-col gap-5"
            : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }
      >
        {children}
      </ul>
    </section>
  )
}

/** The column of sections, under the width tabs where the entry asks for them.
 *  The provider draws the tabs itself and hands the width down, so a page that
 *  wants them adds nothing else.
 *
 *  The tabs stand in the block pages' rhythm: 40 above, which is the strip's
 *  own margin, and 24 below. Both are laid out here as flex gaps rather than
 *  left to the strip's margin, because the strip is inline and an inline box
 *  leaves leading under itself, which put the first heading 3px under the tabs
 *  instead of the 24 the block pages give the frame. Flex items are blockified,
 *  so the gap is the whole of the distance. */
function Framed({
  viewport,
  children,
}: {
  viewport?: true
  children: ReactNode
}) {
  const column = <div className="flex w-full flex-col gap-14">{children}</div>

  return viewport ? (
    <div className="flex flex-col items-start gap-6">
      <ViewportProvider>{column}</ViewportProvider>
    </div>
  ) : (
    column
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
  const suggestion = bestMatch(query, entry.slug)
  const subject = subjectOf(entry)
  const phrases = new Map(
    copyChoices(entry).map((choice) => [choice.value, choice.phrase]),
  )
  const copyFor = (title: string | null) => {
    const phrase = title === null ? undefined : phrases.get(title)
    return phrase ? <CopyIntent name={subject} choice={phrase} /> : undefined
  }

  return (
    <>
      {/* The gap under the header belongs to whatever comes next. Where the
          width tabs come next they bring the block pages' own 40, which is the
          distance the tabs stand at under a page's opening text. */}
      <header className={entry.viewport ? undefined : "mb-20"}>
        <h1 className="text-4xl font-bold tracking-tight">{entry.name}</h1>
        <p className="mt-3 text-base text-muted-foreground">
          {variantLabel(entry, query)}
        </p>
      </header>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-medium">
            No {entry.name} variants match “{query}”
            {suggestion ? (
              <>
                {" · "}
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
        /** A component the design draws once and places at three widths puts
         *  the widths behind the same tabs the blocks use, rather than listing
         *  them as variants of one another. */
        <Framed viewport={entry.viewport}>
          {groups.map((group, index) => (
            <Section
              key={group.title ?? String(index)}
              title={group.title}
              action={copyFor(group.title)}
              wide={entry.wide}
            >
              {group.rows.map((row) => (
                <Preview
                  key={combinationKey(entry, row)}
                  bare={entry.viewport}
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
        </Framed>
      )}
    </>
  )
}
