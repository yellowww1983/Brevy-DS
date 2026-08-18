"use client"

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

export function useSearch() {
  const value = useContext(SearchContext)

  if (!value) {
    throw new Error("useSearch must be used within <SearchProvider>")
  }

  return value
}
