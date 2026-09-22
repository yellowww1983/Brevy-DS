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
 *  Every surface here is a token rather than a colour, and the card this sits
 *  in is pinned to the light palette, so the tokens resolve to their light
 *  values on a dark page too: the mock is the same object in both themes
 *  rather than a light picture that has to be hidden on a dark one.
 *
 *  The bubble takes `--popover` and the field `--background`, which in the
 *  light are both white, so the hairline and the shadow do the separating —
 *  which is what the drawing does too. Those two tokens used to be doing a
 *  second job, stepping above and below `--card` to separate themselves on a
 *  dark page. They no longer need to, because there is no dark page in here.
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
