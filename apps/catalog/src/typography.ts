export type TypeRole = {
  name: string
  sample: string
  /** The role's own classes. Everything a specimen shows comes from these, so
   *  the page cannot display one thing while the system does another. */
  style: string
  face: "Hedvig Letters Serif" | "Rethink Sans"
}

export type TypeGroup = {
  id: string
  title: string
  note: string
  roles: readonly TypeRole[]
}

export const TYPE_GROUPS: readonly TypeGroup[] = [
  {
    id: "headings",
    title: "Headings",
    note: "Set in Hedvig Letters Serif, and all three scale with the viewport — switch the width above and watch them move. h1 opens a page; display is the louder opening the Mobile App landing uses, and nothing else does.",
    roles: [
      {
        name: "display",
        sample: "Your caregiver super app",
        style: "font-serif text-display",
        face: "Hedvig Letters Serif",
      },
      {
        name: "h1",
        sample: "Eldercare benefits, made simple",
        style: "font-serif text-h1",
        face: "Hedvig Letters Serif",
      },
      {
        name: "h2",
        sample: "How it works",
        style: "font-serif text-h2",
        face: "Hedvig Letters Serif",
      },
    ],
  },
  {
    id: "body",
    title: "Body",
    note: "Set in Rethink Sans. These never change with the width of the window — switch the viewport and nothing here moves. h3 and body-lg are the same size and differ only in weight: one titles a card, the other opens a paragraph.",
    roles: [
      {
        name: "h3",
        sample: "Chat with Brevy",
        style: "font-sans text-h3",
        face: "Rethink Sans",
      },
      {
        name: "body-lg",
        sample:
          "The free tool for discovering and enrolling in eldercare benefits.",
        style: "font-sans text-body-lg",
        face: "Rethink Sans",
      },
      {
        name: "body",
        sample: "You’re mandated to serve a growing senior population.",
        style: "font-sans text-body",
        face: "Rethink Sans",
      },
    ],
  },
  {
    id: "supporting",
    title: "Supporting",
    note: "The small print — metadata, timestamps and the short uppercase labels that sit above a block of content.",
    roles: [
      {
        name: "caption",
        sample: "Join 2,000+ caregivers already using Brevy",
        style: "font-sans text-caption",
        face: "Rethink Sans",
      },
      {
        name: "label",
        sample: "WHAT HAPPENS NEXT",
        style: "font-sans text-label",
        face: "Rethink Sans",
      },
    ],
  },
]

export function groupById(id: string) {
  return TYPE_GROUPS.find((group) => group.id === id)
}
