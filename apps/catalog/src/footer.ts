import type { FooterLink, FooterNewsletter } from "@brevy/ui"

import { join, preamble } from "./doc"

export const INTRO =
  "The page's foot. The lockup, a line about the company and the brand links on the left, the newsletter on the right, a rule, and the legal line under it. Below the content width the two columns stack; below the tablet width the legal line stacks with them."

export const USE = [
  "`Footer` takes the lockup, the tagline, the brand links, the newsletter's copy and the legal links. Only the copyright carries a default, because one page in the file draws a longer line there and every other draws the same short one.",
  "The newsletter is assembled from the `Input` at its tall size and the primary `Button`, not a component of its own: the file draws it 53 times and every one of them is inside a footer.",
]

export const LAYOUT = [
  "On the desktop the two columns are halves of the drawn 1200 with 16px between them, so like the FAQ's pair they need the whole column and arrive at the content breakpoint rather than at the drawn desktop. Below it they stack 32px apart.",
  "The legal line is a row down to the tablet width, with the copyright taking the space the links leave. At mobile it stacks, 24px apart.",
  "There is no padding above the block. The file starts the lockup flush against the top of the frame and leans on the section before it, so a page supplies that air itself.",
]

/** The line the file breaks itself rather than letting it wrap. */
export const TAGLINE =
  "We help families manage and coordinate caregiving \nwith less stress and more clarity."

export const NEWSLETTER: FooterNewsletter = {
  heading: "Subscribe to our newsletter",
  description: "Sign up with your email to receive latest updates",
  placeholder: "Enter your email address",
  action: "Subscribe",
}

/** The four accounts the shipped site links to, in the order the file draws
 *  them. */
export const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61570449265157",
  },
  { label: "Instagram", href: "https://www.instagram.com/brevycare" },
  { label: "TikTok", href: "https://www.tiktok.com/@brevycare" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/brevy-care/" },
] as const

export const LINKS: readonly FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Contact us", href: "/contact" },
]

export function footerDoc() {
  return join([
    preamble("Footer", "block"),
    "",
    "# Footer",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { BrevyLockup, Facebook, Footer } from "@brevy/ui"',
    "",
    "<Footer",
    '  logo={<BrevyLockup className="h-10 w-auto text-brand-500 dark:text-primary" />}',
    "  tagline={tagline}",
    '  socials={[{ label: "Facebook", href, mark: <Facebook /> }]}',
    "  newsletter={{ heading, description, placeholder, action }}",
    '  links={[{ label: "Privacy Policy", href: "/privacy-policy" }]}',
    "/>",
    "```",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
