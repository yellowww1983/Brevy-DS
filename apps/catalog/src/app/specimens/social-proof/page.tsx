import { Container, SocialProof } from "@brevy/ui"

import { PEOPLE } from "@/avatar"
import { LABEL, LABEL_PARTIAL } from "@/social-proof"

/** Rendered inside a frame on the Social proof page. It lives outside the
 *  catalog shell because the row's break is a breakpoint's doing, and a
 *  breakpoint only means something in a document of its own: narrowing an
 *  element inside this page would leave the media query answering the reader's
 *  window rather than the width on the tabs.
 *
 *  The faces arrive in the query string rather than as a second route, the way
 *  the chat's lit state does. */
export default async function SocialProofSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{ faces?: string; layout?: string }>
}) {
  const { faces, layout } = await searchParams
  const withPhotos = faces !== "initials"
  const stacked = layout === "stacked"

  return (
    <Container className="py-4">
      <SocialProof
        people={PEOPLE.map((person) => ({
          name: person.name,
          initials: person.initials,
          photo: withPhotos ? person.photo : undefined,
        }))}
        label={withPhotos ? LABEL : LABEL_PARTIAL}
        layout={stacked ? "stacked" : "inline"}
      />
    </Container>
  )
}
