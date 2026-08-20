"use client"

import { usePathname } from "next/navigation"
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type SearchValue = {
  query: string
  setQuery: (value: string) => void
}

const SearchContext = createContext<SearchValue | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("")
  const value = useMemo(() => ({ query, setQuery }), [query])

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

/** Search narrows lists of components. A content page has no list, so the field
 *  is absent there and a query typed earlier stops applying until you return,
 *  because otherwise the sidebar would stay filtered with no way to clear it. */
export function useSearchable() {
  return usePathname().startsWith("/components")
}

export function useSearch() {
  const value = useContext(SearchContext)

  if (!value) {
    throw new Error("useSearch must be used within <SearchProvider>")
  }

  return value
}
