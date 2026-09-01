"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"

import { useCopy } from "./use-copy"

/** Hands over the whole system at once.
 *
 *  It fetches `/llms-full.txt` rather than assembling anything, which is what
 *  keeps this a button. The documentation is 79KB and the alternative is
 *  importing it into a client component, which would send all of it to every
 *  visitor whether or not anybody presses this.
 *
 *  It also means there is one aggregate rather than two: what lands on the
 *  clipboard is the file, byte for byte, so the two cannot come apart.
 *
 *  It lives in the top bar because it is about the catalog rather than about
 *  the page — the page's own Copy for Claude sits with the page, and these
 *  two answer different questions. */
export function CopySystem() {
  const { copied, copy } = useCopy()
  const [failed, setFailed] = useState(false)

  return (
    <button
      type="button"
      aria-label="Copy the whole system for Claude"
      onClick={() => {
        setFailed(false)
        void fetch("/llms-full.txt")
          .then((response) => response.text())
          .then(copy)
          .catch(() => {
            setFailed(true)
          })
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
      <span aria-live="polite">
        {failed ? "Try again" : copied ? "Copied" : "Copy entire system"}
      </span>
    </button>
  )
}
