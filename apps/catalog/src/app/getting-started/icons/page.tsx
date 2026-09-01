import { docFor } from "@/registry"
import { Button } from "@brevy/ui"
import { ArrowUp, Bell, Check, ChevronDown, Download, Play } from "lucide-react"

import { ContentPage, HEADING } from "@/components/content-page"
import { IconSample, IconSize } from "@/components/icon-specimen"
import { MarkdownText } from "@/components/markdown-text"
import type { Section } from "@/components/table-of-contents"
import { IN_A_COMPONENT, INTRO, SET, SIZE, STROKE } from "@/icons"

const SECTIONS: readonly Section[] = [
  { id: "the-set", title: "The set" },
  { id: "size", title: "Size" },
  { id: "stroke", title: "Stroke" },
  { id: "in-a-component", title: "In a component" },
]

export default async function IconsPage() {
  return (
    <ContentPage sections={SECTIONS} markdown={await docFor("icons")}>
      <h1 className="text-4xl font-bold tracking-tight">Icons</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <h2 id="the-set" className={HEADING}>
        The set
      </h2>
      <p className="mt-4 leading-relaxed">
        <MarkdownText>{SET[0] ?? ""}</MarkdownText>
      </p>

      <p className="mt-4 leading-relaxed">{SET[1] ?? ""}</p>

      <ul className="mt-4">
        <IconSample name="Check">
          <Check className="size-6 icon-stroke" />
        </IconSample>
        <IconSample name="ChevronDown">
          <ChevronDown className="size-6 icon-stroke" />
        </IconSample>
        <IconSample name="ArrowUp">
          <ArrowUp className="size-6 icon-stroke" />
        </IconSample>
        <IconSample name="Play">
          <Play className="size-6 icon-stroke" />
        </IconSample>
        <IconSample name="Bell">
          <Bell className="size-6 icon-stroke" />
        </IconSample>
      </ul>

      <h2 id="size" className={HEADING}>
        Size
      </h2>
      <p className="mt-4 leading-relaxed">{SIZE}</p>

      <ul className="mt-6">
        <IconSize label="size-4">
          <Bell className="size-4 icon-stroke" />
        </IconSize>
        <IconSize label="size-5">
          <Bell className="size-5 icon-stroke" />
        </IconSize>
        <IconSize label="size-6">
          <Bell className="size-6 icon-stroke" />
        </IconSize>
        <IconSize label="size-8">
          <Bell className="size-8 icon-stroke" />
        </IconSize>
      </ul>

      <h2 id="stroke" className={HEADING}>
        Stroke
      </h2>
      <p className="mt-4 leading-relaxed">
        <MarkdownText>{STROKE[0] ?? ""}</MarkdownText>
      </p>
      <p className="mt-4 leading-relaxed">{STROKE[1] ?? ""}</p>

      <h2 id="in-a-component" className={HEADING}>
        In a component
      </h2>
      <p className="mt-4 leading-relaxed">{IN_A_COMPONENT}</p>

      <div
        data-component-demo
        className="mt-6 flex flex-wrap items-center gap-4"
      >
        <Button>
          <Download />
          Download the app
        </Button>
        <Button variant="outline" aria-label="Download">
          <Download />
        </Button>
      </div>
    </ContentPage>
  )
}
