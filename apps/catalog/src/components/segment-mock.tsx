import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  IconList,
  IconListItem,
} from "@brevy/ui"
import { Check } from "lucide-react"

import { PEOPLE } from "@/avatar"
import { PROGRAMS, PROGRAMS_HEADING } from "@/icon-list"

/** A stand-in for the artwork the file puts inside a segment's white card: a
 *  question somebody asked, the programs it turned up, and the field they
 *  asked it in.
 *
 *  Every surface here is a token rather than a colour, so the mock is the same
 *  arrangement in either theme instead of a light picture that has to be
 *  hidden on a dark page. The bubbles take `--popover`, which sits a step
 *  above `--card` in the dark and is what separates them from the card they
 *  lie on; the field takes `--background`, a step below, which is what a
 *  recessed input reads as. In the light all three are white and the hairline
 *  does the separating, which is what the drawing does too.
 *
 *  Catalog furniture. A client brings their own. */
export function SegmentMock({ index }: { index: number }) {
  const face = PEOPLE[index % PEOPLE.length]

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div
        data-mock="bubble"
        className="hairline flex items-center gap-2 self-start rounded-2xl bg-popover p-2 shadow-md"
      >
        <Avatar>
          {face ? <AvatarImage src={face.photo} alt="" /> : null}
          <AvatarFallback>{face?.initials ?? "BC"}</AvatarFallback>
        </Avatar>
        <span data-mock="bubble-ink" className="text-caption text-foreground">
          Do I qualify for Medicaid?
        </span>
      </div>

      <IconList heading={PROGRAMS_HEADING}>
        {PROGRAMS.map((line) => (
          <IconListItem key={line} icon={<Check />}>
            {line}
          </IconListItem>
        ))}
      </IconList>

      <div
        data-mock="field"
        className="hairline flex items-center justify-between gap-2 rounded-2xl bg-background p-3"
      >
        <span
          data-mock="field-ink"
          className="text-caption text-muted-foreground"
        >
          What can I help you with today?
        </span>
        <span
          data-mock="pill"
          className="h-8 w-24 shrink-0 rounded-lg bg-primary"
        />
      </div>
    </div>
  )
}
