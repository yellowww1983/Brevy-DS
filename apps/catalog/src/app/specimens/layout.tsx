import type { ReactNode } from "react"

/** A specimen is the product, not the catalog, so it wears the product's face.
 *
 *  It needs saying here because the catalog's body carries the catalog face,
 *  and a specimen renders under the same root layout. Component previews on a
 *  page escape that through the class on the preview box; a specimen has no
 *  preview box, so before this every component text without a face of its own
 *  came out in the catalog's Inter: the navbar's buttons, the FAQ's questions
 *  and answers, the chat's placeholder.
 *
 *  Stated once for the whole folder rather than per page, so a specimen added
 *  later inherits it instead of having to remember it. Nothing but the family
 *  belongs here: a transform or a filter would make this a containing block
 *  and the navbar's fixed bar would stop resolving to the viewport. */
export default function SpecimenLayout({ children }: { children: ReactNode }) {
  return <div className="font-sans">{children}</div>
}
