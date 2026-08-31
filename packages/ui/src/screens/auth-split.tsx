import type { ReactNode } from "react"

import { BrevyLockup } from "../icons/logo/index.js"
import { cn } from "../lib/utils.js"

/** The auth screen: the lockup, a serif welcome, a line under it, and a form
 *  — beside a photograph where there is room for one.
 *
 *  It comes from the app file rather than the website (`20786:176842`, the
 *  split variant; `20786:176564`, the centred one), and it is here because it
 *  is drawn in the website's own language: the ground is the centred hero's
 *  beige-to-white with the same 1408 by 670 painting hung across it, the
 *  heading is the serif h1 in brand-500, the button is the leaf, the field is
 *  the 48 the website draws in every form it has. What the drawing carries of
 *  the app's dialect is leftovers — a Geist footnote, a search icon in a
 *  password field, a helper still reading its placeholder — and none of it
 *  ships.
 *
 *  Three numbers are this system's rather than the drawing's, all raised with
 *  the designer (DESIGN-FEEDBACK 71): the photograph rounds 16 where the
 *  screen draws 14 — a step neither radius ramp carries — and the heading
 *  sits on the h1's own 1.333 where the screen types 42/60. The field's
 *  drawn 8 is not a third: `rounded-md` is 8 in this system's own scale, so
 *  the screen and the token already agree.
 *
 *  The photograph is a preset layer, and it decides the arrangement the way
 *  the testimonial photograph decides its header: with it, the copy takes the
 *  left half and the picture the right, which is the split variant; without
 *  it, the column centres alone on the wash, which is the drawn centred
 *  variant, not a fallback invented here. The file draws no tablet for the
 *  split — its tablet exists only in the centred set — so below the content
 *  breakpoint the picture goes and the screen becomes that drawn tablet: a
 *  composition, but one the file itself reaches the same way.
 *
 *  The form arrives as children rather than as props, because every line of
 *  it is a page's own: which fields, what they validate, where the button
 *  leads. The screen owns what does not change — the shell, the ground, the
 *  header — and hands the column its drawn rhythm: 48 under the lockup, 12
 *  under the heading, 16 between everything after.
 *
 *  Dark follows the heroes it borrows its ground from: the wash and the
 *  photograph go, the gradient drops for `--background`, the heading moves to
 *  `--primary`. */
function AuthSplit({
  heading,
  description,
  wash,
  photograph,
  className,
  children,
}: {
  heading: string
  description: string
  /** The painting across the ground — the same layer the centred hero
   *  carries, and the same asset in the file. Hidden from the accessibility
   *  tree: it is atmosphere, not content. */
  wash?: ReactNode
  /** The picture beside the form, standing in the right half from the content
   *  breakpoint up. A slot rather than a source, so a page brings whatever it
   *  renders images with. */
  photograph?: ReactNode
  className?: string
  children?: ReactNode
}) {
  return (
    <main
      data-slot="auth-split"
      className={cn(
        "relative isolate flex min-h-(--auth-height-narrow) gap-6 overflow-hidden bg-linear-to-b from-beige-500 to-white p-4 tablet:p-6 content:min-h-(--auth-height) dark:bg-background dark:bg-none",
        className,
      )}
    >
      {/* Hung rather than stretched: the file places the same 670-tall
          painting at every width it draws — 100 down from the tablet up,
          against the top below it — instead of scaling it to the frame. */}
      {wash ? (
        <div
          data-slot="auth-split-wash"
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-(--auth-wash) tablet:top-(--auth-wash-top) dark:hidden"
        >
          {wash}
        </div>
      ) : null}

      <div
        data-slot="auth-split-copy"
        className="flex flex-1 items-center justify-center"
      >
        <div className="flex w-full max-w-(--auth-copy) flex-col gap-4">
          <header className="flex flex-col gap-3">
            <div className="flex flex-col items-start gap-12">
              <BrevyLockup className="h-10 w-auto text-brand-500 dark:text-primary" />

              <h1
                data-slot="auth-split-heading"
                className="font-serif text-h1 text-balance text-brand-500 dark:text-primary"
              >
                {heading}
              </h1>
            </div>

            <p
              data-slot="auth-split-description"
              className="text-base text-zinc-700 dark:text-muted-foreground"
            >
              {description}
            </p>
          </header>

          {children}
        </div>
      </div>

      {/* A layer rather than a flow child: laid out absolutely inside its
          half so its intrinsic aspect cannot set the screen's height — the
          drawn panel fills the frame, not the other way round. */}
      {photograph ? (
        <div
          data-slot="auth-split-photograph"
          className="relative hidden flex-1 overflow-hidden rounded-2xl content:block dark:content:hidden"
        >
          <div className="absolute inset-0">{photograph}</div>
        </div>
      ) : null}
    </main>
  )
}

export { AuthSplit }
