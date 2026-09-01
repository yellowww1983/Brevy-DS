"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type SidebarValue = {
  collapsed: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarValue | null>(null)

/** Whether the navigation is out of the way.
 *
 *  Deliberately not remembered. A collapsed sidebar is something someone does
 *  to look at one preview at its full width, not a way they want the catalog
 *  to open — and a catalog that opens with its navigation hidden is a catalog
 *  someone has to find their way back into. */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const value = useMemo(
    () => ({
      collapsed,
      toggle: () => {
        setCollapsed((open) => !open)
      },
    }),
    [collapsed],
  )

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export function useSidebar() {
  const value = useContext(SidebarContext)

  if (!value) {
    throw new Error("useSidebar must be used within <SidebarProvider>")
  }

  return value
}
