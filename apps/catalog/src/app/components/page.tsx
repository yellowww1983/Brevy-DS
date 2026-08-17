import Link from "next/link"

import { components, variantCount } from "@/registry"

export default function ComponentsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Components</h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Primitives of the Brevy design system. Every variant and state is
          taken from the Brevy app Figma library.
        </p>
      </header>

      <ul className="grid gap-5 sm:grid-cols-2">
        {components.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/components/${entry.slug}`}
              className="block rounded-xl border border-border bg-card p-6 hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="block text-lg font-semibold">{entry.name}</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {entry.axes.length > 0
                  ? `${String(variantCount(entry))} variants · ${entry.axes.map((axis) => axis.label).join(" · ")}`
                  : "No variants"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
