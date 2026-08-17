import type { Metadata } from "next"
import { Rethink_Sans } from "next/font/google"
import type { ReactNode } from "react"

import { ThemeScript } from "@/components/theme-script"

import "./globals.css"

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  variable: "--font-rethink-sans",
})

export const metadata: Metadata = {
  title: "Brevy Design System",
  description: "Primitives, variants and states of the Brevy design system.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={rethinkSans.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
