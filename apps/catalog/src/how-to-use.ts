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
  "There are two ways in. If you do not write code you work through Claude, describing what you want and letting it assemble the page from Brevy's own pieces. If you do write code you import the pieces yourself, in this repo or in a project that installs the package. Both end up with the same page, because both are reaching for the same components."

/** The path this page has always described. Unchanged in substance. */
export const NO_CODE_INTRO =
  "You describe what you want, Claude builds it from the Brevy pieces. No design tools, no code editor. Here is how to get the most out of it."

/** The shortest way in for somebody starting from nothing: a folder that is
 *  already a project. The page puts the download beside it; the text says what
 *  it is, so it reads the same wherever this documentation is pasted. */
export const STARTER =
  "Starting a page from nothing? Download the starter project from this catalog: a ready project folder with the system already set up. Unzip it, open the folder in Claude Code, and tell Claude what page you want."

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
    title: "When the catalog does not have it",
    body: [
      "The catalog is a signpost rather than a warehouse. It does not hold a block for every section a page might need, and it is not meant to. What it holds is the language — the tokens, the spacing, the grid, the type — that everything else is built in.",
      "So when a section has no block, build it. Tell Claude what the section does and ask for it in the system's own values: a colour from the semantic tokens, padding from the spacing steps, a radius from the scale, type from the roles. What comes out belongs to your page, and it looks like Brevy because every value in it is Brevy's.",
      "Two lines it does not cross. Nothing new is added to the catalog: this system is shared, and a section built for one landing page is not everyone's. And nothing in `@brevy/ui` is edited or given a variant of its own, because a component that behaves differently on one page is the drift the catalog exists to prevent. Compose new sections out of what is there, and leave the parts themselves alone.",
      "Never a raw value. A hex in a class — `bg-[#\u2026]` — is wrong even when the colour is right, because the colour has a name: `bg-secondary`. The same goes for `p-[24px]` against `p-6` and `rounded-[16px]` against `rounded-2xl`. A hard-coded value is invisible to the theme and to the next change a token makes, so it looks correct exactly until something moves.",
    ],
  },
]

/** The path that was missing. */
export const CODE_INTRO =
  "The system is a package, @brevy/ui. Work in this repo and you import it straight from the workspace; work in a project of your own and you install it, and it brings its documentation with it."

/** A fenced block inside an install step: a command to run or a file to
 *  write. Kept as lines so the guard can hold each one to the package README,
 *  which carries the same steps and is the other place they are written. */
export type InstallCode = {
  lang: "sh" | "json" | "css"
  lines: readonly string[]
}

/** A step is its title and what follows it, prose and code in the order they
 *  are read. */
export type InstallStep = {
  title: string
  blocks: readonly (string | InstallCode)[]
}

export const INSTALLING: {
  id: string
  title: string
  body: string
  untested: string
  steps: readonly InstallStep[]
} = {
  id: "installing-it",
  title: "Installing it",
  body: "`@brevy/ui` is not on npm. Inside this repo the workspace resolves the import to the source, so a change to a component shows up in the catalog without a build step. A project of its own installs two tarballs built here — `@brevy/ui`, and `@brevy/tokens`, which carries the stylesheet — in the seven steps below.",
  untested:
    "These steps follow from the code and from the packed tarball, and have not yet been through an install in a separate project. Treat them as the expected path rather than a tested one: the token override in step 2 and the `@source` line in step 5 are what the first real install will confirm.",
  steps: [
    {
      title: "Get the two tarballs.",
      blocks: [
        "They are built in this repo, by anyone with access to it. Packing builds the package first and checks its documentation against the catalog, so a tarball cannot carry docs older than the code.",
        {
          lang: "sh",
          lines: [
            "pnpm --filter @brevy/ui pack --pack-destination <dir>",
            "pnpm --filter @brevy/tokens pack --pack-destination <dir>",
          ],
        },
      ],
    },
    {
      title: "Install them, and pin the tokens.",
      blocks: [
        "Copy both into the project, say into `vendor/`, and add them. Then pin `@brevy/tokens` in `package.json`: `@brevy/ui` depends on `@brevy/tokens@0.0.0`, which is on no registry, and without the override the install fails looking for it on npm. With npm the same field is `overrides`, at the top level.",
        {
          lang: "sh",
          lines: [
            "pnpm add ./vendor/brevy-ui-0.0.0.tgz ./vendor/brevy-tokens-0.0.0.tgz",
          ],
        },
        {
          lang: "json",
          lines: [
            '"pnpm": {',
            '  "overrides": { "@brevy/tokens": "file:./vendor/brevy-tokens-0.0.0.tgz" }',
            "}",
          ],
        },
      ],
    },
    {
      title: "The peer dependencies.",
      blocks: [
        "The package brings none of these with it. `react-hook-form` is needed even on a page with no form, because the one entry point re-exports `Form`, which imports it. `zod` and `@hookform/resolvers` are declared peers — the form's documentation validates with them.",
        {
          lang: "sh",
          lines: [
            "pnpm add react@19 react-dom@19 radix-ui lucide-react react-hook-form zod @hookform/resolvers",
          ],
        },
      ],
    },
    {
      title: "Tailwind 4.",
      blocks: [
        'The components are Tailwind 4 classes and the package ships no CSS of its own. Add a `postcss.config.mjs` with `plugins: ["@tailwindcss/postcss"]`.',
        {
          lang: "sh",
          lines: ["pnpm add -D tailwindcss@4 @tailwindcss/postcss@4"],
        },
      ],
    },
    {
      title: "The global stylesheet.",
      blocks: [
        "In this order, because the tokens build on Tailwind's palette. The `@source` line is not optional: Tailwind 4 does not scan `node_modules`, so without it every component renders unstyled. The path is relative to the stylesheet.",
        {
          lang: "css",
          lines: [
            '@import "tailwindcss";',
            '@import "@brevy/tokens/globals.css";',
            '@source "../node_modules/@brevy/ui/dist";',
          ],
        },
        "The tokens set no base styles, so the body takes them itself: `bg-background text-foreground font-sans antialiased`. Light is the default; dark is the class `dark` on `<html>`, with no provider.",
      ],
    },
    {
      title: "The typefaces.",
      blocks: [
        "Rethink Sans for text and Hedvig Letters Serif, weight 400, for headings. Load both with `next/font` as `--font-rethink-sans` and `--font-hedvig`, put the two variables on `<html>`, and point the tokens at them — `next/font` renames the families it loads, so without this the names in the token file never reach them.",
        {
          lang: "css",
          lines: [
            "@theme inline {",
            "  --font-sans: var(--font-rethink-sans), ui-sans-serif, system-ui, sans-serif;",
            "  --font-serif: var(--font-hedvig), ui-serif, Georgia, serif;",
            "}",
          ],
        },
        "Then render a `Button` to check. If it has no fill, the `@source` path is wrong.",
      ],
    },
    {
      title: "Tell Claude where the documentation is.",
      blocks: [
        "It travels inside the package, in `node_modules/@brevy/ui/dist/docs`: an index, one file per foundation, component, block and screen, and the rules for sections no block covers. Add the contents of `node_modules/@brevy/ui/dist/docs/claude-md-snippet.md` to the project's `CLAUDE.md`. Claude there then reads the index first and opens only what the page needs, rather than this catalog.",
      ],
    },
  ],
}

/** The steps as markdown, numbered, with each command in its own fence. The
 *  step's title leads its first paragraph, the way the page sets it. */
function installSteps() {
  return INSTALLING.steps.flatMap((step, index) => {
    const lead = `**${String(index + 1)}. ${step.title}**`

    return step.blocks.flatMap((block, position) =>
      typeof block === "string"
        ? [position === 0 ? `${lead} ${block}` : block, ""]
        : [
            ...(position === 0 ? [lead, ""] : []),
            "```" + block.lang,
            ...block.lines,
            "```",
            "",
          ],
    )
  })
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
  body: "Four places, and they are the same documentation in four shapes.",
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
  {
    where: "node_modules/@brevy/ui/dist/docs",
    what: "Every page as its own file, with an index to find them by, for Claude in a project that installs the package",
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
    STARTER,
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
    `### ${INSTALLING.title}`,
    "",
    INSTALLING.body,
    "",
    `*${INSTALLING.untested}*`,
    "",
    ...installSteps(),
    `### ${COMPOSING.title}`,
    "",
    COMPOSING.body,
    "",
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
