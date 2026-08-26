import type { FaqContact, FaqItem } from "@brevy/ui"

import { join, preamble } from "./doc"

export const INTRO =
  "The FAQ section. A heading and a green contact card on the left, the questions on the right, on a band that fades from beige to white. Below the tablet width everything stacks into one column."

export const USE = [
  "`Faq` takes the heading, the description, the questions and the contact card's content. It paints its own full width band, so it sits between other blocks rather than inside a container.",
  "The list is the `Accordion`, one question open at a time, and the card's button is the primary `Button`. The block owns no styles of its own beyond the layout.",
]

export const LAYOUT = [
  "On the desktop the intro takes the first four columns of the grid and the list the last six, which lands them at the drawn 389px and 592px with the empty tracks between. Below the tablet width they stack: intro, card, list.",
  "The card sits by the text at every width: 24px under the description and 48px over the list. Below the tablet width it goes upright and its button takes the whole line.",
]

/** The set the home pages draw. The questions are the file's, the answers are
 *  the shipped site's own copy. */
export const ITEMS: readonly FaqItem[] = [
  {
    question: "Can Brevy help me get paid as a caregiver?",
    answer:
      "Yes! Brevy can help you discover caregiver support programs in your state that provide compensation for taking care of family members at home.",
  },
  {
    question: "Is Brevy really free?",
    answer:
      "Absolutely. Brevy is completely free to use. We help you find and enroll in benefits at no cost to you.",
  },
  {
    question: "What benefits can Brevy help me with?",
    answer:
      "Brevy can help you find a wide range of benefits including healthcare coverage, prescription assistance, transportation services, meal delivery, housing assistance, caregiver compensation, and much more.",
  },
  {
    question: "How does the eligibility check work?",
    answer:
      "Our intelligent assistant asks you a few simple questions about your situation and instantly checks your eligibility across hundreds of benefit programs.",
  },
  {
    question: "Can I speak with a real person?",
    answer:
      "Yes! You can connect with our enrollment specialists who can guide you through the enrollment process and answer any questions you have.",
  },
  {
    question: "How long does enrolment take?",
    answer:
      "Enrollment time varies by program, but our specialists work to make the process as quick and painless as possible. Many benefits can be activated within days.",
  },
  {
    question: "Is my information secure?",
    answer:
      "Yes, we take your privacy seriously. Your information is encrypted and securely stored. We never sell your data to third parties.",
  },
]

export const HEADING = "Got questions?"

export const DESCRIPTION =
  "Everything you need to know about Brevy and how we can help"

export const CONTACT: FaqContact = {
  message: "Didn\u2019t find your answer?\nSend us a message.",
  label: "Contact us",
  href: "#contact",
}

export const OPEN = ITEMS[0]?.question

export function faqDoc() {
  return join([
    preamble("FAQ", "block"),
    "",
    "# FAQ",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Faq } from "@brevy/ui"',
    "",
    "<Faq",
    '  heading="Got questions?"',
    '  description="Everything you need to know"',
    "  items={[{ question, answer }]}",
    '  contact={{ message, label: "Contact us", href: "/contact" }}',
    "  defaultOpen={firstQuestion}",
    "/>",
    "```",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
