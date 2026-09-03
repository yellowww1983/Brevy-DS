import { cn } from "../lib/utils.js"

/** The strip a page can open with: one sentence on the brand's deepest green.
 *
 *  It is not sticky and not fixed, which is the whole of its behaviour. It
 *  stands first in the document at its own 48, everything after it starts 48
 *  lower, and it scrolls away with the page and does not come back. Measured
 *  on the shipped page: at 48px of scroll it is gone and the navbar has
 *  reached the top.
 *
 *  So it is a server component. There is no state, no scroll listener, no
 *  close and nothing remembered between visits, and the shipped page carries
 *  none of those either: no button inside it and not one key in storage.
 *
 *  It costs the page its own height, so `Navbar` has to be told. A fixed bar
 *  cannot see what stands above it in the document; `banner` on the navbar is
 *  how it finds out.
 *
 *  The two marks at the ends are decoration. They are the same mark the
 *  system already ships, painted through its mask so a gradient can fill it,
 *  and the strip clips them: one hangs off the left at -59, the other off the
 *  right at 38 in from the edge, both 96 square and mostly outside. Those are
 *  the drawn positions to the pixel. */
function Banner({
  prefix,
  label,
  platforms,
  className,
}: {
  /** The words before the announcement, dropped on a narrow page: the drawing
   *  says `For Brevy Caregivers:` and the shipped page hides it under 640
   *  rather than letting the line wrap. */
  prefix?: string
  /** The announcement itself, which is what a narrow page keeps. */
  label: string
  /** The names the sentence lifts out of the line, in olive. Two on the
   *  drawn one, and it reads as a list because the sentence puts `and`
   *  between them. */
  platforms: readonly string[]
  className?: string
}) {
  return (
    <div
      data-slot="banner"
      className={cn(
        /* `overflow-hidden` is what makes the marks decoration rather than
           two shapes stuck to the page: they are drawn larger than the strip
           and it keeps only the corner of each. */
        "relative h-12 overflow-hidden bg-emerald-500",
        className,
      )}
    >
      <span
        aria-hidden
        data-slot="banner-mark"
        className="pointer-events-none absolute top-2 -left-(--banner-mark-left) size-24 bg-linear-to-br from-brand-500 to-brand-400 mask-brevy-lockup-mark"
      />
      <span
        aria-hidden
        data-slot="banner-mark"
        className="pointer-events-none absolute -top-14 -right-(--banner-mark-right) size-24 bg-linear-to-br from-brand-500 to-brand-400 mask-brevy-lockup-mark"
      />

      {/* Above the marks, which is the only thing the stacking order here has
          to settle. */}
      <p
        data-slot="banner-text"
        className="relative z-10 px-4 py-3 text-center text-body text-white"
      >
        {prefix ? (
          <span data-slot="banner-prefix" className="hidden sm:inline">
            {prefix}{" "}
          </span>
        ) : null}

        {label}

        {platforms.map((platform, index) => (
          <span key={platform}>
            {index === 0 ? " " : " and "}
            <span data-slot="banner-platform" className="text-olive-500">
              {platform}
            </span>
          </span>
        ))}
      </p>
    </div>
  )
}

export { Banner }
