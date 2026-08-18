import type { Metadata } from "next"
import { Inter, Rethink_Sans } from "next/font/google"
import type { ReactNode } from "react"

import { Preloader } from "@/components/preloader"
import { PreloaderScript } from "@/components/preloader-script"
import { SearchProvider } from "@/components/search-provider"
import { ThemeScript } from "@/components/theme-script"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

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
    <html
      lang="en"
      className={`${inter.variable} ${rethinkSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <PreloaderScript />
      </head>
      <body className="bg-background font-catalog text-foreground antialiased">
        <Preloader />
        <SearchProvider>{children}</SearchProvider>
      </body>
    </html>
  )
}
