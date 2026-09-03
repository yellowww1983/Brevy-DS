import { Banner, Navbar } from "@brevy/ui"

import { BrevyWordmark } from "@/components/brevy-logo"
import { PRESET } from "@/banner"
import { LINKS } from "@/navbar"

/** Rendered inside a frame on the Banner page. It lives outside the catalog
 *  so the block sees a document of its own: the strip is the first thing in
 *  it, and what the strip does to a page can only be shown by giving it one.
 *
 *  The navbar is here because it is the thing the banner moves. Without it a
 *  reader would see a green strip and have to take on trust that anything
 *  followed. */
export default async function BannerSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{ banner?: string }>
}) {
  const query = await searchParams
  const banner = query.banner !== "off"

  return (
    <main className="min-h-160 bg-background">
      {banner ? (
        <Banner
          prefix={PRESET.prefix}
          label={PRESET.label}
          platforms={PRESET.platforms}
        />
      ) : null}

      <Navbar banner={banner} logo={<BrevyWordmark />} links={LINKS} />

      {/* Something under it, so the drop is visible rather than described. */}
      <div data-slot="banner-page-body" className="pt-40">
        <p className="px-6 text-center text-body text-muted-foreground">
          The page starts here.
        </p>
      </div>
    </main>
  )
}
