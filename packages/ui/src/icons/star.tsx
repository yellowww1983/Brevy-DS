import type { ComponentProps } from "react"

/** The rating star, drawn by the file rather than borrowed from an icon set,
 *  for the same reason the brand marks are: it is the file's own shape, with
 *  rounded points and a 16 by 15 box that no icon set ships.
 *
 *  It is the shape and nothing else: filled with `currentColor`, carrying no
 *  colour, no weight and no halo of its own. The file draws each star with a
 *  rim, but a rim is only ever right in relation to what the star stands on,
 *  so it belongs to whatever arranges the stars rather than to the star —
 *  the same division the avatar and its group already make.
 *
 *  Geometry is the file's outline at two decimals, which is finer than a 16px
 *  box can render and short enough to read. */
function Star(props: ComponentProps<"svg">) {
  return (
    <svg
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M 7.62 0.23 C 7.66 0.16 7.71 0.1 7.78 0.06 C 7.84 0.02 7.92 0 8 0 C 8.08 0 8.16 0.02 8.22 0.06 C 8.29 0.1 8.35 0.16 8.38 0.23 L 10.23 3.91 C 10.35 4.15 10.53 4.36 10.75 4.52 C 10.97 4.68 11.23 4.79 11.5 4.82 L 15.64 5.42 C 15.72 5.43 15.79 5.46 15.85 5.51 C 15.91 5.56 15.95 5.63 15.98 5.7 C 16 5.78 16.01 5.86 15.99 5.93 C 15.97 6.01 15.93 6.08 15.87 6.13 L 12.88 8.99 C 12.69 9.18 12.54 9.41 12.45 9.67 C 12.37 9.93 12.35 10.2 12.39 10.47 L 13.1 14.51 C 13.11 14.59 13.11 14.67 13.08 14.74 C 13.05 14.81 13 14.87 12.93 14.92 C 12.87 14.97 12.79 14.99 12.71 15 C 12.63 15 12.55 14.99 12.48 14.95 L 8.79 13.04 C 8.55 12.92 8.28 12.85 8 12.85 C 7.73 12.85 7.45 12.92 7.21 13.04 L 3.52 14.95 C 3.45 14.99 3.37 15 3.29 15 C 3.21 14.99 3.13 14.97 3.07 14.92 C 3.01 14.87 2.96 14.81 2.93 14.74 C 2.9 14.67 2.89 14.59 2.9 14.51 L 3.61 10.47 C 3.65 10.2 3.63 9.93 3.55 9.67 C 3.46 9.41 3.32 9.18 3.12 8.99 L 0.13 6.13 C 0.07 6.08 0.03 6.01 0.01 5.93 C -0.01 5.86 0 5.78 0.02 5.7 C 0.05 5.63 0.09 5.56 0.15 5.51 C 0.21 5.46 0.29 5.43 0.36 5.42 L 4.5 4.82 C 4.77 4.79 5.03 4.68 5.25 4.52 C 5.47 4.36 5.65 4.15 5.77 3.91 L 7.62 0.23 Z" />
    </svg>
  )
}

export { Star }
