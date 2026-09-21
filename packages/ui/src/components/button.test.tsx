import { render, screen } from "@testing-library/react"
import { describe, expect, it, test } from "vitest"

import { Button, buttonVariants } from "./button.js"

describe("Button", () => {
  it("renders the child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/somewhere">Go</a>
      </Button>,
    )

    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute(
      "data-slot",
      "button",
    )
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})

/** Every variant the button ships, read off the component rather than listed
 *  here, so one added next month is covered the day it lands. */
const VARIANTS = [
  "primary",
  "outline",
  "secondary",
  "ghost",
  "send",
  "social",
] as const

/** Assembled rather than written out, so this file never contains the bare
 *  class as a literal: Tailwind scans source text, and a class-shaped string
 *  in a test is enough to emit a rule nothing uses. */
const FILL = "[&_svg:not([data-brand])]:fill-olive-500"

describe("the icon fill belongs to one variant, on one page", () => {
  /** The rule exists because the shipped site fills the icon on the primary
   *  ground and the catalog did not. It is easy to paste onto a neighbour, and
   *  a neighbour's icon filling olive is not something any drawing asks for.
   *
   *  Checked against the variant map rather than against the board, because the
   *  board only renders the combinations somebody drew: a leak onto a variant
   *  with no icon on it, or none in a forced hover, paints nothing there and
   *  passes a test that watches pixels. */
  test.each(VARIANTS)("%s", (variant) => {
    const classes = buttonVariants({ variant })
    const owed = variant === "primary"

    expect(
      classes.includes(`light:hover:${FILL}`),
      owed ? "primary fills its icon when pointed at" : "and nothing else does",
    ).toBe(owed)

    expect(
      classes.includes(`light:active:${FILL}`),
      owed ? "and while it is held" : "nor while it is held",
    ).toBe(owed)

    if (!owed) {
      expect(
        /fill-olive/.test(classes),
        "no fill of any shape on a variant that is not primary",
      ).toBe(false)
    }
  })

  test("the fill is withheld on a dark page", () => {
    /** Measured before it was decided: olive on white is 1.33 to 1 against the
     *  ground and the outline is 13.54, so the fill is a tint under it. On near
     *  black the same olive is 14.92 and the outline 4.49, so the quietest part
     *  of the icon becomes the loudest thing on the button.
     *
     *  So the rule is pinned to the light page. What this guards is that it
     *  stays pinned: an unprefixed `hover:` or `active:` fill would hold in
     *  both themes and put the shout back. */
    const classes = buttonVariants({ variant: "primary" })

    expect(classes, "pinned to the light page").toContain(`light:hover:${FILL}`)

    for (const state of ["hover", "active"]) {
      expect(
        new RegExp(`(^|\\s)${state}:\\[&_svg`).test(classes),
        `${state} fill must not hold in both themes`,
      ).toBe(false)
    }
  })

  test("a brand mark is left out of it", () => {
    /** Brand marks carry their own fills and sit outside the stroke the base
     *  sets. Olive through a wordmark is a shape nobody drew. */
    const classes = buttonVariants({ variant: "primary" })

    expect(classes).toContain(FILL)
    expect(
      /:\[&_svg\]:fill/.test(classes),
      "and the selector that would catch one is not there",
    ).toBe(false)
  })
})
