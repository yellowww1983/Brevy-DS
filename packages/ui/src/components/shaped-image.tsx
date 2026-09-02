import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** A photograph cut to the Brevy mark.
 *
 *  The file masks it with a boolean union of two mirrored vectors. That shape
 *  is the brand mark but it is not the lockup's path: the file draws the two
 *  separately and parts this one's quadrants by half as much, which is the
 *  difference between a mark and a window cut in a photograph. The token
 *  carries the drawn geometry; see `--mask-brevy-mark`.
 *
 *  Fifteen nodes in the file, which collapse to two drawings and an Open Graph
 *  image: the split hero on the Caregiving page and the media section on all
 *  four home pages. It was written inside the hero first; the second block
 *  asking for it is what makes it a component.
 *
 *  It carries its own proportion and takes only a width. Every mask in the
 *  file measures 0.983 across — 592 by 602, 762 by 775, 358 by 364 — so the
 *  ratio belongs to the shape rather than to whoever places it.
 *
 *  The mask is not a prop and is not meant to become one. A client swaps the
 *  photograph inside it; the shape is the identity, and a section wearing
 *  somebody else's silhouette is not this section. What the caller does decide
 *  is the crop: the file hand-places the picture behind the cut, so the image
 *  inside is positioned per use the way the testimonial photographs are. */
function ShapedImage({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "aspect-(--aspect-brevy-mark) overflow-hidden mask-brevy-mark",
        className,
      )}
      {...props}
      data-slot="shaped-image"
    >
      {children}
    </div>
  )
}

export { ShapedImage }
