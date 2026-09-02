import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import { describe, expect, it } from "vitest"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form.js"
import { Input } from "./input.js"

function EmailForm() {
  const form = useForm<{ email: string }>({ defaultValues: { email: "" } })

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          void form.handleSubmit(() => undefined)(event)
        }}
      >
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>We never share it.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  )
}

describe("Form", () => {
  it("associates the label with the control", () => {
    render(<EmailForm />)

    const input = screen.getByLabelText("Email")
    expect(input.tagName).toBe("INPUT")

    /** And it is still an input while it is one. `FormControl` renders no
     *  element of its own, so what it carries lands on the control inside it
     *  — including, until it was taken out, a slot that renamed every field
     *  in the system to `form-control`. */
    expect(input).toHaveAttribute("data-slot", "input")
  })

  it("points aria-describedby at the description while valid", () => {
    render(<EmailForm />)

    const input = screen.getByLabelText("Email")
    const description = screen.getByText("We never share it.")

    expect(input).toHaveAttribute("aria-describedby", description.id)
    expect(input).toHaveAttribute("aria-invalid", "false")
  })

  it("exposes the validation message and links it on error", async () => {
    render(<EmailForm />)

    await userEvent.click(screen.getByRole("button", { name: "Submit" }))

    const input = screen.getByLabelText("Email")
    const message = await screen.findByText("Email is required")

    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input.getAttribute("aria-describedby")).toContain(message.id)
  })
})
