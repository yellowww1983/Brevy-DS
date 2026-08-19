import type { ReactNode } from "react"

import { TableOfContents, type Section } from "./table-of-contents"

/** Same container as every other catalog page, so the left edge of the text
 *  never moves between a component page and a written one. The contents column
 *  is pushed to the container's right edge for the same reason. */
export function ContentPage({
  sections,
  children,
}: {
  sections: readonly Section[]
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex gap-10">
        <article className="max-w-3xl min-w-0 flex-1">{children}</article>
        <TableOfContents sections={sections} />
      </div>
    </div>
  )
}

/** Shared by every written page so two of them cannot drift apart. */
export const HEADING = "mt-14 scroll-mt-8 text-2xl font-semibold tracking-tight"

export const LINK =
  "rounded-sm font-medium text-primary underline underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

/** Real artwork lands later — until then the frame states what belongs in it,
 *  so an empty page never reads as a finished one. */
export function ImageSlot({ children }: { children: string }) {
  return (
    <figure className="my-10 flex min-h-56 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12">
      <figcaption className="max-w-md text-center">
        <span className="mb-2 block text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Image placeholder
        </span>
        <span className="block text-sm text-muted-foreground">{children}</span>
      </figcaption>
    </figure>
  )
}
