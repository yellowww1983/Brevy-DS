import { HeroCentered } from "@brevy/ui"

import { BUTTON_PRESET, CHAT_PRESET, IMAGE } from "@/hero-centered"

/** Rendered inside a frame on the HeroCentered page. It lives outside the
 *  catalog shell because the block is a full width band that carries
 *  breakpoints of its own: the copy column, the heading and the suggestions
 *  all change at a width, and a width only means something in a document of
 *  its own.
 *
 *  Which preset, whether the picture is there, and whether the slot above the
 *  heading is empty all arrive in the query string rather than as more routes,
 *  the way the chat's lit state does. The empty intro is not a preset of its
 *  own: no page in the file opens without something above the heading, so it
 *  is a state to prove rather than a page to show. */
export default async function HeroCenteredSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; image?: string; intro?: string }>
}) {
  const { action, image, intro } = await searchParams
  const preset = action === "button" ? BUTTON_PRESET : CHAT_PRESET

  return (
    <HeroCentered
      heading={preset.heading}
      description={preset.description}
      intro={intro === "none" ? { kind: "none" } : preset.intro}
      action={preset.action}
      image={image === "off" ? undefined : IMAGE}
    />
  )
}
