import { Chat, Container } from "@brevy/ui"

import { PLACEHOLDER, READY, SEND_LABEL } from "@/chat"

/** Rendered inside a frame on the Chat page. It lives outside the catalog
 *  shell so the card's three widths come out of the container rather than out
 *  of a table here: the column is the document less its gutters, and the card
 *  is the hero's 794 or the column, whichever is smaller. That resolves to
 *  794, 762 and 358 at the three drawn widths without any of them being
 *  written down.
 *
 *  The lit state arrives in the query string rather than as a second route,
 *  the way the typography specimens take their group. */
export default async function ChatSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>
}) {
  const { state } = await searchParams

  return (
    <Container className="py-4">
      <Chat
        placeholder={PLACEHOLDER}
        sendLabel={SEND_LABEL}
        defaultValue={state === "ready" ? READY : undefined}
        className="mx-auto max-w-(--chat-width)"
      />
    </Container>
  )
}
