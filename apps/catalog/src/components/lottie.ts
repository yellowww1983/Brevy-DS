/** What the two places that play a Lottie both need.
 *
 *  The logo's animation has its green baked into the export, so anything that
 *  plays it has to rewrite the colour before the player starts or it paints
 *  the light theme's green on a dark page. Two components do that: the
 *  preloader the catalog opens with, and the tile on the Logo page. They used
 *  to carry a copy each, identical to the byte apart from how they spelled the
 *  parameter, which is the kind of pair that drifts without anybody seeing it.
 */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Rewrites every fill and stroke in an animation, wherever it sits. */
export function repaint(node: unknown, colour: readonly number[]): void {
  if (!isRecord(node)) {
    return
  }

  if ((node.ty === "fl" || node.ty === "st") && isRecord(node.c)) {
    node.c.k = [...colour, 1]
  }

  for (const value of Object.values(node)) {
    repaint(value, colour)
  }
}

/** An element's own colour, as the channels the player wants.
 *
 *  Through a canvas rather than a pattern over `rgb(...)`. A colour reaches
 *  `getComputedStyle` in whatever form it was authored, and these tokens
 *  arrive as `oklch(...)`: a pattern that only knows `rgb` matches nothing,
 *  returns no channels, and paints the logo black. Painting one pixel and
 *  reading it back answers the same way whatever it was written in. */
export function colourOf(element: HTMLElement): readonly number[] {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1

  const context = canvas.getContext("2d")

  if (!context) {
    return [0, 0, 0]
  }

  /* Sizing a canvas resets its context, so the fill is set after it. */
  context.fillStyle = getComputedStyle(element).color
  context.fillRect(0, 0, 1, 1)

  const pixel = context.getImageData(0, 0, 1, 1).data

  return [pixel[0], pixel[1], pixel[2]].map((channel) => (channel ?? 0) / 255)
}
