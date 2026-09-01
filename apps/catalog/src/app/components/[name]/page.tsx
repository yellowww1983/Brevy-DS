import { notFound } from "next/navigation"

import { buttonDoc } from "@/button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ComponentView } from "@/components/component-view"
import { ContentPage } from "@/components/content-page"
import { formDoc } from "@/form"
import { inputDoc } from "@/input"
import { labelDoc } from "@/label"
import { components, getComponent } from "@/registry"

/** Which components can hand themselves to Claude.
 *
 *  A map beside the page rather than a field on the registry entry, because
 *  the registry is a client module that renders previews and a doc is a
 *  string. It moves onto the entry when the two inventories merge; until
 *  then a component appears here the day its doc is written, and the ones
 *  without one keep the page they already had. */
const DOCS: Readonly<Record<string, () => string>> = {
  button: buttonDoc,
  form: formDoc,
  input: inputDoc,
  label: labelDoc,
}

export function generateStaticParams() {
  return components.map((entry) => ({ name: entry.slug }))
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  if (!getComponent(name)) {
    notFound()
  }

  const doc = DOCS[name]

  return (
    <div>
      <div className="mb-5">
        <Breadcrumbs />
      </div>

      <ContentPage markdown={doc?.()}>
        <ComponentView slug={name} />
      </ContentPage>
    </div>
  )
}
