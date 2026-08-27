import { HeroSplit } from "@brevy/ui"

import { IMAGE, PRESET } from "@/hero-split"

/** Rendered inside a frame on the HeroSplit page. It lives outside the catalog
 *  shell because the block is a full width band that turns at a width: the row
 *  becomes a column, the picture goes, the card changes from a floating thing
 *  into a band. A width only means that in a document of its own.
 *
 *  Whether the picture and the card are there arrives in the query string
 *  rather than as more routes, the way the chat's lit state does. */
export default async function HeroSplitSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{ image?: string; card?: string }>
}) {
  const { image, card } = await searchParams

  return (
    <HeroSplit
      heading={PRESET.heading}
      description={PRESET.description}
      intro={PRESET.intro}
      action={PRESET.action}
      image={image === "off" ? undefined : IMAGE}
      card={card === "off" ? undefined : PRESET.card}
    />
  )
}
