import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

const inputVariants = cva(
  "w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      /** Two heights, one box: the radius, padding, hairline and background
       *  never move between them. `default` is the app's field. `tall` is the
       *  website's, drawn at 48 with its text a step larger in every form the
       *  site has. */
      size: {
        default: "h-9 text-sm",
        tall: "h-12 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

/** The native attribute called `size` measures width in characters, which
 *  nothing here uses, so the name goes to the variant. */
type InputProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>

function Input({ className, type, size, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
export type { InputProps }
