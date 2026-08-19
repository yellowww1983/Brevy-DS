"use client"

import { Check, Copy } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const FEEDBACK_MS = 2000

/** Deliberately knows nothing about components: it takes a name and a choice,
 *  so a block in phase 2 uses it without the registry shape changing. The
 *  choice is required — a prompt with no choice in it is the vagueness this
 *  button exists to remove. */
export function CopyIntent({ name, choice }: { name: string; choice: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      window.clearTimeout(timer.current)
    },
    [],
  )

  const sentence = `Use the ${name} — ${choice}.`

  return (
    <button
      type="button"
      aria-label={`Copy the prompt: ${sentence}`}
      onClick={() => {
        void navigator.clipboard.writeText(sentence).then(() => {
          setCopied(true)
          window.clearTimeout(timer.current)
          timer.current = window.setTimeout(() => {
            setCopied(false)
          }, FEEDBACK_MS)
        })
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-xs hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      {copied ? (
        <Check className="size-3.5 text-sidebar-primary" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  )
}
