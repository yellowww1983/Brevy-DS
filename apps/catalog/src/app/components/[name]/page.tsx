import { notFound } from "next/navigation"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { ComponentView } from "@/components/component-view"
import { ContentPage } from "@/components/content-page"
import { components, docFor, getComponent } from "@/registry"

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

  return (
    <div>
      <div className="mb-5">
        <Breadcrumbs />
      </div>

      <ContentPage markdown={await docFor(name)}>
        <ComponentView slug={name} />
      </ContentPage>
    </div>
  )
}
