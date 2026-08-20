/** Every foundation page can hand itself to Claude as text. The prose lives as
 *  markdown beside the data the page renders, so the page and the copy are one
 *  source rather than two that drift. */

export function preamble(foundation: string) {
  return `This is documentation for the ${foundation} foundation from the Brevy design system. Use it to help me apply these tokens correctly.`
}

export function table(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ]
}

export function join(lines: readonly (string | readonly string[])[]) {
  return lines
    .flat()
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()
}
