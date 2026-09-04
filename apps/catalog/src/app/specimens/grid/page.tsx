import { Container } from "@brevy/ui"

/** The twelve columns, rendered inside a frame on the layout page for the same
 *  reason the container is: the gutter changes with the width of the document,
 *  and a frame is the only way to give it a width other than the reader's own.
 *
 *  Two grids rather than one, and the difference between them is the whole
 *  subject.
 *
 *  `data-guide` is the twelve columns unconditionally. It is the drawing a
 *  designer works against, so it exists at every width, and it is what the
 *  frame outside measures its bands from.
 *
 *  `data-production` is the same twelve behind the `content:` variant, which is
 *  what every block in the system actually carries. Below 1200 it is not a grid
 *  at all. Nothing here says so: the frame reads its `display` back and lets
 *  the browser answer, so `no block places on columns at this width` is a
 *  measurement rather than a sentence somebody has to remember to update.
 *
 *  Both are empty. What is being read is where their tracks fall, and a track
 *  has a width whether or not anything sits on it.
 *
 *  Nothing is drawn in here. A hairline and a dash are sizes in pixels and the
 *  frame is scaled to fit the column beside it, so both would arrive shrunk.
 *  The bands are painted from outside at the size the measurement says. */
export default function GridSpecimenPage() {
  return (
    <div data-bleed className="flex h-dvh items-center bg-olive-500/40">
      <Container data-container className="h-3/5">
        <div data-guide className="grid h-full grid-cols-12 gap-4" />
        <div
          data-production
          className="content:grid content:grid-cols-12 content:gap-4"
        />
      </Container>
    </div>
  )
}
