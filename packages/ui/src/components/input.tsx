import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps, ReactNode } from "react"

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

/** The room an icon takes out of the text: the drawn 12 from the edge, the
 *  16 of the icon, and 8 to the first character. */
const LEADING_PAD = "ps-9"
const TRAILING_PAD = "pe-9"

/** Where an adornment stands: 12 off the field's edge, vertically centred,
 *  drawn in the placeholder's grey. It sits over the input rather than inside
 *  it, so every state the field already has — the focus ring, the error
 *  border, the disabled fade — keeps living on the `<input>` itself and
 *  nothing here duplicates one. A trailing adornment is usually a button (the
 *  eye that reveals a password), so only the leading side is inert. */
const ADORNMENT =
  "absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0"

/** The native attribute called `size` measures width in characters, which
 *  nothing here uses, so the name goes to the variant. */
type InputProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    /** An icon before the text. Drawn in the app's auth screens
     *  (`20786:176842`): 16 square, 12 off the edge, in the placeholder's
     *  grey. Decorative — it names the field's kind, so it is hidden from
     *  the accessibility tree, which already has the label. */
    leading?: ReactNode
    /** An icon or control after the text. The drawn case is the eye that
     *  reveals a password; passed as a `<button>`, it stays clickable because
     *  the overlay only spans itself. */
    trailing?: ReactNode
  }

function Input({
  className,
  type,
  size,
  leading,
  trailing,
  ...props
}: InputProps) {
  const field = (
    <input
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({ size }),
        leading && LEADING_PAD,
        trailing && TRAILING_PAD,
        className,
      )}
      {...props}
    />
  )

  if (!leading && !trailing) {
    return field
  }

  /** The wrapper exists only when asked for, so a bare field stays the one
   *  element it always was and everything pointing at it — form control ids,
   *  peer selectors, specs — keeps pointing at an `<input>`. */
  return (
    <div data-slot="input-shell" className="relative w-full">
      {field}

      {leading ? (
        <span
          data-slot="input-leading"
          aria-hidden
          className={cn(ADORNMENT, "start-3")}
        >
          {leading}
        </span>
      ) : null}

      {trailing ? (
        <span data-slot="input-trailing" className={cn(ADORNMENT, "end-3")}>
          {trailing}
        </span>
      ) : null}
    </div>
  )
}

export { Input, inputVariants }
export type { InputProps }
