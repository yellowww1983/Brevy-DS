"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { getComponent } from "@/registry"

export function Breadcrumbs() {
  const pathname = usePathname()
  const slug = pathname.split("/")[2]
  const entry = slug ? getComponent(slug) : undefined

  if (!entry) {
    return null
  }

  const crumbs = [
    { label: "Components", href: "/components" },
    { label: entry.name, href: null },
  ]

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, index) => (
          <li key={crumb.label} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight
                className="size-3.5 shrink-0 text-muted-foreground"
                aria-hidden
              />
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-foreground">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
