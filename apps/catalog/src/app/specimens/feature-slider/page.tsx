import { FeatureSlider } from "@brevy/ui"

import { EYEBROW, FEATURES, HEADING } from "@/feature-slider"
import { PhoneMock } from "@/components/phone-mock"

/** The block in a document of its own, so its one breakpoint answers the
 *  width on the tab rather than the reader's window. */
export default function FeatureSliderSpecimenPage() {
  return (
    <FeatureSlider
      eyebrow={EYEBROW}
      heading={HEADING}
      items={FEATURES.map((feature, index) => ({
        ...feature,
        media: <PhoneMock index={index} />,
      }))}
    />
  )
}
