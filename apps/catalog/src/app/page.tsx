import { redirect } from "next/navigation"

/** The way in.
 *
 *  Introduction rather than the component list: someone arriving here is
 *  reading about the system, not looking one component up. A list of twelve
 *  cards answers a question nobody asked yet. */
export default function HomePage() {
  redirect("/getting-started/introduction")
}
