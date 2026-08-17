import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "./button.js"

describe("Button", () => {
  it("marks a loading button as busy and disabled", () => {
    render(<Button loading>Save</Button>)

    const button = screen.getByRole("button", { name: "Save" })
    expect(button).toHaveAttribute("aria-busy", "true")
    expect(button).toBeDisabled()
  })

  it("keeps an explicit disabled={false} while loading out of the busy state only", () => {
    render(<Button loading={false}>Save</Button>)

    const button = screen.getByRole("button", { name: "Save" })
    expect(button).not.toHaveAttribute("aria-busy")
    expect(button).toBeEnabled()
  })

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

  it("does not inject the spinner into a slotted child", () => {
    const { container } = render(
      <Button asChild loading>
        <a href="/somewhere">Go</a>
      </Button>,
    )

    expect(container.querySelector("svg")).toBeNull()
  })
})
