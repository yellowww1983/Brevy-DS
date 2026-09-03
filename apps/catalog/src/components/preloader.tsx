"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { BrevyLogo } from "./brevy-logo"
import { colourOf, repaint } from "./lottie"

/** Frame 143 is where the wordmark finishes settling; 143–180 is a hold that
 *  nobody should wait through. Doubling the speed puts the whole thing at
 *  roughly 2.4s, and the ceiling keeps a slow player from trapping anyone. */
const LAST_FRAME = 143
const SPEED = 2
const CEILING_MS = 2500
const REDUCED_MS = 300
const FADE_MS = 300

type Phase = "static" | "animating" | "leaving" | "gone"

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("static")
  const stage = useRef<HTMLDivElement>(null)

  const dismiss = useCallback(() => {
    setPhase("leaving")
  }, [])

  useEffect(() => {
    if (document.documentElement.dataset.preloader === "skip") {
      return
    }

    sessionStorage.setItem("preloader", "seen")

    const controller = new AbortController()
    const { signal } = controller

    const ceiling = window.setTimeout(dismiss, CEILING_MS)
    window.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          dismiss()
        }
      },
      { signal },
    )

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const settle = reduced ? window.setTimeout(dismiss, REDUCED_MS) : undefined

    let player: { destroy: () => void } | undefined

    if (!reduced) {
      void (async () => {
        try {
          const [{ default: lottie }, response] = await Promise.all([
            import("lottie-web"),
            fetch("/lottie/brevy-logo.json", { signal }),
          ])
          const data: unknown = await response.json()
          const container = stage.current

          if (signal.aborted || !container) {
            return
          }

          repaint(data, colourOf(container))

          const animation = lottie.loadAnimation({
            container,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData: data,
          })
          animation.setSpeed(SPEED)
          animation.addEventListener("complete", dismiss)
          animation.playSegments([0, LAST_FRAME], true)

          player = animation
          setPhase("animating")
        } catch {
          // The ceiling takes the overlay down either way.
        }
      })()
    }

    return () => {
      controller.abort()
      player?.destroy()
      window.clearTimeout(ceiling)
      window.clearTimeout(settle)
    }
  }, [dismiss])

  /** A timer, not transitionend: reduced motion can kill the transition, and an
   *  overlay that never unmounts sits over the page swallowing every click. */
  useEffect(() => {
    if (phase !== "leaving") {
      return
    }

    const timer = window.setTimeout(() => {
      setPhase("gone")
    }, FADE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [phase])

  if (phase === "gone") {
    return null
  }

  return (
    <div
      data-preloader-overlay
      aria-hidden
      onClick={dismiss}
      className={`fixed inset-0 z-50 grid place-items-center bg-background transition-opacity duration-300 motion-reduce:transition-none ${
        phase === "leaving" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        ref={stage}
        data-preloader-stage
        className="aspect-video w-full max-w-3xl scale-60 text-brand-500 dark:text-primary"
      />
      {phase === "static" && (
        <div className="absolute">
          <BrevyLogo />
        </div>
      )}
    </div>
  )
}
