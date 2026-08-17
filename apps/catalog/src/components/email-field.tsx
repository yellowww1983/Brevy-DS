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
import { useForm } from "react-hook-form"

export function EmailField() {
  const form = useForm<{ email: string }>({
    defaultValues: { email: "not-an-email" },
  })

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
              <FormLabel>Email</FormLabel>
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
