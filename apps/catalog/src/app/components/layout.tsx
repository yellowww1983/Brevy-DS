import type { ReactNode } from "react"

import { SearchProvider } from "@/components/search-provider"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"

export default function ComponentsLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SearchProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 px-12 py-14">{children}</main>
        </div>
      </div>
    </SearchProvider>
  )
}
