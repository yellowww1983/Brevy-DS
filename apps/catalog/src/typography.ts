import { join, preamble, table } from "./doc"

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
    note: "Set in Hedvig Letters Serif and scaled to the viewport. Use h1 to open a page. Display is reserved for the Mobile App landing.",
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
    note: "Set in Rethink Sans at fixed sizes. h3 and body-lg share a size and differ only in weight: use h3 to title a card, body-lg to open a paragraph.",
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
    note: "Use these for metadata, timestamps, and the short uppercase labels above a block of content.",
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

export const INTRO =
  "The type scale sets the hierarchy for every page, from hero headlines down to labels. Each role has a fixed size and weight so text stays consistent wherever it appears."

export function typographyDoc() {
  return join([
    preamble("Typography"),
    "",
    "# Typography",
    "",
    INTRO,
    "",
    "Reach for a role by name. The three heading roles scale with the viewport; the other five never move.",
    "",
    ...TYPE_GROUPS.flatMap((group) => [
      `## ${group.title}`,
      "",
      group.note,
      "",
      table(
        ["Role", "Class", "Typeface"],
        group.roles.map((role) => [
          `\`${role.name}\``,
          `\`${role.style.split(" ").find((piece) => piece.startsWith("text-")) ?? role.style}\``,
          role.face,
        ]),
      ),
      "",
    ]),
  ])
}
