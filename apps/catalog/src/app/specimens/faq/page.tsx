import { Faq } from "@brevy/ui"

import { CONTACT, DESCRIPTION, HEADING, ITEMS, OPEN } from "@/faq"

/** Rendered inside a frame on the FAQ page. It lives outside the catalog
 *  shell because the block paints a band the full width of its document, and
 *  the gutter under it changes with the document's width. */
export default function FaqSpecimenPage() {
  return (
    <Faq
      heading={HEADING}
      description={DESCRIPTION}
      items={ITEMS}
      contact={CONTACT}
      defaultOpen={OPEN}
    />
  )
}
