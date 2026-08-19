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
  const [spied, setSpied] = useState(sections[0]?.id ?? "")
  const [atEnd, setAtEnd] = useState(false)

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
        setSpied(topmost.target.id)
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

  /** The band above sits in the top third of the screen, so a heading only
   *  becomes current once there is a screenful of content below it to scroll
   *  through. The last section rarely has that much, and its heading comes to
   *  rest below the band with the page already at its end — leaving the final
   *  item unreachable, and on a page whose sections are all short, leaving the
   *  highlight wherever it happened to be. Running out of document says the
   *  same thing the band does: there is nothing after this left to read. */
  useEffect(() => {
    const check = () => {
      const room = document.documentElement.scrollHeight - window.innerHeight
      setAtEnd(room > 0 && window.scrollY >= room - 2)
    }

    check()

    /** Content that settles late — a frame that measures itself, an image
     *  arriving — moves the end of the document without a scroll event. */
    const observer = new ResizeObserver(check)
    observer.observe(document.documentElement)
    window.addEventListener("scroll", check, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", check)
    }
  }, [])

  const active = (atEnd ? sections.at(-1)?.id : spied) ?? spied

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
