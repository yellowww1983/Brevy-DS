import { join, preamble } from "./doc"

/** How to work with the system, along the two paths people arrive on.
 *
 *  The page spoke to one of them for a long time: a product manager who
 *  describes a page and lets Claude assemble it. That half is unchanged. What
 *  it never said is what a developer does, and a developer opening the catalog
 *  had no first step at all.
 *
 *  The prose lives here rather than in the page because this page is now in
 *  the registry, so it hands itself to Claude the way every other page does.
 *  One source, or the two would drift. */

export const INTRO =
  "There are two ways in. If you do not write code you work through Claude, describing what you want and letting it assemble the page from Brevy's own pieces. If you do write code you work in this repo and import the pieces yourself. Both end up with the same page, because both are reaching for the same components."

/** The path this page has always described. Unchanged in substance. */
export const NO_CODE_INTRO =
  "You describe what you want, Claude builds it from the Brevy pieces. No design tools, no code editor. Here is how to get the most out of it."

/** The five the page has always had, in the order it has always had them.
 *  The second carries two paragraphs, which is how it was written. */
export const NO_CODE: readonly {
  id: string
  title: string
  body: readonly string[]
}[] = [
  {
    id: "start-with-what-youre-making",
    title: "Start with what you are making",
    body: [
      "Tell Claude the goal first, not the parts. A landing page for the spring caregiver campaign gives Claude more to work with than a hero and three cards. It can suggest which blocks fit. That is what the catalog is for.",
    ],
  },
  {
    id: "point-claude-at-the-pieces",
    title: "Point Claude at the pieces you want",
    body: [
      "Browse Components and Blocks here. When you find something that fits, use Copy for Claude. It hands over that page's whole documentation: what the piece is for, which variant to reach for, every prop it takes and an example you can paste. Claude then builds with the real thing instead of guessing from a name.",
      "That is one page at a time. When the page you are building needs several blocks at once, use Copy entire system in the top bar instead: it hands over every component, block and foundation in one paste, so Claude has the whole catalog in front of it rather than the one piece you happened to be looking at.",
    ],
  },
  {
    id: "describe-the-content",
    title: "Describe the content, not the design",
    body: [
      "You bring the words and the intent; the system brings the look. Headline about saving caregivers time, three benefits, a sign-up button at the bottom is enough. You never pick colours, fonts, or spacing. Those are already decided, and that is what keeps every page on-brand.",
    ],
  },
  {
    id: "review-then-refine",
    title: "Review, then refine",
    body: [
      "Claude shows you the result. If something is off, say so in plain language: make the hero shorter, swap the second and third sections. You are editing by conversation, not by hand.",
    ],
  },
  {
    id: "when-you-need-something-else",
    title: "When you need something that is not here",
    body: [
      "If the catalog does not have the piece you need, do not force it and do not ask Claude to invent one. That is how pages drift off-brand. Reach out to the Brevy team and we will add it properly, so it works everywhere including your page.",
    ],
  },
]

/** The path that was missing. */
export const CODE_INTRO =
  "The system is a package in this monorepo. You will not install it, you will open the repo and import from it."

export const INTERNAL = {
  id: "it-is-internal",
  title: "It is internal, not a dependency",
  body: "`@brevy/ui` is private and never goes to npm. There is no `npm install @brevy/ui` and there is no version to pin. It lives in `packages/ui` beside the app that consumes it, and the workspace resolves the import to the source, so a change to a component shows up in the catalog without a build step.",
}

export const COMPOSING = {
  id: "composing-a-page",
  title: "Composing a page",
  body: "A block is a section. It brings its own padding, its own container and its own responsive behaviour, and it takes content rather than layout. You assemble a page out of blocks and let them decide how they look.",
}

export const COMPOSING_NOTE =
  "There are no colours, sizes or spacing in that. There is nowhere to put them, which is the point."

export const CLAUDE_CODE = {
  id: "claude-code-already-knows",
  title: "Claude Code already knows what is here",
  body: "Working in the repo you do not paste anything. Claude Code reads the registry, which is the one list of every component, block, foundation and screen, and finds the documentation from there. Ask it for a page and it reaches for real blocks rather than inventing markup that looks close.",
}

export const WHERE_THE_API_IS = {
  id: "where-the-api-is",
  title: "Where the API is written down",
  body: "Three places, and they are the same documentation in three shapes.",
}

export const API_PLACES: readonly { where: string; what: string }[] = [
  {
    where: "A page in this catalog",
    what: "The previews, the variants and the props table for one piece",
  },
  {
    where: "Copy for Claude",
    what: "The same page as text, for pasting into a conversation outside the repo",
  },
  {
    where: "/llms-full.txt",
    what: "Every page at once, which is what Copy entire system hands over",
  },
]

/** The snippet is checked. It is compiled against `@brevy/ui` by the docs
 *  guard on every run, because a page teaching somebody how to assemble a page
 *  cannot be the one thing in the catalog that is out of date. */
export const SNIPPET: readonly string[] = [
  'import { CardGrid, CtaBand } from "@brevy/ui"',
  "",
  "export function SpringCampaign() {",
  "  return (",
  "    <>",
  "      <CardGrid",
  '        heading="Support you already qualify for"',
  "        items={[",
  "          {",
  '            title: "Paid caregiving",',
  '            description: "Get paid for the care you already give.",',
  "          },",
  "          {",
  '            title: "Prescription help",',
  '            description: "Lower what you pay each month.",',
  "          },",
  "          {",
  '            title: "Food and utilities",',
  '            description: "Programs most people never hear about.",',
  "          },",
  "        ]}",
  "      />",
  "",
  "      <CtaBand",
  '        tone="light"',
  '        heading="Find what you qualify for"',
  '        description="Answer a few questions and we will do the rest."',
  '        button={{ label: "Start now", href: "/start" }}',
  "      />",
  "    </>",
  "  )",
  "}",
]

export function howToUseDoc() {
  return join([
    preamble("How to use"),
    "",
    "# How to use",
    "",
    INTRO,
    "",
    "## If you don't write code",
    "",
    NO_CODE_INTRO,
    "",
    ...NO_CODE.flatMap((section) => [
      `### ${section.title}`,
      "",
      ...section.body.flatMap((paragraph) => [paragraph, ""]),
    ]),
    "## If you write code",
    "",
    CODE_INTRO,
    "",
    ...[INTERNAL, COMPOSING].flatMap((section) => [
      `### ${section.title}`,
      "",
      section.body,
      "",
    ]),
    "```tsx",
    ...SNIPPET,
    "```",
    "",
    COMPOSING_NOTE,
    "",
    ...[CLAUDE_CODE, WHERE_THE_API_IS].flatMap((section) => [
      `### ${section.title}`,
      "",
      section.body,
      "",
    ]),
    ...API_PLACES.map((place) => `- **${place.where}.** ${place.what}`),
  ])
}
