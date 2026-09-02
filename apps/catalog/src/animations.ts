/** What the two libraries of motion hold, and nothing about how they read.
 *
 *  Animations is one heading with two pages under it, the way Hero is: the
 *  animated mockups and the background scenes are different material and are
 *  used differently, so each has its own page and its own doc. What they
 *  share is the list of what exists, and that is this file.
 *
 *  Nothing numeric is written here. How long one runs and what it weighs are
 *  read off the file itself, by `media-files.ts`, which a page imports and
 *  this module cannot: the registry is reached from the sidebar, the sidebar
 *  is a client component, and a doc that opened a file would take `node:fs`
 *  into the browser bundle with it. So this is the words and the names, and
 *  the measuring lives next door. */

/** The three sets the library arrived in. `Mockups` are whole screens, the
 *  biggest thing the file animates. `Mechanics` are single moves, one idea
 *  each. `Caregiving` are the three the caregiving pages carry. */
export type AnimationGroup = "Mockups" | "Mechanics" | "Caregiving"

export type Animation = {
  /** The file under `public/lottie`, which is also its poster's name. */
  file: string
  name: string
  group: AnimationGroup
  /** One line on what plays, so the gallery reads before anything is loaded. */
  shows: string
}

export const ANIMATIONS: readonly Animation[] = [
  {
    file: "Item1.json",
    name: "Caregiver payment",
    group: "Mockups",
    shows:
      "An enrolment card fills in, a take-home figure lands, and a chip closes it.",
  },
  {
    file: "Item2.json",
    name: "Plan transition",
    group: "Mockups",
    shows:
      "Three checks resolve one after another while a bar fills to a zero balance.",
  },
  {
    file: "Item3.json",
    name: "Care advocate match",
    group: "Mockups",
    shows:
      "A question and answer thread runs to a card naming the advocate it found.",
  },
  {
    file: "4.json",
    name: "Questions answered",
    group: "Mechanics",
    shows: "Four rows, each drawing an arrow and settling on a green chip.",
  },
  {
    file: "5.json",
    name: "Programs branching",
    group: "Mechanics",
    shows: "The mark puts out five branches, one per programme it found.",
  },
  {
    file: "6.json",
    name: "Both sides of a call",
    group: "Mechanics",
    shows:
      "Two photographs meet over a bolt. The only piece whose subject is a photograph.",
  },
  {
    file: "7.json",
    name: "Signing up by code",
    group: "Mechanics",
    shows: "A browser card scans its own code inside a ring of faces.",
  },
  {
    file: "8.json",
    name: "The mark at the centre",
    group: "Mechanics",
    shows: "Faces arrive around the mark and arrows close the circle.",
  },
  {
    file: "9.json",
    name: "Intake filling in",
    group: "Mechanics",
    shows: "A form writes itself line by line as the ring around it draws in.",
  },
  {
    file: "10.json",
    name: "Approved at the centre",
    group: "Mechanics",
    shows:
      "The same circle as the mark's, closing on a person and an approval.",
  },
  {
    file: "11.json",
    name: "Eligibility in the chat",
    group: "Mechanics",
    shows:
      "Two bubbles, then a heading and four programmes typed a character at a time.",
  },
  {
    file: "12.json",
    name: "Nine answered, six found",
    group: "Mechanics",
    shows: "Two rings of faces turn around the mark over a counter.",
  },
  {
    file: "13.json",
    name: "A specialist offered",
    group: "Mechanics",
    shows: "A short list of what someone qualifies for, then who can help.",
  },
  {
    file: "1_short_noloop.json",
    name: "Eligibility",
    group: "Caregiving",
    shows: "A form's rows tick over one by one.",
  },
  {
    file: "2_short_noloop.json",
    name: "Plan approved",
    group: "Caregiving",
    shows: "A short exchange lands on an approval.",
  },
  {
    file: "3_short_noloop.json",
    name: "Payment sent",
    group: "Caregiving",
    shows: "A coin turns and a notice says the payment has gone.",
  },
]

/** The other half of the library: watercolour scenes, drawn as video.
 *
 *  They are not mockups and nothing about them is an interface. They are
 *  backgrounds, and they go where a page today paints a still wash. */
export type Background = {
  /** The file under `public/video`, which is also its poster's name. */
  file: string
  name: string
  /** Which way round it was drawn. The welcome scene exists both ways, one
   *  for a wide page and one for a tall one. */
  orientation: "landscape" | "portrait"
  shows: string
  /** Where a ground was painted into the export rather than left clear, named
   *  by the token it matches. */
  ground?: string
  /** What it is for, in the words a brief would use. */
  use: string
}

export const BACKGROUNDS: readonly Background[] = [
  {
    file: "1.webm",
    name: "Welcome, wide",
    orientation: "landscape",
    shows:
      "Three figures on a footbridge over a stream, blossom down both banks.",
    use: "Behind a hero on a wide page.",
  },
  {
    file: "welcome_animation_1.webm",
    name: "Welcome, tall",
    orientation: "portrait",
    shows:
      "Two people walking a park path arm in arm, one with a cane, a city behind the trees.",
    use: "Behind the picture half of the login screen, and behind a hero on a phone.",
  },
  {
    file: "partners_1_v5_F5F2EF.webm",
    name: "Arriving at the hospital",
    orientation: "landscape",
    shows: "A path to a hospital, a wheelchair being pushed along it.",
    ground: "beige-500",
    use: "Behind a hero on the partner pages.",
  },
  {
    file: "seasons2_cycle_v4_F5F2EF.webm",
    name: "A year of seasons",
    orientation: "landscape",
    shows:
      "Two figures walking away down an open path while the year turns around them.",
    ground: "beige-500",
    use: "Behind a hero that has to hold the longest, at twenty four seconds the longest here.",
  },
]

export const GROUPS: readonly AnimationGroup[] = [
  "Mockups",
  "Mechanics",
  "Caregiving",
]

export function posterOf(file: string) {
  return `/lottie/poster/${file.replace(".json", ".webp")}`
}

export function scenePosterOf(file: string) {
  return `/video/poster/${file.replace(".webm", ".webp")}`
}

export function weightOf(bytes: number) {
  return `${String(Math.round(bytes / 1024))} KB`
}

export function lengthOf(seconds: number) {
  return `${seconds.toFixed(1)}s`
}
