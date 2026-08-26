import type { Metadata } from "next"
import {
  Geist_Mono,
  Hedvig_Letters_Serif,
  Inter,
  Rethink_Sans,
} from "next/font/google"
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

/** The catalog's code face. Every family the catalog styles with has to be
 *  loaded here to exist at all: the token file names Geist Mono, nothing
 *  loaded it, and every `code` in the prose came out in Courier. Chrome only,
 *  the way Inter is: the system draws no monospace anywhere. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

/** The display face. Only the typography page shows it today, but it is part
 *  of the system's own language, so it loads with the other two. */
const hedvig = Hedvig_Letters_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hedvig",
})

export const metadata: Metadata = {
  title: "Brevy Design System",
  description: "Primitives, variants and states of the Brevy design system.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${rethinkSans.variable} ${hedvig.variable} ${geistMono.variable}`}
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
