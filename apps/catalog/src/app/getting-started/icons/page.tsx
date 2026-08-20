import { Button } from "@brevy/ui"
import { ArrowUp, Bell, Check, ChevronDown, Download, Play } from "lucide-react"

import { ContentPage, HEADING, LINK } from "@/components/content-page"
import { IconSample, IconSize } from "@/components/icon-specimen"
import type { Section } from "@/components/table-of-contents"

const SECTIONS: readonly Section[] = [
  { id: "the-set", title: "The set" },
  { id: "size", title: "Size" },
  { id: "stroke", title: "Stroke" },
  { id: "in-a-component", title: "In a component" },
]

export default function IconsPage() {
  return (
    <ContentPage sections={SECTIONS}>
      <h1 className="text-4xl font-bold tracking-tight">Icons</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Icons come from lucide, sized and styled to match the rest of the
        system. Drop one into a component and it inherits the right size and
        stroke.
      </p>

      <h2 id="the-set" className={HEADING}>
        The set
      </h2>
      <p className="mt-4 leading-relaxed">
        Every icon comes from{" "}
        <a href="https://lucide.dev" className={LINK}>
          lucide
        </a>
        , which ships with <code className="font-mono text-sm">@brevy/ui</code>.
        Search it for the icon you need and use it by name. There is no shorter
        approved list: the set is whatever lucide offers.
      </p>

      <p className="mt-4 leading-relaxed">
        A few the design already uses, to show the convention rather than to
        limit it. Click a name to copy it.
      </p>

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
      <p className="mt-4 leading-relaxed">
        Components set the size, so most of the time there is nothing to choose.
        Where you are placing an icon yourself, 24px is the usual size and 16px
        suits a dense row. Every size is one class, and the stroke stays the
        same at all of them.
      </p>

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
        Icons are drawn at a stroke of 1.5, applied with{" "}
        <code className="font-mono text-sm">icon-stroke</code>. Lucide&rsquo;s
        own default is 2, which reads heavy beside Brevy type, so the system
        overrides it.
      </p>
      <p className="mt-4 leading-relaxed">
        The stroke stays 1.5 at every size. A line is normally measured inside
        the icon&rsquo;s own grid, which would draw a smaller icon thinner, so
        the system measures it on screen instead. A 16px icon and a 32px icon
        read with the same weight.
      </p>

      <h2 id="in-a-component" className={HEADING}>
        In a component
      </h2>
      <p className="mt-4 leading-relaxed">
        Components normalise both size and stroke, so pass the icon and nothing
        else.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
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
