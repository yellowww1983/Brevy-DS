"use client"

import { cn } from "@brevy/ui"
import { List } from "lucide-react"
import { useEffect, useState } from "react"

export type Section = {
  id: string
  title: string
}

export function TableOfContents({
  sections,
}: {
  sections: readonly Section[]
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "")

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((heading) => heading !== null)

    /** The band is the top of the viewport, so a heading counts as current once
     *  it reaches the reading position rather than when it first appears. */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) {
          return
        }

        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        )
        setActive(topmost.target.id)
      },
      { rootMargin: "-80px 0px -65% 0px" },
    )

    headings.forEach((heading) => {
      observer.observe(heading)
    })

    return () => {
      observer.disconnect()
    }
  }, [sections])

  return (
    <nav
      aria-label="On this page"
      className="sticky top-8 ml-auto hidden h-fit w-56 shrink-0 xl:block"
    >
      <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <List className="size-3.5" aria-hidden />
        On this page
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              className={cn(
                "block rounded-sm text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                active === section.id
                  ? "font-medium text-sidebar-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
