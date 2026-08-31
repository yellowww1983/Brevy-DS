import { MediaCopy, type MediaCopyTone } from "@brevy/ui"
import Image from "next/image"

import { PICTURE, PRESET } from "@/media-copy"

/** The file paints one pebble per rung and never repeats: green, taupe,
 *  violet. The colour is the caller's, and these are the drawn three. */
const TONES: readonly MediaCopyTone[] = ["green", "taupe", "violet"]

export default function MediaCopySpecimenPage() {
  return (
    <MediaCopy
      heading={PRESET.heading}
      marked={PRESET.marked}
      description={PRESET.description}
      steps={PRESET.steps.map((step, index) => ({
        ...step,
        tone: TONES[index % TONES.length],
      }))}
      picture={
        <Image
          src={PICTURE.src}
          alt={PICTURE.alt}
          width={PICTURE.width}
          height={PICTURE.height}
          priority
          unoptimized
          className="size-full object-cover"
        />
      }
    />
  )
}
