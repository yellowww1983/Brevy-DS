import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "./button.js"

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
