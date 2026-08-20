"use client"

import { useEffect, useRef, useState } from "react"

const FEEDBACK_MS = 2000

/** Puts a name on the clipboard and says so for a moment. Shared by every page
 *  that hands out something to paste, a colour's name or a spacing class, so
 *  the two cannot disagree about how long "Copied" stays up. */
export function useCopy() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      window.clearTimeout(timer.current)
    },
    [],
  )

  return {
    copied,
    copy: (text: string) => {
      void navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => {
          setCopied(false)
        }, FEEDBACK_MS)
      })
    },
  }
}
