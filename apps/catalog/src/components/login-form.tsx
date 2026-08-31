"use client"

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@brevy/ui"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { PRESET } from "@/auth"

type Values = { password: string; confirm: string }

/** The eye that reveals a password: a real button over the field's trailing
 *  edge, drawn 16 square in the placeholder's grey. Revealing is a page
 *  behaviour rather than the Input's, which is why it lives here and the
 *  component only offers the slot. */
function Reveal({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      data-slot="reveal"
      aria-label={shown ? "Hide password" : "Show password"}
      aria-pressed={shown}
      onClick={onToggle}
      className="flex rounded-xs hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {shown ? <EyeOff /> : <Eye />}
    </button>
  )
}

/** The drawn form: create a password, repeat it, continue. The validation is
 *  the helper's own claim — at least 8 characters — plus the pair agreeing,
 *  which is what a confirm field is for. */
export function LoginForm() {
  const [shown, setShown] = useState(false)
  const form = useForm<Values>({
    defaultValues: { password: "", confirm: "" },
  })

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit(() => undefined)(event)
        }}
      >
        <FormField
          control={form.control}
          name="password"
          rules={{
            minLength: { value: 8, message: "Use at least 8 characters." },
            required: "Create a password first.",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel
                action={<a href="#forgot">{PRESET.password.forgot}</a>}
              >
                {PRESET.password.label}
              </FormLabel>
              <FormControl>
                <Input
                  type={shown ? "text" : "password"}
                  size="tall"
                  placeholder={PRESET.password.placeholder}
                  trailing={
                    <Reveal
                      shown={shown}
                      onToggle={() => {
                        setShown((state) => !state)
                      }}
                    />
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm"
          rules={{
            validate: (value, values) =>
              value === values.password || "The two passwords don't match.",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{PRESET.confirm.label}</FormLabel>
              <FormControl>
                <Input
                  type={shown ? "text" : "password"}
                  size="tall"
                  placeholder={PRESET.confirm.placeholder}
                  {...field}
                />
              </FormControl>
              {/* Under the pair rather than the first field, which is where
                  the drawing shows it: a rule about the password belongs to
                  the moment both boxes are done asking for it. */}
              <FormDescription>{PRESET.password.helper}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-2 flex flex-col gap-6">
          <Button type="submit" className="w-full">
            {PRESET.button}
            <ArrowRight />
          </Button>

          <p
            data-slot="login-footer"
            className="text-center text-sm text-zinc-700 dark:text-muted-foreground"
          >
            {PRESET.footer.lead}{" "}
            <a
              href="#contact"
              className="rounded-xs text-brand-500 underline underline-offset-2 hover:decoration-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-primary"
            >
              {PRESET.footer.link}
            </a>
          </p>
        </div>
      </form>
    </Form>
  )
}
