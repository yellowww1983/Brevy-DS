import { NO_CODE } from "./how-to-use"
import { registry, type Entry, type Kind } from "./registry"

/** The documentation `@brevy/ui` carries inside itself.
 *
 *  A project that installs the package has no catalog to open and nothing to
 *  paste. What it has is `node_modules`, so the registry is written out there
 *  as files: one per entry, an index to find them by, and the rules for the
 *  sections no block covers. Claude in that project reads the index, then
 *  only the pages it needs, which is the whole reason these are separate files
 *  rather than one `llms-full.txt`.
 *
 *  Every entry's file is that entry's `doc()`, byte for byte — the same text
 *  its catalog page hands over. Nothing here rewrites it, so the package and
 *  the catalog cannot say two different things; they can only be built at two
 *  different times, and the build is what guards that. */

/** Where the files land inside the built package. */
export const DOCS_DIR = "dist/docs"

const FOLDERS: Record<Kind, string> = {
  foundation: "foundations",
  component: "components",
  block: "blocks",
  screen: "screens",
}

const SECTIONS: readonly { title: string; kind: Kind }[] = [
  { title: "Foundations", kind: "foundation" },
  { title: "Components", kind: "component" },
  { title: "Blocks", kind: "block" },
  { title: "Screens", kind: "screen" },
]

/** An entry's file, relative to the docs directory. */
export function pathOf(entry: Pick<Entry, "kind" | "slug">) {
  return `${FOLDERS[entry.kind]}/${entry.slug}.md`
}

/** A file the page points at by its public URL. Those files live in the
 *  catalog's `public/`, and a path like `/people/mw.jpg` resolves to nothing
 *  in a project that only installed the package. */
const ASSET =
  /(?<![\w.])\/[\w-]+(?:\/[\w.-]+)*\.(?:webp|png|jpe?g|svg|gif|json|lottie|mp4|webm)\b/

export function namesCatalogAssets(markdown: string) {
  return ASSET.test(markdown)
}

/** The section of How to use that says what to do when there is no block.
 *  Found by id rather than by position, so reordering that page cannot hand
 *  the package a different section. */
function improvisation() {
  const section = NO_CODE.find(
    (candidate) => candidate.id === "when-you-need-something-else",
  )

  if (!section) {
    throw new Error("How to use has lost its when-you-need-something-else")
  }

  return section
}

function rules() {
  const section = improvisation()

  return [
    `# ${section.title}`,
    "",
    ...section.body.flatMap((paragraph) => [paragraph, ""]),
  ]
    .join("\n")
    .trimEnd()
}

function index(docs: ReadonlyMap<Entry, string>) {
  const row = (entry: Entry) => {
    const note = namesCatalogAssets(docs.get(entry) ?? "")
      ? " _Names files that live in the catalog, not in this package._"
      : ""

    return `- [${entry.name}](${pathOf(entry)}): ${entry.summary}${note}`
  }

  return [
    "# @brevy/ui documentation",
    "",
    "Every foundation, component, block and screen in `@brevy/ui`, one file each. Each file is the text of that entry's page in the Brevy catalog, generated from the catalog's registry when this package was built.",
    "",
    "Read this list first, then open only the files for the parts the page needs. Before building a section that no block covers, read [rules.md](rules.md).",
    "",
    "Some pages name artwork by its path in the catalog, such as `/people/mw.jpg`. Those files live in the catalog, not in this package, and the paths will not resolve in your project. Those pages are marked below.",
    "",
    ...SECTIONS.flatMap((section) => {
      const entries = registry.filter((entry) => entry.kind === section.kind)

      return entries.length === 0
        ? []
        : [`## ${section.title}`, "", ...entries.map(row), ""]
    }),
  ]
    .join("\n")
    .trimEnd()
}

/** What a consuming project puts in its own CLAUDE.md. The package cannot
 *  put itself in front of Claude; this is the line that does. The paths are
 *  spelled out because search skips `node_modules` — the files can be opened
 *  but not found. */
function claudeMdSnippet() {
  const root = `node_modules/@brevy/ui/${DOCS_DIR}`

  return [
    "## @brevy/ui",
    "",
    "Pages in this project are built from `@brevy/ui`. Its documentation ships inside the package, one markdown file per foundation, component, block and screen.",
    "",
    `- Start with \`${root}/index.md\`. It lists every entry with one line each and the file that documents it.`,
    "- Open only the files for the parts the page needs.",
    `- Before building a section that no block covers, read \`${root}/rules.md\`.`,
    "",
    "Open these files by path. Search skips `node_modules`, so it will not find them on its own.",
  ].join("\n")
}

/** Every file the package carries, keyed by its path under `dist/docs`. */
export async function packageDocs(): Promise<Map<string, string>> {
  const docs = new Map<Entry, string>(
    await Promise.all(
      registry.map(async (entry) => [entry, await entry.doc()] as const),
    ),
  )

  const files = new Map<string, string>([
    ["index.md", index(docs)],
    ["rules.md", rules()],
    ["claude-md-snippet.md", claudeMdSnippet()],
  ])

  for (const [entry, markdown] of docs) {
    files.set(pathOf(entry), markdown)
  }

  return files
}
