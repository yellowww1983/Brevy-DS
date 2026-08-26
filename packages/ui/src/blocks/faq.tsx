import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/accordion.js"
import { Button } from "../components/button.js"
import { Container } from "../components/container.js"

type FaqItem = {
  question: string
  answer: string
}

type FaqContact = {
  message: string
  label: string
  href: string
}

/** The FAQ section. A serif heading and a green contact card on the left,
 *  the questions on the right, on a band that fades from beige to white.
 *
 *  The two columns sit on the documented grid: the intro takes the first four
 *  columns and the list the last six, which lands them at the drawn 389 and
 *  592 with the empty tracks between. They need the full 1200 column to
 *  exist, so they arrive at the content breakpoint rather than the drawn
 *  desktop: 389 plus 48 plus 592 fits nothing narrower. Below that the block
 *  stacks: intro, then the card, then the list.
 *
 *  The card sits by the text at every width, 24 under the description and 48
 *  over the list. The file also draws it pinned to the foot of the column on
 *  the older pages; that drawing is not this block. The 96 above and below is
 *  the Caregiving and partner drawing; the home pages draw 0 at the top and
 *  lean on the section before them, which a block standing alone cannot.
 *
 *  Every colour in the band is a ramp colour rather than a theme token, the
 *  heading included. The band itself cannot turn dark, so nothing on it may:
 *  the heading was on a token and went near-white on a dark page while the
 *  beige stayed beige, measured at 1.07 to 1. `#27272a` is what the file
 *  draws. What this section looks like in the dark is a drawing nobody has
 *  made. */
function Faq({
  heading,
  description,
  items,
  contact,
  defaultOpen,
}: {
  heading: string
  description: string
  items: readonly FaqItem[]
  contact: FaqContact
  /** The question drawn open, if any. The drawn section opens its first. */
  defaultOpen?: string
}) {
  return (
    <section data-slot="faq" className="bg-linear-to-b from-beige-500 to-white">
      <Container className="py-24">
        <div className="flex flex-col gap-12 content:grid content:grid-cols-12 content:gap-4">
          <div
            data-slot="faq-intro"
            className="flex flex-col gap-6 content:col-span-4"
          >
            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-h2 text-zinc-800">{heading}</h2>
              <p className="text-body-lg text-zinc-700">{description}</p>
            </div>

            {/* The green card: a row that goes upright below the tablet
                width, where its button takes the whole line. The row's
                vertical padding is 14 rather than 24: the file fixes the
                card's height and crushes the declared padding to 15, and 14
                is the step the scale has, which is also what the shipped
                site renders. Upright, the drawn 24 holds. */}
            <div
              data-slot="faq-contact"
              className="flex flex-col gap-4 rounded-2xl bg-surface-olive p-6 tablet:flex-row tablet:items-center tablet:justify-between tablet:py-3.5"
            >
              <p className="text-base whitespace-pre-line text-zinc-700">
                {contact.message}
              </p>
              <Button asChild className="w-full shrink-0 tablet:w-auto">
                <a href={contact.href}>{contact.label}</a>
              </Button>
            </div>
          </div>

          <div
            data-slot="faq-list"
            className="content:col-span-6 content:col-start-7"
          >
            <Accordion defaultValue={defaultOpen}>
              {items.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </section>
  )
}

export { Faq }
export type { FaqContact, FaqItem }
