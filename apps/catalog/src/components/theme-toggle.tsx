"use client"

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
      className="rounded-md border border-sidebar-border px-2 py-1 text-xs font-medium text-sidebar-foreground hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="dark:hidden">Dark</span>
      <span className="hidden dark:inline">Light</span>
    </button>
  )
}
