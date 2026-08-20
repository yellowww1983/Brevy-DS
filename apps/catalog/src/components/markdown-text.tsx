import { Fragment } from "react"

import { LINK } from "./content-page"

/** The prose on a foundation page is written once, as markdown, so the page and
 *  the text the copy button hands out cannot drift apart. Two inline forms are
 *  enough for it: code spans and links, which is one split rather than a parser.
 *
 *  Keyed by position because the pieces come from splitting a fixed string and
 *  never reorder, and because two of them can be the same run of text. */
const INLINE = /(`[^`]+`|\[[^\]]+\]\([^)]+\))/

export function MarkdownText({ children }: { children: string }) {
  return (
    <>
      {children.split(INLINE).map((piece, index) => {
        if (piece.startsWith("`")) {
          return (
            <code key={index} className="font-mono text-sm">
              {piece.slice(1, -1)}
            </code>
          )
        }

        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(piece)

        if (link) {
          return (
            <a key={index} href={link[2]} className={LINK}>
              {link[1]}
            </a>
          )
        }

        return <Fragment key={index}>{piece}</Fragment>
      })}
    </>
  )
}
