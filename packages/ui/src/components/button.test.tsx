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

describe("the icon fill belongs to one variant", () => {
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
      classes.includes("hover:[&_svg:not([data-brand])]:fill-olive-500"),
      owed ? "primary fills its icon when pointed at" : "and nothing else does",
    ).toBe(owed)

    expect(
      classes.includes("active:[&_svg:not([data-brand])]:fill-olive-500"),
      owed ? "and while it is held" : "nor while it is held",
    ).toBe(owed)

    if (!owed) {
      expect(
        /fill-olive/.test(classes),
        "no fill of any shape on a variant that is not primary",
      ).toBe(false)
    }
  })

  test("a brand mark is left out of it", () => {
    /** Brand marks carry their own fills and sit outside the stroke the base
     *  sets. Olive through a wordmark is a shape nobody drew. */
    expect(buttonVariants({ variant: "primary" })).toContain(
      "[&_svg:not([data-brand])]:fill-olive-500",
    )
    expect(buttonVariants({ variant: "primary" })).not.toMatch(
      /hover:\[&_svg\]:fill/,
    )
  })
})
