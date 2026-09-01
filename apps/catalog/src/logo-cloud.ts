import { join, preamble } from "./doc"

export const INTRO =
  "A band of partner marks, moving. The file draws it standing still — a row wider than its own section, with a spare copy of every mark switched off beside it — which is what a marquee looks like when it is drawn rather than run. The live page settles the rest."

export const USE = [
  "`LogoCloud` takes the marks as `logos` and a `label` saying what the band is. The marks are other organisations' and belong to the page rather than to the system, so they arrive as nodes and the block never ships one.",
  "It doubles whatever it is given and slides exactly one copy's width, so the marks come round without a seam. Two of anything is enough; more is fine. Because the marks arrive from outside, the band cannot know how wide they make a copy: the track refuses to shrink, and a copy is never narrower than the band — past that width the marks take the slack evenly rather than leaving the far end empty for part of every lap.",
  "`label` is not decoration. The file writes nothing above the marks, so without it the band announces a list of pictures with no reason for being there.",
  "Motion stops for anyone who asked it to. The band still reads — it is a row of marks either way — and only the sliding goes.",
]

export const LAYOUT = [
  "The band is 122px tall, 90px where the column narrows to a phone, and it pads nothing. Every other section in this file breathes 96px above and below; this is a band rather than a section, and the file gives it none.",
  "The ground is flat olive-500, and the marks are laid over in `grayscale(1)` — the file has them in full colour, the live page flattens them.",
  "In the dark the band darkens with the page and the same filter flips, because a grey mark on a dark band is a hole.",
  "The animation runs 40 seconds a lap and pauses under the cursor. The ends of each copy carry half a gap, so the seam where one copy meets the next measures the same as every other space in the band.",
]

export function logoCloudDoc() {
  return join([
    preamble("LogoCloud", "block"),
    "",
    "# LogoCloud",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { LogoCloud } from "@brevy/ui"',
    "",
    "<LogoCloud",
    '  label="Our partners"',
    '  logos={[<PartnerMark key="a" />, <PartnerMark key="b" />]}',
    "/>",
    "```",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
