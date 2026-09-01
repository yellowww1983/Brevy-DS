import { readdirSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import ts from "typescript"
import { describe, expect, test } from "vitest"

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
 *  Read from the directory rather than from a list, so a block written next
 *  month is covered the day it ships instead of the day someone remembers
 *  this file. The source is grepped first and only the matches are loaded:
 *  the test is about docs, and there is no reason for it to pull in the
 *  component registry and everything the registry draws. */
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

/** The docs are called rather than read: what matters is the markdown a
 *  reader actually copies, and that is the return value. A doc assembled from
 *  a table or a preset comes out different from its own source text. */
async function collect(): Promise<Doc[]> {
  const docs: Doc[] = []

  for (const path of docModules()) {
    for (const [name, value] of Object.entries(await load(path))) {
      if (!name.endsWith("Doc") || typeof value !== "function") {
        continue
      }

      const markdown: unknown = (value as () => unknown)()

      if (typeof markdown !== "string") {
        continue
      }

      docs.push({
        source: `${path} · ${name}()`,
        subject: headingOf(markdown),
        markdown,
      })
    }
  }

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

/** The names in the first column of the props table, if the doc writes one.
 *
 *  Found by its heading rather than by position, so a doc can put the table
 *  wherever it reads best, and by the start of that heading rather than the
 *  whole of it: a doc that says Property or Props is still writing a props
 *  table, and the alternative is a rename quietly taking a table out of the
 *  suite. The names come back stripped of the backticks the table sets them
 *  in. */
function propsOf(markdown: string): string[] | undefined {
  const lines = markdown.split("\n")
  const start = lines.findIndex((line) => /^\|\s*Prop/i.test(line))

  if (start === -1) {
    return undefined
  }

  const props: string[] = []

  for (const line of lines.slice(start + 2)) {
    if (!line.startsWith("|")) {
      break
    }

    const first = line.split("|")[1]?.trim().replaceAll("`", "")

    if (first) {
      props.push(first)
    }
  }

  return props
}

const docs = await collect()

const snippets: Snippet[] = docs.flatMap((doc) =>
  snippetsOf(doc.markdown).map((code) => ({ source: doc.source, code })),
)

const tables: Table[] = docs.flatMap((doc) => {
  const props = propsOf(doc.markdown)

  return props ? [{ source: doc.source, subject: doc.subject, props }] : []
})

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

  return {
    ...parsed.options,
    noEmit: true,
    /** A snippet is a fragment. It is wrapped in a component to be compiled
     *  at all, and the wrapper is not what is under test. */
    noUnusedLocals: false,
    noUnusedParameters: false,
    types: [],
  }
}

/** A compiler that reads one file out of memory and everything else off disk,
 *  so a made-up module sitting where the catalog's own pages sit resolves
 *  `@brevy/ui` and `react` the way they do. */
function compiler(file: string) {
  const options = compilerOptions()
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

/** Compiles one snippet where it lives. Returns whatever the compiler still
 *  objects to once the reader's placeholders are declared. */
function check(code: string): readonly ts.Diagnostic[] {
  const run = compiler(join(HERE, "__snippet__.tsx"))

  const imports = code
    .split("\n")
    .filter((line) => line.startsWith("import "))
    .join("\n")

  const body = code
    .split("\n")
    .filter((line) => !line.startsWith("import "))
    .join("\n")
    .trim()

  const wrap = (declarations: string) =>
    `${imports}\n${declarations}\nexport function Snippet() {\n  return (\n    <>\n${body}\n    </>\n  )\n}\n`

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

      for (const property of checker.getPropertiesOfType(
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

test("every doc that makes a checkable claim hands it over", () => {
  /** The suite discovers its own subjects, so the way it fails quietly is by
   *  discovering nothing — a fence written differently, a heading reworded,
   *  and thirty checks become zero without one of them going red. Whichever
   *  modules say `\`\`\`tsx` or write a props table in their source have to
   *  turn up here, and the count is taken from the source rather than written
   *  down. */
  const claims = (marker: string, found: readonly { source: string }[]) => {
    const writing = docModules().filter((file) =>
      readFileSync(join(HERE, file), "utf8").includes(marker),
    )

    expect(writing.length, marker).toBeGreaterThan(0)

    const checked = new Set(found.map(({ source }) => source.split(" · ")[0]))

    return writing.filter((file) => !checked.has(file))
  }

  expect(claims("```tsx", snippets)).toEqual([])
  expect(claims('"Prop', tables)).toEqual([])
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
