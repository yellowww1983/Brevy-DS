import { Container } from "@brevy/ui"

/** Rendered inside a frame on the layout page. It lives outside the catalog
 *  shell because the gutter changes with the width of the document, and a frame
 *  is the only way to give it a width other than the reader's own window.
 *
 *  The band is the full width and the column is inside it, which is the shape
 *  every block takes.
 *
 *  Every vertical size here is a share of the frame's own height rather than a
 *  number of pixels. The frame is scaled to fit the column beside it, and a
 *  scale shrinks both axes, so a height in pixels would arrive on screen
 *  multiplied by however much this width had to shrink. Only the width carries
 *  anything worth reading, so the height is left to follow the frame.
 *
 *  The column is drawn nowhere in here. A hairline, a dash and a corner radius
 *  are all sizes in pixels, and all three would be shrunk by that same scale, so
 *  the column is outlined from outside the frame instead, at the size the
 *  measurement says it is. What is left in here is the thing being measured. */
export default function ContainerSpecimenPage() {
  return (
    <div data-bleed className="flex h-dvh items-center bg-olive-500/40">
      <Container data-container className="h-3/5" />
    </div>
  )
}
