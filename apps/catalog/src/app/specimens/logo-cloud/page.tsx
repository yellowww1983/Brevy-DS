import { LogoCloud } from "@brevy/ui"

import { MARK_COUNT, PartnerMark } from "@/components/partner-mark"

export default function LogoCloudSpecimenPage() {
  return (
    <LogoCloud
      label="Organizations Brevy works with"
      logos={Array.from({ length: MARK_COUNT }, (_, index) => (
        <PartnerMark key={index} index={index} />
      ))}
    />
  )
}
