"use client"

import { LoaderCircle, Play, RotateCcw } from "lucide-react"
import Image from "next/image"
import { useCallback, useRef, useState } from "react"

/** One background scene in the gallery: a still of it, and a button.
 *
 *  Nothing is fetched until that button is pressed, and the way to mean that
 *  with a video is to give it no source at all. `preload="none"` is a request
 *  rather than a rule, and a `<video src>` on screen is enough for a browser
 *  to go and fetch a frame to draw. So the element has no `src` until someone
 *  presses play, and the still underneath is a poster drawn by
 *  `scripts/video-posters.mjs`.
 *
 *  It plays once and stops. These are five to twenty four seconds of
 *  watercolour and a gallery of them looping is a gallery nobody can read a
 *  caption in.
 *
 *  The stage holds its light ground in both themes, the way the animated
 *  mockups do. These are painted on white or on beige and they carry that
 *  with them. */
type SceneTileProps = {
  name: string
  shows: string
  /** The file under `/video`, attached on the first press. */
  src: string
  poster: string
  orientation: string
  ground: string
  length: string
  weight: string
  /** The scene's own canvas, which decides the shape of the stage. */
  width: number
  height: number
}

type Phase = "still" | "loading" | "playing" | "ended" | "held"

export function SceneTile({
  name,
  shows,
  src,
  poster,
  orientation,
  ground,
  length,
  weight,
  width,
  height,
}: SceneTileProps) {
  const [phase, setPhase] = useState<Phase>("still")
  const [source, setSource] = useState("")
  const film = useRef<HTMLVideoElement>(null)

  /** Turned down motion is handed the video and not started. A scene has no
   *  end state that stands in for the whole of it, the way an animation
   *  building to an answer does, so the choice to run it stays with the
   *  reader and the element's own controls are what makes it. */
  const press = useCallback(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!source) {
      setSource(src)
      setPhase(still ? "held" : "loading")

      return
    }

    const element = film.current

    if (!element || still) {
      return
    }

    element.currentTime = 0
    void element.play()
    setPhase("playing")
  }, [source, src])

  const busy = phase === "loading"
  const done = phase === "ended"
  const held = phase === "held"
  const started = phase !== "still"

  return (
    <li className="flex flex-col gap-3">
      {/* Two shapes rather than one. A tile runs the full width of the
          column here, so a wide scene in a square stage would be a strip of
          watercolour between two bands of nothing, and a tall one in a wide
          stage would be a stamp. Each takes the shape closer to its own. */}
      <div
        className={`relative overflow-hidden rounded-xl border border-border bg-white ${
          height > width ? "aspect-square" : "aspect-video"
        }`}
      >
        {/* The poster stays mounted under the stage rather than being swapped
            out, so nothing blanks while the file is on its way. */}
        <Image
          src={poster}
          alt=""
          fill
          sizes="(min-width: 810px) 768px, 100vw"
          unoptimized
          className={`object-contain ${started && !held ? "invisible" : ""}`}
        />

        {source ? (
          <video
            ref={film}
            src={source}
            poster={poster}
            preload="none"
            playsInline
            /* None of the four carries an audio track, and a muted element is
               the only kind a browser will start without being asked twice. */
            muted
            controls={held}
            autoPlay={!held}
            onPlaying={() => {
              setPhase("playing")
            }}
            onEnded={() => {
              setPhase("ended")
            }}
            className="absolute inset-0 size-full object-contain"
          />
        ) : null}

        {/* Hidden once the reader has the video's own controls: two play
            buttons on one tile is one too many. */}
        {held ? null : (
          <button
            type="button"
            onClick={press}
            disabled={busy}
            aria-label={done ? `Play ${name} again` : `Play ${name}`}
            className="absolute top-2 right-2 grid size-9 place-items-center rounded-full border border-border bg-background/90 text-foreground shadow-xs transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
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
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">{name}</h3>
          <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {length} · {weight}
          </p>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{shows}</p>
        <p className="text-xs text-muted-foreground">
          {orientation} · ground {ground}
        </p>
      </div>
    </li>
  )
}
