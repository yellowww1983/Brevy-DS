"use client"

import { BrevyLockup } from "@brevy/ui"
import { LoaderCircle, Play, RotateCcw } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { colourOf, repaint } from "./lottie"

/** The logo's one animation, on a press.
 *
 *  On a press rather than on arrival: the catalog already opens with this once
 *  a session, and a page about the logo that ran it again every time anybody
 *  scrolled past would be unreadable. The still underneath is the lockup
 *  itself rather than a poster, because the lockup is exactly where the
 *  animation ends and a component costs nothing to draw.
 *
 *  The colour is baked into the export at brand-500, so it is rewritten before
 *  the player starts, the way the preloader does it. Without that the one
 *  animation of the identity would be the one place on a dark page still
 *  painting the light theme's green. */
type Phase = "still" | "loading" | "playing" | "ended"

export function LogoMotion() {
  const [phase, setPhase] = useState<Phase>("still")
  const stage = useRef<HTMLDivElement>(null)
  const player = useRef<{
    destroy: () => void
    goToAndStop: (frame: number, isFrame: boolean) => void
    playSegments: (segment: [number, number], force: boolean) => void
  } | null>(null)

  useEffect(() => {
    return () => {
      player.current?.destroy()
      player.current = null
    }
  }, [])

  /** The preloader stops at 143 because that is where the last letter lands;
   *  everything after it is a hold nobody should sit through. */
  const run = useCallback((animation: NonNullable<typeof player.current>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animation.goToAndStop(143, true)
      setPhase("ended")

      return
    }

    animation.playSegments([0, 143], true)
    setPhase("playing")
  }, [])

  const press = useCallback(() => {
    const loaded = player.current

    if (loaded) {
      run(loaded)

      return
    }

    setPhase("loading")

    void (async () => {
      try {
        const [{ default: lottie }, response] = await Promise.all([
          import("lottie-web"),
          fetch("/lottie/brevy-logo.json"),
        ])
        const container = stage.current
        const data: unknown = await response.json()

        if (!container) {
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

        animation.addEventListener("complete", () => {
          setPhase("ended")
        })

        player.current = animation
        run(animation)
      } catch {
        setPhase("still")
      }
    })()
  }, [run])

  const busy = phase === "loading"
  const started = phase !== "still"

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-background text-brand-500 dark:text-primary">
      <div
        className={`absolute inset-0 grid place-items-center ${started ? "invisible" : ""}`}
      >
        <BrevyLockup className="h-10 w-auto" />
      </div>

      <div ref={stage} data-logo-stage className="absolute inset-0 size-full" />

      <button
        type="button"
        onClick={press}
        disabled={busy}
        aria-label={phase === "ended" ? "Play the logo again" : "Play the logo"}
        className="absolute top-2 right-2 grid size-9 place-items-center rounded-full border border-border bg-background/90 text-foreground shadow-xs transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        {busy ? (
          <LoaderCircle
            className="size-4 animate-spin icon-stroke motion-reduce:animate-none"
            aria-hidden
          />
        ) : phase === "ended" ? (
          <RotateCcw className="size-4 icon-stroke" aria-hidden />
        ) : (
          <Play className="size-4 icon-stroke" aria-hidden />
        )}
      </button>
    </div>
  )
}
