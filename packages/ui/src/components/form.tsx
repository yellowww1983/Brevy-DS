"use client"

import { Slot, type Label as LabelPrimitive } from "radix-ui"
import type { ComponentProps, ReactNode } from "react"
import { createContext, useContext, useId } from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "../lib/utils.js"
import { Label } from "./label.js"

/** The form, as the app's auth screens draw it (`20786:176842` and its
 *  centred sibling `20786:176564`): fields 16 apart, and inside each one an
 *  8-gap column of label, control and helper. The wiring is shadcn's —
 *  react-hook-form under a context that hands each part its ids and its
 *  error — and the wiring is kept, because the drawing only ever disagreed
 *  with the skin.
 *
 *  Error is one state, not two. The field already paints it — the `Input`'s
 *  `aria-invalid` border and ring were measured off the app's states board —
 *  and `FormControl` sets `aria-invalid` from the same error the message
 *  reads, so the box and the text below it can never disagree. Nothing here
 *  draws a second error skin of its own. */
const Form = FormProvider

type FormFieldContextValue = {
  name: string
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
)

type FormItemContextValue = {
  id: string
}

const FormItemContext = createContext<FormItemContextValue | null>(null)

function useFormField() {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField must be used within <FormField>")
  }
  if (!itemContext) {
    throw new Error("useFormField must be used within <FormItem>")
  }

  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    ...fieldState,
  }
}

/** One field: the drawn 8 between the label, the control and whatever line
 *  sits under it. */
function FormItem({ className, ...props }: ComponentProps<"div">) {
  const id = useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

/** The label, and the line that sometimes shares its row.
 *
 *  The auth screens draw `Forgot your password?` pushed to the right end of
 *  the label's own row — Regular against the label's Medium, in the muted
 *  grey, on the same baseline (`20786:176978`). `action` is that slot. It is
 *  styled here rather than by the caller because the drawing styles it once:
 *  what varies is the words and where they lead, which is what a ReactNode
 *  carries. */
function FormLabel({
  className,
  action,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root> & { action?: ReactNode }) {
  const { error, formItemId } = useFormField()

  const label = (
    <Label
      data-slot="form-label"
      data-error={Boolean(error)}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )

  if (!action) {
    return label
  }

  return (
    <div
      data-slot="form-label-row"
      className="flex items-center justify-between gap-2"
    >
      {label}
      <span className="text-sm/none font-normal text-muted-foreground [&_a]:rounded-xs [&_a]:hover:text-foreground [&_a]:focus-visible:ring-2 [&_a]:focus-visible:ring-ring [&_a]:focus-visible:outline-none">
        {action}
      </span>
    </div>
  )
}

function FormControl(props: ComponentProps<typeof Slot.Root>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot.Root
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
      }
      aria-invalid={Boolean(error)}
      {...props}
    />
  )
}

/** The helper under the field, at the drawn 14/20 in one colour. The file
 *  draws it in two — zinc-500 on a line still reading `This is an input
 *  description.` and zinc-700 on the line somebody actually wrote — and the
 *  written one wins: the placeholder text came with its placeholder colour.
 *  Raised as DESIGN-FEEDBACK 70 rather than shipped both ways. */
function FormDescription({ className, ...props }: ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn(
        "text-sm text-zinc-700 dark:text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function FormMessage({ className, children, ...props }: ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? (error.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
