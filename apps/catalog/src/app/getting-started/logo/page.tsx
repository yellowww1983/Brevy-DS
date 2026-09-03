import { BrevyLockup } from "@brevy/ui"

import { docFor } from "@/registry"
import { ContentPage, HEADING } from "@/components/content-page"
import { LogoClearSpace } from "@/components/logo-clear-space"
import { LogoColour } from "@/components/logo-colour"
import { LogoMotion } from "@/components/logo-motion"
import { LogoSize } from "@/components/logo-size"
import { MarkdownText } from "@/components/markdown-text"
import type { Section } from "@/components/table-of-contents"
import {
  CLEAR_SPACE,
  COLOUR_NOTE,
  DONTS,
  GEOMETRY,
  INTRO,
  LOCKUP_NOTE,
  MARK_NOTE,
  MINIMUM,
  MOTION,
  NO_GUIDELINES,
  PROPORTIONS,
  SIZES,
} from "@/logo"

const SECTIONS: readonly Section[] = [
  { id: "where-these-rules-come-from", title: "Where these rules come from" },
  { id: "the-lockup", title: "The lockup" },
  { id: "the-mark", title: "The mark" },
  { id: "clear-space", title: "Clear space" },
  { id: "sizes", title: "Sizes" },
  { id: "colour", title: "Colour" },
  { id: "in-motion", title: "In motion" },
  { id: "dont", title: "Don't" },
]

export default async function LogoPage() {
  return (
    <ContentPage sections={SECTIONS} markdown={await docFor("logo")}>
      <h1 className="text-4xl font-bold tracking-tight">Logo</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <h2 id="where-these-rules-come-from" className={HEADING}>
        Where these rules come from
      </h2>
      {/* Said before anything else on the page, because a reader who takes
          these for handed-down guidelines would be taking them for something
          they are not. */}
      <p className="mt-4 max-w-3xl leading-relaxed">{NO_GUIDELINES}</p>

      <table className="mt-6 w-full max-w-3xl text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="py-2 font-medium">Measured</th>
            <th className="py-2 font-medium">In its own units</th>
            <th className="py-2 font-medium">Against the height</th>
          </tr>
        </thead>
        <tbody>
          {GEOMETRY.map((row) => (
            <tr key={row.what} className="border-b border-border">
              <td className="py-2.5">{row.what}</td>
              <td className="py-2.5 tabular-nums">{row.value}</td>
              <td className="py-2.5 tabular-nums">{row.inHeights}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="the-lockup" className={HEADING}>
        The lockup
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">
        <MarkdownText>{LOCKUP_NOTE}</MarkdownText>
      </p>
      <div className="mt-6">
        <LogoColour />
      </div>

      <h2 id="the-mark" className={HEADING}>
        The mark
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">
        <MarkdownText>{MARK_NOTE}</MarkdownText>
      </p>
      <div className="mt-6 flex items-end gap-8 rounded-xl border border-border p-6">
        <span
          aria-hidden
          className="block size-24 bg-brand-500 mask-brevy-lockup-mark dark:bg-primary"
        />
        {/* The same shape the closing band fills with a gradient, which is the
            reason it is a mask and not a drawing. */}
        <span
          aria-hidden
          className="block size-24 bg-linear-to-b from-brand-500 to-olive-500 mask-brevy-lockup-mark"
        />
      </div>

      <h2 id="clear-space" className={HEADING}>
        Clear space
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">{CLEAR_SPACE}</p>
      <div className="mt-6">
        <LogoClearSpace />
      </div>

      <h2 id="sizes" className={HEADING}>
        Sizes
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">{MINIMUM}</p>
      <ul className="mt-6 max-w-3xl">
        {SIZES.map((size) => (
          <LogoSize key={`${size.what}-${String(size.px)}`} size={size} />
        ))}
      </ul>
      <p className="mt-6 max-w-3xl leading-relaxed">{PROPORTIONS}</p>

      <h2 id="colour" className={HEADING}>
        Colour
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">{COLOUR_NOTE}</p>

      <h2 id="in-motion" className={HEADING}>
        In motion
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">{MOTION}</p>
      <div className="mt-6 max-w-3xl">
        <LogoMotion />
      </div>

      <h2 id="dont" className={HEADING}>
        Don&rsquo;t
      </h2>
      <ul className="mt-6 max-w-3xl">
        {DONTS.map((item) => (
          <li key={item.rule} className="border-b border-border py-4">
            <p className="font-medium">{item.rule}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              <MarkdownText>{item.why}</MarkdownText>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex items-center gap-6 rounded-xl border border-border p-6">
        <BrevyLockup className="h-10 w-auto shrink-0 text-brand-500 dark:text-primary" />
        <p className="text-sm text-muted-foreground">
          One drawing, one colour, two themes.
        </p>
      </div>
    </ContentPage>
  )
}
