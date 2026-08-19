import type { Metadata } from "next"
import { Hedvig_Letters_Serif, Inter, Rethink_Sans } from "next/font/google"
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
      className={`${inter.variable} ${rethinkSans.variable} ${hedvig.variable}`}
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
