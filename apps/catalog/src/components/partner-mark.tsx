import Image from "next/image"

/** Stand-ins for the marks the band carries.
 *
 *  The file and the live page both show four real partners. Those are other
 *  organisations' trademarks, and a design system's catalog is the wrong place
 *  to keep them — the block takes its marks as nodes precisely so it never
 *  ships one.
 *
 *  These four come from logoipsum.com, which draws marks for exactly this: a
 *  wordmark and a device that read as a company from across the room and
 *  belong to nobody. They are flattened to black here, which is where the
 *  band's `grayscale(1)` was going to put them anyway, and they carry the
 *  proportions real marks have — between 4.9 and 7.6 to one — so the band's
 *  rhythm is a real rhythm rather than four boxes of the same size.
 *
 *  Catalog furniture. A client brings their own. */
const MARKS = [
  { file: "logoipsum-1", width: 303, height: 40 },
  { file: "logoipsum-2", width: 268, height: 40 },
  { file: "logoipsum-3", width: 240, height: 49 },
  { file: "logoipsum-4", width: 257, height: 45 },
] as const

/** 36 tall, which is where the drawn marks sit: the file gives its four 64,
 *  36, 32 and 28, and everything but the round one is a wordmark of about
 *  this height. Width follows the mark's own proportion rather than a box. */
const HEIGHT = 36

export function PartnerMark({ index }: { index: number }) {
  const mark = MARKS[index % MARKS.length]

  if (!mark) {
    return null
  }

  return (
    <Image
      src={`/logos/${mark.file}.svg`}
      alt="Logoipsum"
      width={mark.width}
      height={mark.height}
      unoptimized
      /** Eager, because the band's second copy is off the side of the screen
       *  until the marquee brings it round — left to load lazily, a mark
       *  arrives blank and fills in while it is already sliding past. */
      loading="eager"
      style={{ height: HEIGHT, width: (mark.width / mark.height) * HEIGHT }}
    />
  )
}

export const MARK_COUNT = MARKS.length
