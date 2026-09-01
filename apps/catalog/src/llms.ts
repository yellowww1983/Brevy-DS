import { registry, type Kind } from "./registry"

/** What the system is, in the two sentences an agent reads before anything
 *  else. The same paragraph opens both files, because both are answering the
 *  same first question. */
const SUMMARY =
  "The design system behind Brevy's marketing site and product screens. It is meant to be assembled through Claude rather than by hand: you describe the page you want, and Claude builds it out of these pieces."

const HOW = [
  "Paste this file to give Claude the shape of the system, or `/llms-full.txt` to give it every page at once. A single page's documentation is on the page itself, behind the Copy for Claude button.",
  "Foundations are the tokens everything is built from. Components are the parts. Blocks are whole sections a page is assembled out of, and are usually what you want to ask for by name.",
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
