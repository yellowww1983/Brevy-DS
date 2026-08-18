import { notFound } from "next/navigation"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { ComponentView } from "@/components/component-view"
import { components, getComponent } from "@/registry"

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
    <div className="mx-auto max-w-6xl">
      <div className="mb-5">
        <Breadcrumbs />
      </div>

      <ComponentView slug={name} />
    </div>
  )
}
