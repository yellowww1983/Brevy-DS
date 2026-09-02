import type { ComponentProps, ReactNode } from "react"

import { cn } from "../lib/utils.js"

/** A band of partner marks, moving.
 *
 *  The file draws it still (`22616:8666`): a 96 band on olive, six slots of
 *  231 holding a logo each with a second copy switched off beside it, and a
 *  row 1408 wide sitting in a section that is 810 at the tablet and 390 at the
 *  mobile with nothing clipping it. A row wider than its section and a spare
 *  copy of every mark is what a marquee looks like when it is drawn standing
 *  still, so the live page is what settles it — the same way the navbar and
 *  the segment index were settled.
 *
 *  Measured at brevy.com: the band runs 122 and 90 at the phone, the marks
 *  are four rather than six and doubled rather than paired, they are laid over
 *  in `grayscale(1)` where the file has them in full colour, and the track
 *  carries `animate-marquee` with the animation paused under the cursor.
 *
 *  So this doubles what it is given and slides one full copy's width, which is
 *  the seam nobody sees. The marks arrive as children because they are other
 *  organisations' and belong to the page rather than to the system — and
 *  because they arrive from outside, the band cannot know how wide they make
 *  a copy. Both of the things that keep the loop closed follow from that: the
 *  track refuses to shrink, and a copy is never narrower than the band.
 *
 *  It pads nothing. Every other section in this file breathes 96 above and
 *  below; this is a band rather than a section and the file gives it none,
 *  which is the one place the convention does not hold.
 *
 *  Motion stops for anyone who asked it to. The band still reads: it is a row
 *  of marks either way, and only the sliding goes.
 *
 *  The ends fade rather than cut. The live page masks the strip that clips
 *  the marks with a gradient 48 wide at each end, so a mark arrives and
 *  leaves instead of appearing at an edge.
 *
 *  Dark inverts. The marks are laid over in grey and a grey mark on a dark
 *  band is a hole, so the same filter that flattens them in the light flips
 *  them in the dark — and the band itself darkens, because olive is a tint.
 *  The fade needs nothing of its own for that: alpha fades whatever the marks
 *  have already been filtered into.
 *
 *  Nothing here dims the marks, and the live page does not either — its
 *  filter is `grayscale(1)` and its opacity is 1. They read muted because a
 *  brand mark flattened is a middle grey rather than black, which is a fact
 *  about the artwork and not about the band. Measured on the live band, its
 *  four marks are painted 113, 80, 126 and 114 out of 255, and no two agree.
 *  A dimming here would take a client's own mark a shade lighter than the
 *  page it is copied from. */
function LogoCloud({
  logos,
  label,
  className,
  ...props
}: Omit<ComponentProps<"section">, "children"> & {
  logos: readonly ReactNode[]
  /** What the band is, for anyone who cannot see it. The file writes nothing
   *  above the marks, so the section would otherwise announce a list of
   *  pictures with no reason for being there. */
  label: string
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        "group flex h-(--logo-cloud-narrow) items-center bg-olive-500 tablet:h-(--logo-cloud) dark:bg-background",
        className,
      )}
      {...props}
      data-slot="logo-cloud"
    >
      {/* What clips the marks, and what fades them out at both ends.

          Both belong here and not on the band. The band carries the olive,
          and a mask is alpha over everything beneath it — hung one level up
          it would fade the ground along with the marks and leave the page
          showing through at each end. The live page hangs it the same way. */}
      <div
        data-slot="logo-cloud-clip"
        className="flex w-full overflow-hidden logo-cloud-fade"
      >
        {/* Two copies of the same row, and the track slides exactly one of
            them and starts over, so the marks come round without a gap and
            without a jump.

            It has to refuse to shrink. The track is a flex item, and a flex
            item shrinks to its container by default — so a row of marks wider
            than half the band left the track exactly as wide as the band, and
            the 50% it slides stopped being a copy. It held only while the
            marks happened to be small. */}
        <div
          data-slot="logo-cloud-track"
          className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              data-slot="logo-cloud-row"
              aria-hidden={copy === 1 ? true : undefined}
              /** A copy is never narrower than the band. Four marks are not
               *  necessarily 1440 of marks, and a copy that falls short
               *  leaves the far end of the band empty for part of every lap —
               *  the band's own width is the floor, and past it the marks
               *  take the slack evenly rather than bunching at one end.
               *
               *  The ends carry half a gap each, so the seam between two
               *  copies measures the same as every other space in the band. */
              className="flex min-w-(--logo-cloud-copy) shrink-0 items-center justify-around gap-(--logo-cloud-gap) px-(--logo-cloud-edge)"
            >
              {logos.map((logo, index) => (
                <li
                  key={index}
                  data-slot="logo-cloud-logo"
                  /** Flattened to grey the way the live page flattens them,
                   *  and flipped in the dark so a grey mark is not a hole in
                   *  the band. Nothing dims them beyond that, because nothing
                   *  on the live page does. */
                  className="flex shrink-0 items-center grayscale dark:invert"
                >
                  {logo}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}

export { LogoCloud }
