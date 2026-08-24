"use client"

import { ChevronDown } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

type RootProps = ComponentProps<typeof AccordionPrimitive.Root>

/** Single by default, and collapsible with it: the drawn FAQ holds one answer
 *  open at a time, and pressing the open question again closes it. Multiple
 *  stays available for the lists that want it. */
type AccordionProps =
  | (Omit<Extract<RootProps, { type: "single" }>, "type"> & {
      type?: "single"
    })
  | Extract<RootProps, { type: "multiple" }>

function Accordion({ className, ...props }: AccordionProps) {
  const resolved: RootProps =
    props.type === "multiple"
      ? props
      : { collapsible: true, ...props, type: "single" }

  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col gap-2", className)}
      {...resolved}
    />
  )
}

/** One card per question. Every item wears its own skin, the way the design
 *  draws the list: no dividers, no shared shell, first and last no different
 *  from the middle.
 *
 *  Keyboard focus is shown here rather than on the trigger, so the one line
 *  the card wears stays the only line around the question. */
function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "hairline rounded-2xl bg-background px-6 shadow-xs outline-ring/50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2",
        className,
      )}
      {...props}
    />
  )
}

/** The question row. Open, its bottom padding drops from 24 to the drawn 8,
 *  which is the whole of the spacing between question and answer. */
function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-2 py-6 text-left text-xl font-semibold text-foreground outline-none data-[state=open]:pb-2 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        {/* The icon's box is 24 against the question's 28 line, so under
            items-start it sits 2 high of centre. Half the difference brings
            it level, and a question that wraps still keeps it on the first
            line rather than the middle of three. */}
        <ChevronDown
          className="mt-0.5 size-6 shrink-0 icon-stroke text-zinc-700 transition-transform duration-200"
          aria-hidden
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden"
      {...props}
    >
      <div className={cn("pb-6 text-xl font-normal text-zinc-700", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
export type { AccordionProps }
