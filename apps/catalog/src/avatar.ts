/** The catalog's faces, taken from the drawing rather than invented: the three
 *  photographs the website's avatar group carries (node 22680:1103), cropped
 *  the way Figma crops them — `scaleMode: FILL` into a square frame is a
 *  centred cover — and stored at 96, three times the 32 they are drawn at.
 *
 *  They are served from the catalog rather than fetched, so a preview never
 *  depends on a network and a spec never waits on one.
 *
 *  The names are the catalog's own. Nothing in the file names these people, and
 *  what these previews demonstrate is the circle, the overlap and the fallback,
 *  for which any three names with distinct initials do. */
export type Person = {
  name: string
  initials: string
  photo: string
}

export const PEOPLE: readonly Person[] = [
  { name: "Maria Wells", initials: "MW", photo: "/people/mw.jpg" },
  { name: "Sam Doyle", initials: "SD", photo: "/people/sd.jpg" },
  { name: "Ana Ruiz", initials: "AR", photo: "/people/ar.jpg" },
]

/** A source that cannot resolve, so Radix falls back for the reason it exists
 *  rather than because a prop asked it to. */
export const MISSING_PHOTO = "/people/nobody.jpg"
