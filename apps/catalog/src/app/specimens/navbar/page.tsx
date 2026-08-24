import { Navbar } from "@brevy/ui"
import { MessageCircleHeart } from "lucide-react"

import { BrevyLockup } from "@/components/brevy-logo"
import { CTA, LINKS } from "@/navbar"

/** Rendered inside a frame on the navbar page. It lives outside the catalog
 *  shell because the block is a page header: it sticks to the top of a document
 *  and reads that document's scroll, neither of which means anything unless it
 *  has a document of its own.
 *
 *  The page below it is tall enough to scroll, which is what the second state
 *  needs, and plain enough not to compete with the bar. */
export default function NavbarSpecimenPage() {
  return (
    <div className="min-h-dvh bg-background">
      <Navbar
        logo={<BrevyLockup />}
        links={LINKS}
        cta={{ ...CTA, icon: <MessageCircleHeart aria-hidden /> }}
      />

      {/* The bar is fixed, so whatever the page opens with passes underneath
          it. Plain white first, so the pill's own beige reads against it, then
          a band of the same beige further down to show that the bar does not
          change when it crosses one. */}
      <div data-page className="h-dvh" />
      <div className="h-dvh bg-secondary" />
    </div>
  )
}
