import { useEffect, type RefObject } from "react"

/** A frame is a document of its own, so the script that reads the stored theme
 *  runs once, when it loads, and never hears the toggle afterwards. Left alone
 *  a frame keeps whichever theme it was born in: a white panel on a dark page.
 *  Watching the class the toggle writes is what carries it over. */
export function useFrameTheme(
  frame: RefObject<HTMLIFrameElement | null>,
  loads: number,
) {
  useEffect(() => {
    /** A frame partway through a navigation has a document with nothing in it
     *  yet, so the root has to be reached for rather than assumed. Reading
     *  through it there would throw here, in the body of an effect, which takes
     *  the whole page down rather than just the frame. The load that follows
     *  runs this again with a document that has one. */
    const root = frame.current?.contentDocument?.documentElement

    if (!root) {
      return
    }

    const sync = () => {
      root.classList.toggle(
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
  }, [frame, loads])
}
