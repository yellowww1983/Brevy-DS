import { SegmentRows, type SegmentRowsItem } from "@brevy/ui"

import { FOURTH, HEADING, PRESET } from "@/segment-rows"
import { SegmentMock } from "@/components/segment-mock"

export default async function SegmentRowsSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{ fourth?: string; active?: string }>
}) {
  const query = await searchParams
  const base: readonly SegmentRowsItem[] =
    query.fourth === "on" ? [...PRESET, FOURTH] : PRESET
  const active = Number(query.active)

  return (
    <SegmentRows
      heading={HEADING}
      active={Number.isFinite(active) ? active : 0}
      items={base.map((item, index) => ({
        ...item,
        illustration: <SegmentMock index={index} />,
      }))}
    />
  )
}
