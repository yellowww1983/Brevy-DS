"use client"

import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement
    const next = root.classList.contains("dark") ? "light" : "dark"

    root.classList.toggle("dark", next === "dark")
    localStorage.setItem("theme", next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Moon className="size-3.5 dark:hidden" aria-hidden />
      <Sun className="hidden size-3.5 dark:block" aria-hidden />
      <span className="dark:hidden">Dark</span>
      <span className="hidden dark:inline">Light</span>
    </button>
  )
}
