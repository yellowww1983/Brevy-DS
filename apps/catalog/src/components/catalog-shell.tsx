import type { ReactNode } from "react"

import { Sidebar } from "./sidebar"
import { SidebarProvider } from "./sidebar-provider"
import { TopBar } from "./top-bar"

export function CatalogShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {/* An app shell rather than a long page. The window holds the shell and
          scrolls nothing; the two things inside it that can run past the
          bottom scroll themselves.
          
          That is what puts the top bar out of reach of a scrollbar. It is a
          flex row above a scroller rather than a bar stuck to the top of one,
          so it needs no `sticky`, no `z-index` and nothing to sit above: it
          cannot move because nothing under it moves it.
          
          It also gives the sidebar the scroll its list has always declared and
          never had. Left in a page-tall column the nav stretched to the height
          of the document and its `overflow-y-auto` had nothing to do; the list
          is 1824px against 39 rows, so on any ordinary screen the last section
          was simply out of reach. */}
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex h-full min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto px-12 py-14">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
