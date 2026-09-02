import { readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Badge } from "./components/badge.js"
import { IllustrationPanel } from "./components/illustration-panel.js"
import { Marker } from "./components/marker.js"
import { ShapedImage } from "./components/shaped-image.js"
import { StatFigure } from "./components/stat-figure.js"

/** A component's `data-slot` is its own, and a caller cannot take it.
 *
 *  Every component here names itself with one, and everything that finds a
 *  component finds it that way: the specs, the frames, and one component
 *  styling the inside of another. Which makes it a name rather than a label,
 *  and a name a caller can overwrite by accident is not one.
 *
 *  It was overwritten by accident three times — the illustration panel, the
 *  marker and the shaped image — and each time in the same way. The component
 *  wrote its slot and then spread the caller's props over the top, so a call
 *  site that passed a slot of its own silently won. Nothing broke where it was
 *  written; a spec somewhere else stopped finding an element that was still
 *  on the page under another name.
 *
 *  The fix is the order, and this file is what keeps it: the slot goes after
 *  the spread, so the component has the last word. */

const HERE = dirname(fileURLToPath(import.meta.url))

function sources(from: string): string[] {
  return readdirSync(from).flatMap((name) => {
    const path = join(from, name)

    if (statSync(path).isDirectory()) {
      return sources(path)
    }

    return path.endsWith(".tsx") && !path.endsWith(".test.tsx") ? [path] : []
  })
}

/** Opening tags that both name a slot and spread something over it.
 *
 *  `data-slot="` with the quote, because a class name can carry the words
 *  `data-slot=avatar` inside a selector and that is not an attribute. */
function overwritable(source: string): number[] {
  const lines: number[] = []

  for (const match of source.matchAll(/<[A-Za-z][\w.]*\s[^>]*?\/?>/gs)) {
    const tag = match[0]
    const slot = tag.indexOf('data-slot="')
    const spread = /\{\.\.\.\s*\w+\s*\}/.exec(tag)

    if (slot !== -1 && spread && slot < spread.index) {
      lines.push(source.slice(0, match.index).split("\n").length)
    }
  }

  return lines
}

test("no component writes its slot before spreading a caller's props", () => {
  const offenders = sources(HERE).flatMap((path) => {
    const found = overwritable(readFileSync(path, "utf8"))

    return found.map((line) => `${path.replace(HERE, "")}:${String(line)}`)
  })

  expect(
    offenders,
    "the spread would win and the slot would be the caller's",
  ).toEqual([])
})

/** And the order does what the order is for. The scan above reads the source;
 *  these render the thing. */
describe.each([
  ["Badge", <Badge data-slot="hijacked">Draft</Badge>, "badge"],
  [
    "IllustrationPanel",
    <IllustrationPanel data-slot="hijacked" />,
    "illustration-panel",
  ],
  ["Marker", <Marker data-slot="hijacked">1</Marker>, "marker"],
  ["ShapedImage", <ShapedImage data-slot="hijacked" />, "shaped-image"],
  ["StatFigure", <StatFigure data-slot="hijacked" value="78" />, "stat-figure"],
] as const)("%s", (_name, element, slot) => {
  test("keeps its own slot when a caller passes one", () => {
    const { container } = render(element)

    expect(container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull()
    expect(screen.queryByTestId("hijacked")).toBeNull()
    expect(container.querySelector('[data-slot="hijacked"]')).toBeNull()
  })
})
