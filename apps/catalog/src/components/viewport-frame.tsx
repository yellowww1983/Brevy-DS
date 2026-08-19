"use client"

import { cn } from "@brevy/ui"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"

/** Tablet and mobile are the widths of the Figma frames. Desktop was going to
 *  be whatever room the page has, but that measures 766px here — narrower than
 *  the tablet frame, which put the three tabs out of order and showed desktop
 *  as the smallest type. It is a real width instead, and the column shows as
 *  much of that frame as it has room for. Samples are short enough to land
 *  well inside the visible part, so nothing reads as cut off. */
const VIEWPORTS = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: 1440 },
  { id: "tablet", label: "Tablet", icon: Tablet, width: 810 },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: 390 },
] as const satisfies readonly {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
  width: number
}[]

type Width = number

const WidthContext = createContext<Width>(1440)

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [width, setWidth] = useState<Width>(1440)

  return (
    <WidthContext.Provider value={width}>
      <div
        role="group"
        aria-label="Preview width"
        className="mt-10 inline-flex items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-xs"
      >
        {VIEWPORTS.map((viewport) => {
          const active = width === viewport.width
          const Icon = viewport.icon

          return (
            <button
              key={viewport.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setWidth(viewport.width)
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                active
                  ? "bg-catalog-active text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {viewport.label}
            </button>
          )
        })}
      </div>

      {children}
    </WidthContext.Provider>
  )
}

/** A frame is its own viewport, so a size written in `vw` resolves against the
 *  chosen width rather than the reader's window. Narrowing an ordinary element
 *  would leave the text untouched and the numbers beside it wrong. */
export function ViewportFrame({
  group,
  title,
}: {
  group: string
  title: string
}) {
  const width = useContext(WidthContext)
  const frame = useRef<HTMLIFrameElement>(null)
  const column = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [loads, setLoads] = useState(0)

  useEffect(() => {
    const document_ = frame.current?.contentDocument

    if (!document_) {
      return
    }

    const observer = new ResizeObserver(() => {
      setHeight(document_.documentElement.scrollHeight)
    })

    observer.observe(document_.documentElement)

    return () => {
      observer.disconnect()
    }
  }, [width, loads])

  /** A frame wider than the column shows only its left part, so text laid out
   *  to the full frame width would break where nobody can see it and read as
   *  cut off. The frame keeps its width — that is what `vw` resolves against —
   *  and the samples inside wrap to whatever the column can actually show. */
  useEffect(() => {
    const document_ = frame.current?.contentDocument
    const element = column.current

    if (!document_ || !element) {
      return
    }

    const observer = new ResizeObserver(() => {
      document_.documentElement.style.setProperty(
        "--sample-width",
        `${String(Math.min(element.clientWidth, width))}px`,
      )
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [width, loads])

  /** The frame is a document of its own, so the script that reads the stored
   *  theme runs once, when it loads, and never hears the toggle afterwards.
   *  Left alone it keeps whichever theme it was born in — a white panel on a
   *  dark page. Watching the class the toggle writes is what carries it over. */
  useEffect(() => {
    const document_ = frame.current?.contentDocument

    if (!document_) {
      return
    }

    const sync = () => {
      document_.documentElement.classList.toggle(
        "dark",
        document.documentElement.classList.contains("dark"),
      )
    }

    sync()

    const observer = new MutationObserver(sync)

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
    }
  }, [loads])

  return (
    <div
      ref={column}
      className="mt-8 overflow-hidden rounded-xl border border-border"
    >
      <iframe
        ref={frame}
        src={`/specimens/typography?group=${group}`}
        title={`${title} specimens`}
        data-measures
        data-measured={height ? "" : undefined}
        style={{ width, height: height || 320 }}
        onLoad={() => {
          setLoads((count) => count + 1)
        }}
        className="block border-0 bg-card"
      />
    </div>
  )
}
