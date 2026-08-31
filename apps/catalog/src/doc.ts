/** Every foundation page can hand itself to Claude as text. The prose lives as
 *  markdown beside the data the page renders, so the page and the copy are one
 *  source rather than two that drift. */

export function preamble(
  name: string,
  kind: "foundation" | "block" | "screen" = "foundation",
) {
  if (kind === "screen") {
    return `This is documentation for the ${name} screen from the Brevy design system. Use it to help me use the screen correctly.`
  }

  return kind === "block"
    ? `This is documentation for the ${name} block from the Brevy design system. Use it to help me use the block correctly.`
    : `This is documentation for the ${name} foundation from the Brevy design system. Use it to help me apply these tokens correctly.`
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
