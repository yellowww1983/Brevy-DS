import Image from "next/image"
import Link from "next/link"

import { docFor } from "@/registry"
import { ContentPage, HEADING, LINK } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import type { Section } from "@/components/table-of-contents"
import {
  API_PLACES,
  CLAUDE_CODE,
  CODE_INTRO,
  COMPOSING,
  COMPOSING_NOTE,
  INTERNAL,
  INTRO,
  NO_CODE,
  NO_CODE_INTRO,
  SNIPPET,
  WHERE_THE_API_IS,
} from "@/how-to-use"

/** One sentence for both drawings of a path: whichever the page is showing,
 *  it is the same picture of the same thing. */
/** A path's two drawings and the size each was exported at.
 *
 *  The widths are carried rather than assumed because the pair is not always
 *  the same size to the pixel: `nondev-dark` came back 1026 wide where its
 *  light twin is 1027. `next/image` reserves the box from these numbers, so a
 *  rounded-up one is a page that moves when the picture lands. */
type Drawing = { readonly src: string; readonly width: number }

type Picture = {
  readonly alt: string
  readonly light: Drawing
  readonly dark: Drawing
}

/** Every drawing in the set is 765 tall. */
const HEIGHT = 765

const NON_DEV: Picture = {
  alt: "Someone at a laptop asking Claude for a component, with the component assembling on the screen beside them",
  light: { src: "/catalog/nondev-light.webp", width: 1027 },
  dark: { src: "/catalog/nondev-dark.webp", width: 1026 },
}

const DEV: Picture = {
  alt: "A component's documentation copied out of the catalog and handed to Claude, with the code coming back",
  light: { src: "/catalog/dev-light.webp", width: 1027 },
  dark: { src: "/catalog/dev-dark.webp", width: 1027 },
}

/** The same swap the Introduction makes, for the same reason: the theme here
 *  is a class on the root, so a `<picture media>` would answer the reader's
 *  system rather than the toggle.
 *
 *  Each drawing carries its own ground rather than being cut out, so the frame
 *  gives it an edge and a painted rectangle does not end in mid-air. */
function Illustration({ picture }: { picture: Picture }) {
  return (
    <figure className="my-10">
      <Image
        src={picture.light.src}
        alt={picture.alt}
        width={picture.light.width}
        height={HEIGHT}
        sizes="(min-width: 48rem) 48rem, 100vw"
        className="w-full rounded-xl border border-border dark:hidden"
      />
      <Image
        src={picture.dark.src}
        alt={picture.alt}
        width={picture.dark.width}
        height={HEIGHT}
        sizes="(min-width: 48rem) 48rem, 100vw"
        className="hidden w-full rounded-xl border border-border dark:block"
      />
    </figure>
  )
}

const CODE = [INTERNAL, COMPOSING, CLAUDE_CODE, WHERE_THE_API_IS]

/** Both paths are headings and their parts sit under them, so the contents
 *  column reads as two routes rather than eleven unrelated stops. */
const SECTIONS: readonly Section[] = [
  { id: "if-you-dont-write-code", title: "If you don't write code" },
  ...NO_CODE.map((section) => ({ id: section.id, title: section.title })),
  { id: "if-you-write-code", title: "If you write code" },
  ...CODE.map((section) => ({ id: section.id, title: section.title })),
]

const SUB = "mt-10 scroll-mt-8 text-lg font-semibold tracking-tight"

export default async function HowToUsePage() {
  return (
    <ContentPage sections={SECTIONS} markdown={await docFor("how-to-use")}>
      <h1 className="text-4xl font-bold tracking-tight">How to use</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <h2 id="if-you-dont-write-code" className={HEADING}>
        If you don&rsquo;t write code
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">{NO_CODE_INTRO}</p>

      <Illustration picture={NON_DEV} />

      {NO_CODE.map((section) => (
        <section key={section.id}>
          <h3 id={section.id} className={SUB}>
            {section.title}
          </h3>
          {section.body.map((paragraph) => (
            <p key={paragraph} className="mt-3 max-w-3xl leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <Illustration picture={DEV} />

      <h2 id="if-you-write-code" className={HEADING}>
        If you write code
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">{CODE_INTRO}</p>

      <h3 id={INTERNAL.id} className={SUB}>
        {INTERNAL.title}
      </h3>
      <p className="mt-3 max-w-3xl leading-relaxed">
        <MarkdownText>{INTERNAL.body}</MarkdownText>
      </p>

      <h3 id={COMPOSING.id} className={SUB}>
        {COMPOSING.title}
      </h3>
      <p className="mt-3 max-w-3xl leading-relaxed">{COMPOSING.body}</p>

      <pre className="mt-6 max-w-3xl overflow-x-auto rounded-xl border border-border bg-muted/40 p-5 text-sm leading-relaxed">
        <code>{SNIPPET.join("\n")}</code>
      </pre>

      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
        {COMPOSING_NOTE}
      </p>

      <h3 id={CLAUDE_CODE.id} className={SUB}>
        {CLAUDE_CODE.title}
      </h3>
      <p className="mt-3 max-w-3xl leading-relaxed">{CLAUDE_CODE.body}</p>

      <h3 id={WHERE_THE_API_IS.id} className={SUB}>
        {WHERE_THE_API_IS.title}
      </h3>
      <p className="mt-3 max-w-3xl leading-relaxed">{WHERE_THE_API_IS.body}</p>

      <dl className="mt-6 grid max-w-3xl gap-x-6 gap-y-3 tablet:grid-cols-[auto_1fr]">
        {API_PLACES.map((place) => (
          <div key={place.where} className="contents">
            <dt className="font-medium">{place.where}</dt>
            <dd className="text-muted-foreground">{place.what}</dd>
          </div>
        ))}
      </dl>

      <hr className="mt-14 border-border" />

      <p className="mt-8 max-w-3xl leading-relaxed">
        Ready? Browse the{" "}
        <Link href="/components" className={LINK}>
          Components
        </Link>{" "}
        to see what you can build with.
      </p>
    </ContentPage>
  )
}
