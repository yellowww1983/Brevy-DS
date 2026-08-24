"use client"

import { Menu, X } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"

import { Button } from "../components/button.js"
import { Container } from "../components/container.js"

type NavbarLink = {
  label: string
  href: string
}

/** The call to action, as what it says rather than as a rendered button. The
 *  bar and the menu draw it at two different sizes, so the block builds both
 *  rather than being handed one and forced to resize it. */
type NavbarCta = {
  label: string
  href: string
  icon?: ReactNode
}

/** The page header. A pill holding the logo on the left and the links on the
 *  right, on a band the width of the screen.
 *
 *  Everything inside the pill is a `Button`. The design draws the links at 36
 *  high with a 10 radius, 16 of horizontal padding and a `#dedad6` hover, which
 *  is the ghost variant exactly, and it draws the menu's call to action at 48
 *  with the leaf radius on `#023620`, which is the primary variant exactly.
 *
 *  It is fixed rather than in flow. The pill never changes: the shipped bar
 *  carries the same opaque beige at the top of the page and a thousand pixels
 *  down it, with no blur and no shadow at either end. The one thing that moves
 *  is the call to action, which opens out of nothing once the page has scrolled
 *  by the height of the bar itself.
 *
 *  Below the tablet width the links come out of the pill and the icon takes
 *  their place, which is the one place this block does real work: the menu it
 *  opens covers the page. */
/** The call to action appears once the page has scrolled by this much, which is
 *  the height of the band: 24 above and below a pill of 64. Measured off the
 *  shipped site, where the switch lands at 112 exactly. */
const BAND = 112

function Navbar({
  logo,
  links,
  cta,
}: {
  logo: ReactNode
  links: readonly NavbarLink[]
  /** Sits in the pill beside the links, and at the foot of the open menu.
   *  Optional, because the design draws only the menu's. */
  cta?: NavbarCta
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const read = () => {
      setScrolled(window.scrollY >= BAND)
    }

    read()
    window.addEventListener("scroll", read, { passive: true })

    return () => {
      window.removeEventListener("scroll", read)
    }
  }, [])

  /** The menu covers the page, so the page behind it has nothing to scroll. */
  useEffect(() => {
    if (!open) {
      return
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <>
      <header
        data-slot="navbar"
        className="fixed top-0 right-0 left-0 z-50 py-6"
      >
        <Container>
          <div
            data-slot="navbar-pill"
            className="mx-auto flex h-16 max-w-(--navbar-width) items-center justify-between rounded-full border border-surface-hover bg-secondary px-6"
          >
            {logo}

            <div className="flex items-center gap-2">
              {/* The design sets these side by side with nothing between them,
                  so the only space around a link is its own padding. */}
              <nav aria-label="Main" className="hidden tablet:flex">
                {links.map((link) => (
                  <Button key={link.href} variant="ghost" asChild>
                    <a href={link.href}>{link.label}</a>
                  </Button>
                ))}
              </nav>

              {/* It opens out of nothing rather than appearing: the shipped bar
                  animates the width and the opacity of the box around it, and
                  clips whatever is inside while it is shut. */}
              {cta ? (
                <div
                  data-slot="navbar-cta"
                  data-shown={scrolled ? "" : undefined}
                  className={
                    scrolled
                      ? "hidden w-auto overflow-hidden opacity-100 transition-all duration-300 ease-in-out tablet:block"
                      : "hidden w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out tablet:block"
                  }
                >
                  <Button variant="primary" size="compact" asChild>
                    <a href={cta.href}>
                      {cta.icon}
                      {cta.label}
                    </a>
                  </Button>
                </div>
              ) : null}

              <Button
                variant="ghost"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => {
                  setOpen((was) => !was)
                }}
                className="tablet:hidden"
              >
                {open ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {open ? (
        <div
          data-slot="navbar-menu"
          className="fixed inset-0 z-40 flex flex-col bg-background pt-28 tablet:hidden"
        >
          <nav aria-label="Menu" className="pt-10">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex h-12 items-center px-4 text-body-lg font-medium text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* The design pins this to the foot of the screen, the width of the
              column, whatever the menu above it comes to, and draws it at the
              full height rather than the bar's. */}
          {cta ? (
            <Container className="mt-auto pb-4">
              <Button variant="primary" asChild className="w-full">
                <a href={cta.href}>
                  {cta.icon}
                  {cta.label}
                </a>
              </Button>
            </Container>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

export { Navbar }
export type { NavbarCta, NavbarLink }
