import type { ReactNode } from "react"

import { CopyPage } from "./copy-page"
import { TableOfContents, type Section } from "./table-of-contents"

/** Same container as every other catalog page, so the left edge of the text
 *  never moves between a component page and a written one. The contents column
 *  is pushed to the container's right edge for the same reason. */
export function ContentPage({
  sections,
  markdown,
  children,
}: {
  /** Left off where a page is a demonstration rather than a reference, which
   *  is every page under Blocks. The article then takes the whole column. */
  sections?: readonly Section[]
  /** The page as text. Present once a page can hand itself to Claude. */
  markdown?: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex gap-10">
        <article
          className={
            sections
              ? "relative max-w-3xl min-w-0 flex-1"
              : "relative min-w-0 flex-1"
          }
        >
          {markdown ? (
            <div className="absolute top-0 right-0">
              <CopyPage markdown={markdown} />
            </div>
          ) : null}
          {children}
        </article>
        {sections ? <TableOfContents sections={sections} /> : null}
      </div>
    </div>
  )
}

/** Shared by every written page so two of them cannot drift apart. */
export const HEADING = "mt-14 scroll-mt-8 text-2xl font-semibold tracking-tight"

export const LINK =
  "rounded-sm font-medium text-primary underline underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

/** Real artwork lands later. Until then the frame states what belongs in it,
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
