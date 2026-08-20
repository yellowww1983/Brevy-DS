/** Runs before the first paint, like ThemeScript: a returning reader must not
 *  see the overlay flash before React gets a chance to take it down. An
 *  embedded document skips it outright: nobody waits on a frame. */
const script = `try{if(sessionStorage.getItem("preloader")||window.self!==window.top){document.documentElement.dataset.preloader="skip"}}catch(e){}`

export function PreloaderScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
