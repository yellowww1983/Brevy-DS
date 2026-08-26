import type { ReactNode } from "react"

import { Button } from "../components/button.js"
import { Container } from "../components/container.js"
import { Input } from "../components/input.js"

type FooterLink = {
  label: string
  href: string
}

type FooterSocial = {
  label: string
  href: string
  mark: ReactNode
}

type FooterNewsletter = {
  heading: string
  description: string
  placeholder: string
  action: string
}

/** The page's foot: the lockup, a line about the company and the brand links
 *  on the left, the newsletter on the right, a rule, and the legal line under
 *  it. Below the content width the two columns stack; below the tablet width
 *  the legal line stacks with them.
 *
 *  The pair of columns is halves of the drawn 1200 with 16 between them, so
 *  like the FAQ's pair it needs the whole column to exist and arrives at the
 *  content breakpoint rather than at the drawn desktop. Two grid tracks rather
 *  than two flexible children, because flexible children divide the space that
 *  is left over and the two sides do not ask for the same amount: that came
 *  out 568 against 616 where the file draws 592 twice.
 *
 *  The band is painted white and its own colours are ramp colours, because
 *  that is what the file draws: it has no dark version of this section.
 *
 *  There is no padding above. The file starts the lockup flush against the top
 *  of the frame and leans on whatever section precedes it, so a page that ends
 *  with this block supplies the air itself. */
function Footer({
  logo,
  tagline,
  socials,
  newsletter,
  links,
  copyright = "© 2026 Brevy",
}: {
  logo: ReactNode
  /** The file breaks this line itself rather than letting it wrap. */
  tagline: string
  socials: readonly FooterSocial[]
  newsletter: FooterNewsletter
  links: readonly FooterLink[]
  /** One page draws a longer line here; every other draws the short one. */
  copyright?: string
}) {
  return (
    <footer data-slot="footer" className="bg-white">
      <Container className="pb-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-8 content:grid content:grid-cols-2 content:gap-4">
            <div data-slot="footer-about" className="flex flex-col gap-6">
              {/* The lockup is given its own box rather than left to the
                  column: a flex child stretches by default, and an svg told to
                  fill 592 keeps its drawing centred inside that width, which
                  put the mark in the middle of the column instead of against
                  its edge. */}
              <div data-slot="footer-logo" className="w-fit">
                {logo}
              </div>

              <p className="text-body-lg whitespace-pre-line text-zinc-700">
                {tagline}
              </p>

              <ul data-slot="footer-socials" className="flex gap-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <Button
                      asChild
                      variant="social"
                      size="compact"
                      aria-label={social.label}
                    >
                      <a href={social.href}>{social.mark}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <form
              data-slot="footer-newsletter"
              className="flex flex-col gap-6 rounded-2xl bg-beige-500 p-6"
            >
              <div className="flex flex-col gap-2">
                <p className="text-body-lg font-semibold text-zinc-800">
                  {newsletter.heading}
                </p>
                <p className="text-body-lg text-zinc-700">
                  {newsletter.description}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  size="tall"
                  aria-label={newsletter.heading}
                  placeholder={newsletter.placeholder}
                />
                <Button type="submit" className="w-full">
                  {newsletter.action}
                </Button>
              </div>
            </form>
          </div>

          <div
            data-slot="footer-rule"
            className="h-px bg-neutral-200"
          />

          <div
            data-slot="footer-legal"
            className="flex flex-col gap-6 tablet:flex-row"
          >
            <p className="text-zinc-700 tablet:flex-1">
              {copyright}
            </p>

            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="w-fit text-zinc-700 hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}

export { Footer }
export type { FooterLink, FooterNewsletter, FooterSocial }
