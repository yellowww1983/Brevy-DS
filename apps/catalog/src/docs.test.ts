import { readdirSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import ts from "typescript"
import { describe, expect, test } from "vitest"

import { llmsFull, llmsMap } from "./llms"
import { registry } from "./registry"

/** Everything a doc claims has to be true of the package.
 *
 *  A block's page hands Claude a page of markdown, and the person reading it
 *  works from it: pastes the fenced example, reaches for a prop the table
 *  names. Those two are not prose about the system. They are claims about an
 *  API, and nothing was checking that the API agreed.
 *
 *  It went wrong exactly the way it was always going to. The media section's
 *  stepper was drawn with icons in its discs, the file turned out to draw
 *  pebbles, the component swapped `icon` for `tone`, and the snippet kept
 *  saying `icon` for a fortnight. Every page still read correctly. Only the
 *  pasted code was wrong, and the only reader who would find out was the one
 *  it was written for.
 *
 *  Two claims are checked. A fenced example has to compile. A row in a props
 *  table has to name a prop the component takes. The second arrived with the
 *  first component doc rather than after eleven more, because a hand-written
 *  table is the same mistake waiting in a place the compiler never looks.
 *
 *  Discovered rather than listed: the docs are found by reading the directory
 *  for exports whose name ends in `Doc`, so a block written next month is
 *  covered the day it ships instead of the day someone remembers this file. */

/** Through `fileURLToPath`, not `.pathname`: a URL keeps the escapes, and
 *  this repository lives in a directory with a space in its name. Resolved
 *  the other way the tsconfig beside it is simply never found, and the
 *  compiler falls back to defaults that have no JSX and no module
 *  resolution — which reads as fourteen broken snippets. */
const HERE = dirname(fileURLToPath(import.meta.url))

type Doc = { source: string; subject: string; markdown: string }
type Snippet = { source: string; code: string }
type Table = { source: string; subject: string; props: readonly string[] }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Every module beside this one that declares a doc.
 *
 *  Still read from the directory, even though the registry now lists what the
 *  catalog documents. The two answers have to agree: the registry is what the
 *  catalog will show and this is what somebody actually wrote, and a doc
 *  written but never wired into the registry is invisible in exactly the way
 *  nobody notices. */
function docModules(): string[] {
  return readdirSync(HERE)
    .filter((name) => /\.tsx?$/.test(name) && !name.endsWith(".test.ts"))
    .filter((name) =>
      /export function \w+Doc\b/.test(readFileSync(join(HERE, name), "utf8")),
    )
    .sort()
}

async function load(file: string): Promise<Record<string, unknown>> {
  const loaded: unknown = await import(pathToFileURL(join(HERE, file)).href)

  return isRecord(loaded) ? loaded : {}
}

/** What somebody wrote: every `*Doc` export in the directory, called. */
async function written(): Promise<Map<string, string>> {
  const found = new Map<string, string>()

  for (const path of docModules()) {
    for (const [name, value] of Object.entries(await load(path))) {
      if (!name.endsWith("Doc") || typeof value !== "function") {
        continue
      }

      const markdown: unknown = (value as () => unknown)()

      if (typeof markdown === "string") {
        found.set(`${path} · ${name}()`, markdown)
      }
    }
  }

  return found
}

/** What the catalog shows: every entry in the registry, asked for its doc.
 *
 *  This is the list under test, because it is the list a reader can reach.
 *  The docs are called rather than read: what matters is the markdown someone
 *  actually copies, and that is the return value. */
async function collect(): Promise<Doc[]> {
  const docs = await Promise.all(
    registry.map(async (entry) => {
      const markdown = await entry.doc()

      return {
        source: `${entry.kind} · ${entry.slug}`,
        subject: headingOf(markdown),
        markdown,
      }
    }),
  )

  return docs.sort((a, b) => a.source.localeCompare(b.source))
}

/** What the doc is about, taken from its own first heading. */
function headingOf(markdown: string): string {
  return /^# (.+)$/m.exec(markdown)?.[1]?.trim() ?? ""
}

function snippetsOf(markdown: string): string[] {
  const found: string[] = []
  let current: string[] | undefined

  for (const line of markdown.split("\n")) {
    if (line.trim() === "```tsx") {
      current = []
      continue
    }

    if (current && line.trim() === "```") {
      found.push(current.join("\n"))
      current = undefined
      continue
    }

    current?.push(line)
  }

  return found
}

/** Every props table a doc writes, and what each one is about.
 *
 *  A table is found by its first column's heading rather than by position, so
 *  a doc can put one wherever it reads best, and by the start of that heading
 *  rather than the whole of it: a doc that says Property or Props is still
 *  writing a props table, and the alternative is a rename quietly taking a
 *  table out of the suite.
 *
 *  A doc can write more than one, because a family is documented together —
 *  the form's label takes different props from its field. Each table belongs
 *  to the nearest heading above it that names something the package exports,
 *  and to the doc's own subject when no heading does. So `## Props` under
 *  `# Button` is Button's, and a `### FormLabel` under it is FormLabel's,
 *  without either doc saying so twice.
 *
 *  The names come back stripped of the backticks the table sets them in. */
function tablesOf(
  markdown: string,
  subject: string,
  exports: ReadonlySet<string>,
): { subject: string; props: string[] }[] {
  const lines = markdown.split("\n")
  const found: { subject: string; props: string[] }[] = []
  const headings: string[] = []

  for (const [index, line] of lines.entries()) {
    const heading = /^#+ (.+)$/.exec(line)?.[1]?.trim()

    if (heading) {
      headings.unshift(heading)
      continue
    }

    if (!/^\|\s*Prop/i.test(line)) {
      continue
    }

    const props: string[] = []

    for (const row of lines.slice(index + 2)) {
      if (!row.startsWith("|")) {
        break
      }

      const first = row.split("|")[1]?.trim().replaceAll("`", "")

      if (first) {
        props.push(first)
      }
    }

    found.push({
      subject: headings.find((name) => exports.has(name)) ?? subject,
      props,
    })
  }

  return found
}

const docs = await collect()

const snippets: Snippet[] = docs.flatMap((doc) =>
  snippetsOf(doc.markdown).map((code) => ({ source: doc.source, code })),
)

const exported = packageExports()

const tables: Table[] = docs.flatMap((doc) =>
  tablesOf(doc.markdown, doc.subject, exported).map((table) => ({
    source: `${doc.source} · ${table.subject}`,
    subject: table.subject,
    props: table.props,
  })),
)

/** Components a snippet uses without importing, on purpose.
 *
 *  A snippet may stand something in that the reader brings themselves — the
 *  band's marks are the reader's own logos and the system deliberately ships
 *  none. That is a short list and it is written down, so an import someone
 *  simply forgot cannot hide inside it. */
const BRING_YOUR_OWN = new Set(["PartnerMark"])

/** What the compiler says about a name that is not in scope.
 *
 *  2304 is the plain form and 18004 is the shorthand property inside
 *  `{ title, description }`. 2552 is 2304 with a spelling suggestion, which
 *  the compiler reaches for whenever something similar is in scope — so a
 *  snippet's `steps` becomes "did you mean 'Steps'?" purely because it
 *  imported the component beside it. Reading only 2304 leaves those
 *  undeclared and every such snippet fails for the wrong reason. */
const UNRESOLVED = new Set([2304, 2552, 18004])

/** Names a snippet leaves for the reader to fill in: `heading`, `picture`,
 *  the shorthand inside `{ title, description }`. They are placeholders by
 *  construction, so the compiler is told they exist and the check is about
 *  what the snippet does with them. */
function placeholders(diagnostics: readonly ts.Diagnostic[]): string[] {
  const names = new Set<string>()

  for (const diagnostic of diagnostics) {
    if (!UNRESOLVED.has(diagnostic.code)) {
      continue
    }

    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")
    const name = /'([^']+)'/.exec(message)?.[1]

    if (name) {
      names.add(name)
    }
  }

  return [...names]
}

function importedNames(code: string): Set<string> {
  const names = new Set<string>()

  for (const match of code.matchAll(/import\s*\{([^}]*)\}\s*from/g)) {
    for (const part of (match[1] ?? "").split(",")) {
      const name = part.trim().replace(/^type\s+/, "")

      if (name) {
        names.add(name)
      }
    }
  }

  return names
}

function elementNames(code: string): Set<string> {
  const names = new Set<string>()

  for (const match of code.matchAll(/<([A-Z][A-Za-z0-9]*)/g)) {
    if (match[1]) {
      names.add(match[1])
    }
  }

  return names
}

/** The catalog's own settings, so what a doc claims is judged by the rules
 *  the app it belongs to is judged by rather than by a second set that could
 *  drift. */
function compilerOptions(): ts.CompilerOptions {
  const path = resolve(HERE, "../tsconfig.json")
  const { config } = ts.readConfigFile(path, (file) =>
    readFileSync(file, "utf8"),
  ) as { config: unknown }

  const parsed = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    dirname(path),
    undefined,
    path,
  )

  return { ...parsed.options, noEmit: true, types: [] }
}

/** What a snippet is not held to.
 *
 *  All three are consequences of standing in for the reader rather than
 *  claims a doc makes. A snippet is a fragment, wrapped in a component to be
 *  compiled at all, and the wrapper is not under test. And the names the
 *  reader supplies are stubbed as `any`, so anything downstream of one has no
 *  type to inherit: `people.map((person) => ...)` reads as an implicit any
 *  here and as nothing at all on a page where `people` is a real array.
 *
 *  None of it touches what is being checked, which is what the snippet names:
 *  its imports, its props, and the shape it gives an object. */
const STANDING_IN: ts.CompilerOptions = {
  noUnusedLocals: false,
  noUnusedParameters: false,
  noImplicitAny: false,
}

/** A compiler that reads one file out of memory and everything else off disk,
 *  so a made-up module sitting where the catalog's own pages sit resolves
 *  `@brevy/ui` and `react` the way they do. */
function compiler(file: string, overrides: ts.CompilerOptions = {}) {
  const options = { ...compilerOptions(), ...overrides }
  let contents = ""

  const host = ts.createCompilerHost(options, true)
  const original = host.getSourceFile.bind(host)

  host.getSourceFile = (name, ...rest) =>
    name === file
      ? ts.createSourceFile(
          name,
          contents,
          ts.ScriptTarget.ES2022,
          true,
          ts.ScriptKind.TSX,
        )
      : original(name, ...rest)
  host.fileExists = (name) => name === file || ts.sys.fileExists(name)
  host.readFile = (name) => (name === file ? contents : ts.sys.readFile(name))

  return (source: string) => {
    contents = source
    const program = ts.createProgram([file], options, host)

    return { program, source: program.getSourceFile(file) }
  }
}

function diagnosticsOf(program: ts.Program, source: ts.SourceFile | undefined) {
  return source
    ? [
        ...program.getSemanticDiagnostics(source),
        ...program.getSyntacticDiagnostics(source),
      ]
    : []
}

/** The snippet's imports, and everything under them.
 *
 *  An import runs to wherever its `from` is rather than to the end of its
 *  first line: a form pulling nine names in reads as nine lines and would
 *  otherwise have eight of them land in the body, where they parse as
 *  something else entirely. The guard is not allowed to decide how a doc
 *  formats itself. */
function split(code: string): { imports: string; body: string } {
  const imports: string[] = []
  const body: string[] = []
  let running = false

  for (const line of code.split("\n")) {
    if (running) {
      imports.push(line)
      running = !line.includes(" from ")
      continue
    }

    if (line.startsWith("import ")) {
      imports.push(line)
      running = !line.includes(" from ") && !/^import ["']/.test(line)
      continue
    }

    body.push(line)
  }

  return { imports: imports.join("\n"), body: body.join("\n").trim() }
}

/** Compiles one snippet where it lives. Returns whatever the compiler still
 *  objects to once the reader's placeholders are declared. */
function check(code: string): readonly ts.Diagnostic[] {
  const run = compiler(join(HERE, "__snippet__.tsx"), STANDING_IN)

  const { imports, body } = split(code)

  /** A snippet is either an expression or a module.
   *
   *  Most are an expression: one element with the reader's values in it,
   *  which has to be wrapped in something before a compiler will look at it.
   *  A component that needs a hook cannot be written that way — the form's
   *  does, because where `useForm` goes is half of what there is to say — so
   *  a snippet that opens with anything other than an element is compiled as
   *  it stands. */
  const expression = body.startsWith("<")

  const wrap = (declarations: string) =>
    expression
      ? `${imports}\n${declarations}\nexport function Snippet() {\n  return (\n    <>\n${body}\n    </>\n  )\n}\n`
      : `${imports}\n${declarations}\n${body}\n`

  const first = run(wrap(""))

  /** Two passes. The first asks the compiler which names the reader is meant
   *  to supply; the second declares those and holds the snippet to everything
   *  else. A name that is missing from `@brevy/ui` is never among them — that
   *  is an error on the import line, not on a use of it, so it survives both
   *  passes and fails the test. */
  const declarations = placeholders(diagnosticsOf(first.program, first.source))
    /** The reader's value, so the reader's type. It has to be assignable to
     *  whatever prop it is handed and usable as a component — a stand-in
     *  mark is written `<PartnerMark />`, and nothing narrower can be both.
     *  What stays under test is what the snippet does around them: which
     *  props it names, which it leaves out, what shape it gives an item. */
    .map((name) => `declare const ${name}: any`)
    .join("\n")

  const second = run(wrap(declarations))

  return diagnosticsOf(second.program, second.source)
}

/** Every name `@brevy/ui` exports, so a heading can be recognised as naming
 *  one. Asked of the compiler for the same reason everything else here is:
 *  the alternative is a second list of the package's contents, kept by
 *  hand. */
function packageExports(): ReadonlySet<string> {
  const run = compiler(join(HERE, "__exports__.tsx"))
  const { program, source } = run(
    [
      `import * as ui from "@brevy/ui"`,
      `export declare const probe: typeof ui`,
      "",
    ].join("\n"),
  )

  const names = new Set<string>()

  if (source) {
    const checker = program.getTypeChecker()

    ts.forEachChild(source, (node) => {
      if (!ts.isVariableStatement(node)) {
        return
      }

      const [declaration] = node.declarationList.declarations

      if (!declaration) {
        return
      }

      for (const property of checker.getPropertiesOfType(
        checker.getTypeAtLocation(declaration),
      )) {
        names.add(property.getName())
      }
    })
  }

  return names
}

/** Every property of a type, and of each branch where the type is a union.
 *
 *  A component can take one shape or another: the accordion holds one panel
 *  open or several, and `collapsible` means something only in the first. TS
 *  answers a union with the properties its branches share, which leaves
 *  every prop that tells the branches apart looking like a prop that does not
 *  exist. Asking each branch and taking them together is what a doc is
 *  actually claiming — that a reader can pass this — and which branch it
 *  belongs to is prose. */
function propertiesIn(checker: ts.TypeChecker, type: ts.Type): ts.Symbol[] {
  return type.isUnion()
    ? type.types.flatMap((branch) => propertiesIn(checker, branch))
    : checker.getPropertiesOfType(type)
}

/** Every prop the component really takes, asked of the compiler rather than
 *  read off its source.
 *
 *  `ComponentProps<typeof X>` is the whole surface: the component's own
 *  variants, whatever HTML element it renders, and the aria attributes that
 *  come with it. So `variant` and `aria-label` are both in it and the table
 *  needs no second column saying which kind a row is. */
function propertiesOf(component: string): {
  names: Set<string>
  diagnostics: readonly ts.Diagnostic[]
} {
  const run = compiler(join(HERE, "__props__.tsx"))
  const { program, source } = run(
    [
      `import { ${component} } from "@brevy/ui"`,
      `import type { ComponentProps } from "react"`,
      `export declare const probe: ComponentProps<typeof ${component}>`,
      "",
    ].join("\n"),
  )

  const diagnostics = diagnosticsOf(program, source)
  const names = new Set<string>()

  if (source) {
    const checker = program.getTypeChecker()

    ts.forEachChild(source, (node) => {
      if (!ts.isVariableStatement(node)) {
        return
      }

      const [declaration] = node.declarationList.declarations

      if (!declaration) {
        return
      }

      for (const property of propertiesIn(
        checker,
        checker.getTypeAtLocation(declaration),
      )) {
        names.add(property.getName())
      }
    })
  }

  return { names, diagnostics }
}

function report(diagnostics: readonly ts.Diagnostic[]) {
  return diagnostics
    .map((diagnostic) => {
      const text = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")
      return `TS${String(diagnostic.code)}: ${text}`
    })
    .join("\n")
}

test("everything written is in the registry, and everything in it is checked", async () => {
  /** The suite discovers its own subjects, so the way it fails quietly is by
   *  discovering fewer of them. Two counts have to agree and neither is
   *  written down here: what the registry lists, and what somebody wrote.
   *
   *  A doc written and never wired in is the failure this merge introduced —
   *  before it, a doc was found by being in the directory, and now it is
   *  found by being in the registry. */
  const authored = await written()
  const shown = new Set(docs.map((doc) => doc.markdown))

  expect(docs.length).toBe(authored.size)

  const orphans = [...authored]
    .filter(([, markdown]) => !shown.has(markdown))
    .map(([source]) => source)

  expect(orphans, "written but not in the registry").toEqual([])
})

test("the map lists everything, and loads none of it", () => {
  const map = llmsMap()

  /** The convention's own shape: one heading, a summary quoted under it, and
   *  the links in sections below. */
  expect(map.startsWith("# Brevy Design System\n\n> ")).toBe(true)
  expect(map.match(/^# .+$/gm)).toHaveLength(1)
  expect(map.match(/^## .+$/gm)).toEqual([
    "## Foundations",
    "## Components",
    "## Blocks",
    "## Optional",
  ])

  /** Every entry, once, as a link with its own summary beside it. */
  for (const entry of registry) {
    expect(map, entry.slug).toContain(
      `- [${entry.name}](${entry.href}): ${entry.summary}`,
    )
  }

  expect(map.match(/^- \[/gm)).toHaveLength(registry.length)

  /** And no documentation in it. The map is what an agent reads to decide
   *  what to fetch, so a doc's worth of prose in here defeats the point. */
  for (const doc of docs) {
    expect(map.includes(doc.markdown), doc.source).toBe(false)
  }
})

test("the whole system is the sum of its pages, unedited", async () => {
  const full = await llmsFull()

  /** Every page, exactly as that page hands it over. A doc rewritten on the
   *  way through would make this a third version of the same text, and the
   *  only way to know it had drifted would be to read all thirty-three. */
  for (const doc of docs) {
    expect(full.includes(doc.markdown), doc.source).toBe(true)
  }

  /** In the registry's order, which reads as a document: the tokens, then the
   *  parts, then the sections built out of them. */
  const positions = docs
    .map((doc) => full.indexOf(doc.markdown))
    .filter((at) => at >= 0)

  expect(positions).toHaveLength(registry.length)

  const inOrder = registry.map((entry) => entry.slug)
  const met = registry
    .map((entry) => ({
      slug: entry.slug,
      at: full.indexOf(
        docs.find((doc) => doc.source.endsWith(` · ${entry.slug}`))?.markdown ??
          "\u0000",
      ),
    }))
    .sort((a, b) => a.at - b.at)
    .map((entry) => entry.slug)

  expect(met).toEqual(inOrder)
})

test("every doc that makes a checkable claim hands it over", () => {
  /** And the claims inside them are found too: a fence written differently,
   *  a heading reworded, and thirty checks become zero without one of them
   *  going red. Whichever docs say `\`\`\`tsx` or write a props table have to
   *  turn up, and the count comes from the docs rather than from a number. */
  expect(docs.filter((doc) => doc.markdown.includes("```tsx")).length).toBe(
    new Set(snippets.map(({ source }) => source)).size,
  )

  expect(docs.filter((doc) => /^\|\s*Prop/im.test(doc.markdown)).length).toBe(
    new Set(
      tables.map(({ source }) => source.split(" · ").slice(0, 2).join(" · ")),
    ).size,
  )
})

describe.each(snippets)("$source", ({ code }) => {
  test("uses only components it imports, or ones the reader brings", () => {
    const imported = importedNames(code)
    const missing = [...elementNames(code)].filter(
      (name) => !imported.has(name) && !BRING_YOUR_OWN.has(name),
    )

    expect(missing, "not imported and not a documented stand-in").toEqual([])
  })

  test("compiles against the package it documents", () => {
    expect(report(check(code)), code).toBe("")
  })
})

describe.each(tables)("$source", ({ subject, props }) => {
  test("names only props the component takes", () => {
    expect(subject, "the doc's heading names what it documents").not.toBe("")

    const { names, diagnostics } = propertiesOf(subject)

    expect(report(diagnostics), `asking ${subject} for its props`).toBe("")
    expect(props.length).toBeGreaterThan(0)

    const missing = props.filter((prop) => !names.has(prop))

    expect(missing, `documented but not on ${subject}`).toEqual([])
  })
})
