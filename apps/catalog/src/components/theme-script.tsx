const script = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
