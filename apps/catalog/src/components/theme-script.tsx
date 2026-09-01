/** The catalog opens light, whatever the machine prefers.
 *
 *  It used to read `prefers-color-scheme`, which is the right default for a
 *  site somebody reads and the wrong one for a catalog: what is on screen here
 *  is the system's own light drawing, and someone arriving on a machine set to
 *  dark met a dark page and had to work out that the design was not what they
 *  were looking at. Dark is a mode this catalog can show, reached by asking
 *  for it, and the toggle remembers the asking.
 *
 *  It stays a blocking script for the reason it always was: a class added
 *  after paint is a flash of the other theme. */
const script = `try{if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
