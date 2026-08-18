import { ComponentGrid } from "@/components/component-grid"

export default function ComponentsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Components</h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Primitives of the Brevy design system. Every variant and state is
          taken from the Brevy app Figma library.
        </p>
      </header>

      <ComponentGrid />
    </div>
  )
}
