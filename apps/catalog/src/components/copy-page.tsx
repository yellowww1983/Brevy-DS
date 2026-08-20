"use client"

import { Check, Copy } from "lucide-react"

import { useCopy } from "./use-copy"

/** Catalog chrome, not a system component: this is a tool for reading the
 *  catalog rather than a piece of Brevy, so it wears the chrome's own colours
 *  the way the search field and the theme toggle do. */
export function CopyPage({ markdown }: { markdown: string }) {
  const { copied, copy } = useCopy()

  return (
    <button
      type="button"
      aria-label="Copy this page for Claude"
      onClick={() => {
        copy(markdown)
      }}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-catalog-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      {copied ? (
        <Check
          className="size-3.5 icon-stroke text-sidebar-primary"
          aria-hidden
        />
      ) : (
        <Copy className="size-3.5 icon-stroke" aria-hidden />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy for Claude"}</span>
    </button>
  )
}
