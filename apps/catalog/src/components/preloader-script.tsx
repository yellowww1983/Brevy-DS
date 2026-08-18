/** Runs before the first paint, like ThemeScript: a returning reader must not
 *  see the overlay flash before React gets a chance to take it down. */
const script = `try{if(sessionStorage.getItem("preloader")){document.documentElement.dataset.preloader="skip"}}catch(e){}`

export function PreloaderScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
