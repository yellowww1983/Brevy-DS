import { join, preamble, table } from "./doc"

export const INTRO =
  "The soft green frame the product's artwork sits in, at a height that never changes."

export const USE = [
  "`IllustrationPanel` is a frame and nothing else. It draws the ground, the gradient edge and the corner, and whatever goes inside it is the caller's: the file hand-places a mock of the product in every one, and that artwork is Brevy's own rather than a shape the panel can name.",
  "It became a component when a second block asked for it. The step cards drew it first and the benefit cards wanted the same object, which is the line this system uses for whether something is a part or a detail.",
  "The height is fixed at every width and does not grow. What grows is the copy underneath, which is what puts two cards of different lengths in one row with their pictures level. A panel that stretched to its contents would break that.",
  "`marker` puts a badge in the corner, inset 8. Only the step cards use it; the benefit cards paint their own into the artwork instead, which is why it is a prop rather than a number.",
  "On a dark page the panel stays as it is drawn: an olive-to-white ground inside an olive-to-neutral edge, both light. Nothing in it turns with the theme. That is the state today rather than a decision anybody defended, and it is worth knowing before you place one on a dark section.",
]

const PROPS: readonly (readonly string[])[] = [
  ["`marker`", "`ReactNode`", "none", "A badge in the corner, inset 8"],
  ["`children`", "`ReactNode`", "none", "The artwork, centred both ways"],
  ["`className`", "`string`", "none", "Extra classes, rarely needed"],
]

export function illustrationPanelDoc() {
  return join([
    preamble("IllustrationPanel", "component"),
    "",
    "# IllustrationPanel",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { IllustrationPanel } from "@brevy/ui"',
    "",
    "<IllustrationPanel>",
    '  <img src="/steps/panel-1.webp" alt="" />',
    "</IllustrationPanel>",
    "```",
    "",
    "## Props",
    "",
    table(["Prop", "Values", "Default", "What it does"], PROPS),
  ])
}
