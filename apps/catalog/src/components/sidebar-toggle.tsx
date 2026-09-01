"use client"

import { PanelLeft } from "lucide-react"

import { useSidebar } from "./sidebar-provider"

/** Puts the navigation away, so a preview drawn at 1440 has the window to
 *  itself. It sits before the search field, which is the first thing in the
 *  bar that belongs to the page rather than to the shell. */
export function SidebarToggle() {
  const { collapsed, toggle } = useSidebar()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={collapsed ? "Show the navigation" : "Hide the navigation"}
      aria-expanded={!collapsed}
      aria-controls="catalog-nav"
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border text-foreground hover:bg-catalog-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <PanelLeft className="size-4 icon-stroke" aria-hidden />
    </button>
  )
}
