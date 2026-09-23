import { SNIPPET } from "./how-to-use"
import { registry, type Kind } from "./registry"

/** What the system is, in the two sentences an agent reads before anything
 *  else. The same paragraph opens both files, because both are answering the
 *  same first question. */
const SUMMARY =
  "The design system behind Brevy's marketing site and product screens. It is meant to be assembled through Claude rather than by hand: you describe the page you want, and Claude builds it out of these pieces."

/** Everything someone needs before the list means anything.
 *
 *  It used to be two sentences, and the rest of the instruction lived inside
 *  `/llms-full.txt` — 112KB, which is a wall rather than a step for the person
 *  it was written for. The half that answers "what do I do with this" is here
 *  now, and the map below is the same map it always was.
 *
 *  The import line is taken from the worked example rather than retyped, so
 *  there is one place where the package is named. */
const HOW = [
  "This is a signpost, not a warehouse. Reuse a block where one fits. Where none does, build the section yourself out of the tokens this file points at — never out of raw values.",
  "Foundations are the tokens everything is built from. Components are the parts. Blocks are whole sections a page is assembled out of, and are usually what you want to ask for by name.",
  "Two lines not to cross: nothing new is added to this catalog, and nothing in `@brevy/ui` is edited or given a variant of its own. Compose new sections out of what is there.",
  "The package is `@brevy/ui`. It is not on npm: this repo's workspace provides it, and a project of its own installs it from a tarball built here, which carries this documentation in `dist/docs`:",
]

/** What follows the worked line. Split in two rather than one list with the
 *  fence inside it, because a fence flat-mapped with the paragraphs gets a
 *  blank line between every line of code. */
const THEN = [
  "Never a raw value: `bg-secondary`, not a hex in a class; `p-6`, not `p-[24px]`. A hard-coded value is invisible to the theme.",
  "Paste `/llms-full.txt` for every page at once, including the full token tables. A single page's documentation is on the page itself, behind the Copy for Claude button.",
]

/** The sections the map is divided into, in the order someone meets them.
 *
 *  The screen sits under Optional, which the convention keeps for what an
 *  agent can skip when the context has to be shorter. It earns that: a screen
 *  is the signed-in product, and someone assembling a landing page never
 *  needs one. */
const SECTIONS: readonly { title: string; kind: Kind }[] = [
  { title: "Foundations", kind: "foundation" },
  { title: "Components", kind: "component" },
  { title: "Blocks", kind: "block" },
  { title: "Optional", kind: "screen" },
]

function rows(kind: Kind) {
  return registry
    .filter((entry) => entry.kind === kind)
    .map((entry) => `- [${entry.name}](${entry.href}): ${entry.summary}`)
}

/** The map: what there is, and where each of it lives.
 *
 *  It loads no documentation. A summary and an href are on the entry itself,
 *  which is the whole reason they are written there rather than lifted from
 *  each doc's opening paragraph. */
export function llmsMap() {
  return [
    "# Brevy Design System",
    "",
    `> ${SUMMARY}`,
    "",
    ...HOW.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    SNIPPET[0] ?? "",
    "```",
    "",
    ...THEN.flatMap((paragraph) => [paragraph, ""]),
    ...SECTIONS.flatMap((section) => [
      `## ${section.title}`,
      "",
      ...rows(section.kind),
      "",
    ]),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()
}

/** Everything, in one file.
 *
 *  Not part of the convention — the map is — but it is what somebody working
 *  through Claude actually wants: the whole system in one paste rather than
 *  thirty-three fetches.
 *
 *  It is a concatenation and nothing more. Each page's documentation appears
 *  exactly as that page hands it over, including the line each one opens
 *  with, so what is here can be compared to what the catalog shows rather
 *  than trusted. Editing them on the way through would make this a third
 *  version of the same text.
 *
 *  The order is the registry's, which reads as a document: the tokens, then
 *  the parts, then the sections built out of them, then the screen. */
export async function llmsFull() {
  const docs = await Promise.all(registry.map((entry) => entry.doc()))
  const count = (kind: Kind) =>
    String(registry.filter((entry) => entry.kind === kind).length)

  return [
    "# Brevy Design System",
    "",
    `> ${SUMMARY}`,
    "",
    `Every page of the catalog, in one file: ${count("foundation")} foundations, ${count("component")} components, ${count("block")} blocks and a screen. Ask for a block by name and Claude has what it needs to build it.`,
    "",
    ...docs.flatMap((doc) => ["---", "", doc, ""]),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()
}
