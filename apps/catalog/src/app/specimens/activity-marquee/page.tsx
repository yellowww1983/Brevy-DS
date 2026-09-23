import { ActivityMarquee } from "@brevy/ui"

import { LABEL, PRESET } from "@/activity-marquee"

export default async function ActivityMarqueeSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>
}) {
  const query = await searchParams

  return (
    <ActivityMarquee
      label={LABEL}
      rows={PRESET}
      variant={query.variant === "chips" ? "chips" : "mix"}
    />
  )
}
