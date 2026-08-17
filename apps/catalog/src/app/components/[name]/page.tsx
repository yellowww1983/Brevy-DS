import { notFound } from "next/navigation"

import type { Axis, ComponentEntry } from "@/registry"
import {
  combinationKey,
  combinations,
  components,
  getComponent,
  variantCount,
} from "@/registry"

const NOTES = ["missing in Figma", "identical to Default"] as const

export function generateStaticParams() {
  return components.map((entry) => ({ name: entry.slug }))
}

function caption(axes: readonly Axis[], combination: Record<string, string>) {
  return axes.map((axis) => combination[axis.label] ?? "").join(" · ")
}

function groupsOf(entry: ComponentEntry) {
  const [first, ...rest] = entry.axes

  if (!first) {
    return [{ title: null, axes: [] as readonly Axis[], rows: [{}] }]
  }

  return first.values.map((value) => ({
    title: `${first.label} · ${value}`,
    axes: rest,
    rows: combinations(rest)
      .map((row) => ({ [first.label]: value, ...row }))
      .filter(
        (row) =>
          !entry.omitted.some((o) => o.key === combinationKey(entry, row)),
      ),
  }))
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const entry = getComponent(name)

  if (!entry) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tight">{entry.name}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {entry.figmaNodeId
            ? `Figma component set ${entry.figmaNodeId} · ${String(variantCount(entry))} variants`
            : "No Figma component set · shadcn primitive tuned to Brevy tokens"}
        </p>

        {NOTES.map((note) => {
          const keys = entry.omitted
            .filter((o) => o.note === note)
            .map((o) => o.key)
          if (keys.length === 0) return null

          return (
            <p key={note} className="mt-3 text-xs text-muted-foreground">
              {note === "missing in Figma"
                ? "Not present in Figma: "
                : "Identical to Default in Figma, not repeated: "}
              {keys.join(", ")}
            </p>
          )
        })}
      </header>

      <div className="flex flex-col gap-14">
        {groupsOf(entry).map((group, index) => (
          <section key={group.title ?? String(index)}>
            {group.title && (
              <h2 className="mb-5 text-sm font-semibold tracking-wide uppercase">
                {group.title}
              </h2>
            )}

            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.rows.map((row) => (
                <li key={combinationKey(entry, row)}>
                  <div className="flex min-h-24 items-center justify-center rounded-lg border border-border bg-background p-6">
                    {entry.render(row)}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {group.axes.length > 0
                      ? caption(group.axes, row)
                      : (group.title ?? entry.name)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
