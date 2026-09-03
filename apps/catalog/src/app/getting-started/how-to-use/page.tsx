import Link from "next/link"

import { docFor } from "@/registry"
import {
  ContentPage,
  HEADING,
  ImageSlot,
  LINK,
} from "@/components/content-page"
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

      <ImageSlot>
        A person typing a request to Claude, with the page assembling
      </ImageSlot>

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

      <ImageSlot>
        Copy for Claude on a component, and its documentation pasted into Claude
      </ImageSlot>

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
