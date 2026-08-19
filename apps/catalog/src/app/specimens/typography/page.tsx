import { notFound } from "next/navigation"

import { Specimen } from "@/components/specimen"
import { groupById, TYPE_GROUPS } from "@/typography"

export function generateStaticParams() {
  return TYPE_GROUPS.map((group) => ({ group: group.id }))
}

/** Rendered inside a frame on the typography page. It lives outside the
 *  catalog shell on purpose: a frame is its own viewport, which is the only
 *  way a size written in `vw` can be shown at a width other than the
 *  reader's own window. */
export default async function TypographySpecimensPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>
}) {
  const { group: id } = await searchParams
  const group = id ? groupById(id) : undefined

  if (!group) {
    notFound()
  }

  return (
    <ul
      className="bg-card px-6 py-10"
      style={{ maxWidth: "var(--sample-width, 100%)" }}
    >
      {group.roles.map((role) => (
        <Specimen key={role.name} role={role} />
      ))}
    </ul>
  )
}
