import { Tiles } from "@brevy/ui"
import Image from "next/image"

import { HEADING, PICTURES, preset } from "@/tiles"

const picture = (which: "figure" | "photo") => {
  const it = PICTURES[which]
  return (
    <Image
      src={it.src}
      alt={it.alt}
      width={it.width}
      height={it.height}
      priority
      unoptimized
      className="size-full object-cover"
    />
  )
}

export default function TilesSpecimenPage() {
  return (
    <Tiles
      heading={HEADING}
      items={preset({ figure: picture("figure"), photo: picture("photo") })}
    />
  )
}
