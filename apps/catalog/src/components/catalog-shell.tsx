import type { ReactNode } from "react"

import { SearchProvider } from "./search-provider"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"

export function CatalogShell({ children }: { children: ReactNode }) {
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
