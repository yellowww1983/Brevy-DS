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
