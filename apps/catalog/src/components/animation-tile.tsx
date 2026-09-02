"use client"

import type { AnimationItem } from "lottie-web"
import { LoaderCircle, Play, RotateCcw } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

/** One animation in the gallery: a still of it, and a button.
 *
 *  Nothing is fetched until that button is pressed. The still is a poster
 *  drawn by `scripts/lottie-posters.mjs`, so a tile costs an image rather than
 *  an animation, and sixteen tiles cost sixteen images rather than the whole
 *  library. The file and the player arrive together on the first press and
 *  stay for any press after it.
 *
 *  The poster is the last frame, not the first. These build from an empty
 *  frame, so a first-frame still is a blank card and a gallery of them says
 *  nothing. Pressing play still starts at zero: the tile goes back to the
 *  beginning and runs forward, which is the animation and not a loop of its
 *  ending.
 *
 *  The stage holds its light ground in both themes. These are drawn on white
 *  with olive and beige under them and they carry that with them; a brand
 *  surface does not turn, the way the illustration panel and the marker do
 *  not. */
type AnimationTileProps = {
  name: string
  shows: string
  /** The file under `/lottie`, fetched on the first press. */
  src: string
  poster: string
  length: string
  weight: string
}

type Phase = "still" | "loading" | "playing" | "ended" | "failed"

export function AnimationTile({
  name,
  shows,
  src,
  poster,
  length,
  weight,
}: AnimationTileProps) {
  const [phase, setPhase] = useState<Phase>("still")
  const stage = useRef<HTMLDivElement>(null)
  const player = useRef<AnimationItem>(null)

  useEffect(() => {
    return () => {
      player.current?.destroy()
      player.current = null
    }
  }, [])

  /** Turned down motion gets the end of it rather than the run up to it. What
   *  these build towards is the answer, so holding the last frame keeps what
   *  the animation had to say and drops only the saying of it. */
  const run = useCallback((animation: AnimationItem) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animation.goToAndStop(animation.totalFrames - 1, true)
      setPhase("ended")

      return
    }

    animation.goToAndStop(0, true)
    animation.play()
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
          fetch(src),
        ])
        const container = stage.current
        const data: unknown = await response.json()

        if (!container) {
          return
        }

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
        setPhase("failed")
      }
    })()
  }, [run, src])

  const busy = phase === "loading"
  const done = phase === "ended"
  const started = phase !== "still" && phase !== "failed"

  return (
    <li className="flex flex-col gap-3">
      {/* One shape for all sixteen, not each animation's own. The canvases run
          from 2.08 wide to square, and a grid of tiles cut to them staggers
          every caption in the row. Both the poster and the player letterbox
          inside this, so nothing is cropped to get it. */}
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-white">
        {/* The poster stays mounted under the stage rather than being swapped
            out, so nothing blanks while the file is on its way. */}
        <Image
          src={poster}
          alt=""
          fill
          sizes="(min-width: 1200px) 380px, (min-width: 810px) 50vw, 100vw"
          unoptimized
          className={`object-contain ${started ? "invisible" : ""}`}
        />

        <div ref={stage} className="absolute inset-0 size-full" />

        {/* In the corner rather than over the middle. These are mockups of the
            product and the middle is where the product is: a disc centred on
            one covers the figure, the checklist or the bubble that the tile
            exists to show. */}
        <button
          type="button"
          onClick={press}
          disabled={busy}
          aria-label={done ? `Play ${name} again` : `Play ${name}`}
          className="absolute top-2 right-2 grid size-9 place-items-center rounded-full border border-border bg-background/90 text-foreground shadow-xs transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {/* Replay only once it has run to the end. Until then it is play,
              including while it is playing: nothing has been replayed yet. */}
          {busy ? (
            <LoaderCircle
              className="size-4 animate-spin icon-stroke motion-reduce:animate-none"
              aria-hidden
            />
          ) : done ? (
            <RotateCcw className="size-4 icon-stroke" aria-hidden />
          ) : (
            <Play className="size-4 icon-stroke" aria-hidden />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">{name}</h3>
          <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {length} · {weight}
          </p>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {phase === "failed" ? "This one would not load. Try again." : shows}
        </p>
      </div>
    </li>
  )
}
