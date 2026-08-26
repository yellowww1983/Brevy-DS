import {
  BrevyLockup,
  Facebook,
  Footer,
  Instagram,
  LinkedIn,
  TikTok,
  type FooterSocial,
} from "@brevy/ui"

import { LINKS, NEWSLETTER, SOCIALS, TAGLINE } from "@/footer"

const MARKS = {
  Facebook: <Facebook />,
  Instagram: <Instagram />,
  TikTok: <TikTok />,
  LinkedIn: <LinkedIn />,
}

const socials: readonly FooterSocial[] = SOCIALS.map((social) => ({
  ...social,
  mark: MARKS[social.label],
}))

/** Rendered inside a frame on the Footer page. It lives outside the catalog
 *  shell because the block paints a band the full width of its document and
 *  its gutter changes with that width.
 *
 *  The air above it belongs here rather than to the block. The file draws the
 *  footer with nothing above the lockup, because on a real page a section ends
 *  there; a frame has no such section, so the specimen supplies one section's
 *  worth of space and `Footer` stays at the 0 the file draws. */
export default function FooterSpecimenPage() {
  return (
    <>
      <div data-slot="specimen-air" className="h-24" aria-hidden />

      <Footer
        logo={
          <BrevyLockup className="h-10 w-auto text-brand-500 dark:text-olive-500" />
        }
        tagline={TAGLINE}
        socials={socials}
        newsletter={NEWSLETTER}
        links={LINKS}
      />
    </>
  )
}
