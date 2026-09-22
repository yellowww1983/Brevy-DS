/** A stand-in for the phone the live page puts on the tinted ground.
 *
 *  The real artwork is a photograph of a hand holding a device with a screen
 *  composited into it, one per feature, and none of it ships with this
 *  system. Rather than invent a path to a file that does not exist, the
 *  catalog draws the shape the picture occupies: the proportion is the drawn
 *  one, 511 by 731, so the panel around it is the size it will be.
 *
 *  Every surface is a token, so the mock is the same object in either theme
 *  instead of a light picture that has to be hidden on a dark page. The body
 *  takes `--card` and the rows `--muted`, which is the step between them that
 *  reads as content on a surface in both.
 *
 *  The rows count off the index so the five are visibly different things as
 *  they cross-fade. Catalog furniture. A client brings their own. */
export function PhoneMock({ index }: { index: number }) {
  const rows = 3 + (index % 3)

  return (
    <div
      data-slot="phone-mock"
      className="flex h-full max-h-full w-auto flex-col items-center"
    >
      <div className="flex aspect-[511/731] h-full flex-col gap-3 rounded-4xl border border-border bg-card p-4 shadow-lg">
        <div className="flex justify-center">
          <span className="h-1.5 w-16 rounded-full bg-foreground/80" />
        </div>

        <div className="h-20 rounded-2xl bg-muted" />

        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="size-8 shrink-0 rounded-full bg-muted" />
            <span className="h-3 flex-1 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
