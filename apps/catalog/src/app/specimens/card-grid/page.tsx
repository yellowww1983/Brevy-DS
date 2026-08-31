import { CardGrid, Marker } from "@brevy/ui"

import { OPTIONS, PRESET } from "@/card-grid"
import { CardMock } from "@/components/card-mock"

/** Rendered inside a frame on the CardGrid page. It lives outside the catalog
 *  shell because the grid turns at the content breakpoint — three columns
 *  become one — and a breakpoint only means something in a document of its
 *  own. */
export default async function CardGridSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{
    background?: string
    options?: string
    cards?: string
  }>
}) {
  const query = await searchParams
  const background = (["gradient", "beige", "white"] as const).find(
    (value) => value === query.background,
  )
  const options = query.options === "on"
  const count = Number(query.cards)
  const items = PRESET.items.slice(
    0,
    Number.isFinite(count) && count > 0 ? count : PRESET.items.length,
  )

  return (
    <CardGrid
      background={background}
      heading={PRESET.heading}
      chip={options ? OPTIONS.chip : undefined}
      description={options ? OPTIONS.description : undefined}
      items={items.map((item, index) => ({
        ...item,
        marker: <Marker>{index + 1}</Marker>,
        illustration: <CardMock index={index} />,
      }))}
    />
  )
}
