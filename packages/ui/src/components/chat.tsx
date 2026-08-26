"use client"

import { ArrowUp } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"

import { cn } from "../lib/utils.js"
import { Button } from "./button.js"

/** The hero's chat card: a bare textarea and the round send button on one
 *  white card. The card wears the whole skin. The field brings no frame of
 *  its own; the hairline, the 16 radius and the drawn shadow all belong to
 *  the card, which is also why this is not an Input variant.
 *
 *  The height is the content's rather than the drawing's: the file fixes the
 *  frame at 138 the way it fixes the FAQ card's, and the shipped site grows
 *  the field line by line, which is the behaviour a text box owes its text.
 *  The field stops at 200 and scrolls from there, as the shipped site does;
 *  the file draws no cap.
 *
 *  The send button reads the field: empty, it rests on the soft olive, and
 *  with anything to send it turns the drawn green — the app file leaves a
 *  brand surface alone in the dark, so the glow is untouched.
 *
 *  The card paints `--card`, white in the light and neutral-900 in the dark,
 *  and its text follows: on the ramp it read at 2.56 to 1 there. */
function Chat({
  placeholder,
  sendLabel,
  defaultValue = "",
  className,
}: {
  placeholder: string
  /** The accessible name of the icon-only send button. */
  sendLabel: string
  defaultValue?: string
  className?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const field = useRef<HTMLTextAreaElement>(null)

  /* Grown by measuring, not declaring: the field is collapsed and asked how
     tall its text renders, every time the text changes. */
  useLayoutEffect(() => {
    const element = field.current

    if (element) {
      element.style.height = "0"
      element.style.height = `${String(element.scrollHeight)}px`
    }
  }, [value])

  return (
    <div
      data-slot="chat"
      className={cn(
        "hairline flex flex-col gap-2 rounded-2xl bg-card pt-4 pr-2 pb-2 pl-4 shadow-lg",
        className,
      )}
    >
      <textarea
        data-slot="chat-field"
        ref={field}
        rows={1}
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          setValue(event.target.value)
        }}
        className="max-h-50 w-full resize-none text-base/6 text-zinc-800 outline-none placeholder:text-zinc-600 dark:text-foreground dark:placeholder:text-muted-foreground"
      />
      <Button
        variant="send"
        aria-label={sendLabel}
        data-active={value.trim() === "" ? undefined : ""}
        className="self-end"
      >
        <ArrowUp />
      </Button>
    </div>
  )
}

export { Chat }
