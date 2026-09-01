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
 *  organisations' and belong to the page rather than to the system.
 *
 *  It pads nothing. Every other section in this file breathes 96 above and
 *  below; this is a band rather than a section and the file gives it none,
 *  which is the one place the convention does not hold.
 *
 *  Motion stops for anyone who asked it to. The band still reads: it is a row
 *  of marks either way, and only the sliding goes.
 *
 *  Dark inverts. The marks are laid over in grey and a grey mark on a dark
 *  band is a hole, so the same filter that flattens them in the light flips
 *  them in the dark — and the band itself darkens, because olive is a tint. */
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
      data-slot="logo-cloud"
      aria-label={label}
      className={cn(
        "group flex h-(--logo-cloud-narrow) items-center overflow-hidden bg-olive-500 tablet:h-(--logo-cloud) dark:bg-background",
        className,
      )}
      {...props}
    >
      {/* Two copies of the same row, each hugging its own width. The track
          slides exactly one copy and starts over, so the marks come round
          without a gap and without a jump. */}
      <div
        data-slot="logo-cloud-track"
        className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none"
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            data-slot="logo-cloud-row"
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center gap-(--logo-cloud-gap) px-(--logo-cloud-gap)"
          >
            {logos.map((logo, index) => (
              <li
                key={index}
                data-slot="logo-cloud-logo"
                /** Flattened to grey the way the live page flattens them, and
                 *  flipped in the dark so a grey mark is not a hole in the
                 *  band. */
                className="flex shrink-0 items-center grayscale dark:invert"
              >
                {logo}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}

export { LogoCloud }
