"use client"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@brevy/ui"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

/** One field under the form's wiring, in the states the app file draws.
 *
 *  `invalid` seeds a value the rule refuses and validates it on mount, so the
 *  error the preview shows is react-hook-form actually failing — the same
 *  `aria-invalid` ring the Input's own states board measures — rather than a
 *  class pretending to. `withLink` puts the drawn `Forgot your password?` in
 *  the label's row (`20786:176978`). */
export function EmailField({
  invalid,
  withLink,
}: {
  invalid?: boolean
  withLink?: boolean
}) {
  const form = useForm<{ email: string }>({
    defaultValues: { email: invalid ? "not-an-email" : "" },
  })
  const { trigger } = form

  useEffect(() => {
    if (invalid) {
      void trigger("email")
    }
  }, [invalid, trigger])

  return (
    <Form {...form}>
      <form className="w-full">
        <FormField
          control={form.control}
          name="email"
          rules={{
            pattern: {
              value: /.+@.+\..+/,
              message: "Enter a valid email address.",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel
                action={withLink ? <a href="#help">Need a hand?</a> : undefined}
              >
                Email
              </FormLabel>
              <FormControl>
                <Input placeholder="hello@brevy.com" {...field} />
              </FormControl>
              <FormDescription>Used for shift notifications.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
