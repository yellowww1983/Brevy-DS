import type { ComponentProps } from "react"

/** Facebook, drawn by the file rather than borrowed from an icon set.
 *
 *  lucide dropped every brand glyph in v1, so the four marks in the footer
 *  have nowhere else to come from: they are exported from the design file and
 *  live here as components, because the package builds file by file with no
 *  bundler in front of it and an .svg would arrive as a string nobody renders.
 *
 *  A brand mark is not composed on the system's icon grid, so it keeps the
 *  weight the file draws — 1 on a 16 box, where `icon-stroke` would put 1.5 —
 *  and says so with `data-brand`, which is what the Button's icon rule looks
 *  for before leaving it alone. The one thing not taken from the drawing is
 *  the colour: the file paints #3f3f46 and `currentColor` lets whatever wears
 *  the mark paint the same. */
function Facebook(props: ComponentProps<"svg">) {
  return (
    <svg
      data-brand="facebook"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M11.9974 1.33203H9.9974C9.11334 1.33203 8.26549 1.68322 7.64037 2.30834C7.01525 2.93346 6.66406 3.78131 6.66406 4.66536V6.66536H4.66406V9.33203H6.66406V14.6654H9.33073V9.33203H11.3307L11.9974 6.66536H9.33073V4.66536C9.33073 4.48855 9.40097 4.31898 9.52599 4.19396C9.65102 4.06894 9.82058 3.9987 9.9974 3.9987H11.9974V1.33203Z" />
    </svg>
  )
}

export { Facebook }
