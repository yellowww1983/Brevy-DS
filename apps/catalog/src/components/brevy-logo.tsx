import { BrevyLockup } from "@brevy/ui"

/** The catalog's own dressing of the lockup, so the chrome names it once and
 *  the green lives in one place rather than at every call site.
 *
 *  The drawing is the package's, not a second copy. It used to be one: this
 *  file carried its own 304x82 outline lifted from the Open Graph image, and
 *  at the same height it did not overlay the 115x40 the navbar, the footer
 *  and the login screen wear. The mark was not square, the gap to the wordmark
 *  ran wider by a seventh of the height, and the whole lockup was a third
 *  wider than it should be. DESIGN-FEEDBACK 12 asked for one pair with
 *  matching proportions; until that arrives the answer is to stop shipping
 *  two. */

/** Small, for the sidebar's own head and the frame the preloader holds while
 *  its animation is on its way. Hidden from the reader: the link it sits in is
 *  named by the words under it. */
export function BrevyLogo() {
  return (
    <BrevyLockup
      className="h-6 w-auto text-brand-500 dark:text-primary"
      aria-hidden
      role={undefined}
      aria-label={undefined}
    />
  )
}

/** The size a page wears it at, which is the height it is drawn. */
export function BrevyWordmark() {
  return (
    <BrevyLockup className="h-10 w-auto text-brand-500 dark:text-primary" />
  )
}
