/** Stand-ins for the marks the band carries.
 *
 *  The file and the live page both show four real partners. Those are other
 *  organisations' trademarks, and a design system's catalog is the wrong place
 *  to keep them — the block takes its marks as nodes precisely so it never
 *  ships one. These four are drawn to the sizes the live page measures, so the
 *  band's rhythm is the drawn rhythm.
 *
 *  Catalog furniture. A client brings their own. */
const MARKS = [
  { name: "Meridian", w: "size-16", shape: "rounded-full" },
  { name: "Northbay Health", w: "h-9 w-27.5", shape: "rounded-md" },
  { name: "Cedar Clinic", w: "h-8 w-26.25", shape: "rounded-md" },
  { name: "Alto Partners", w: "h-7 w-33", shape: "rounded-md" },
] as const

export function PartnerMark({ index }: { index: number }) {
  const mark = MARKS[index % MARKS.length]

  if (!mark) {
    return null
  }

  return (
    <span
      className={`flex items-center justify-center bg-emerald-500 text-caption font-semibold text-white ${mark.w} ${mark.shape}`}
    >
      {mark.name.slice(0, 2).toUpperCase()}
    </span>
  )
}

export const MARK_COUNT = MARKS.length
