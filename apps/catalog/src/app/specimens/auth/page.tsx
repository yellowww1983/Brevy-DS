import { AuthSplit } from "@brevy/ui"
import Image from "next/image"

import { PHOTOGRAPH, PRESET, WASH } from "@/auth"
import { LoginForm } from "@/components/login-form"

/** Rendered inside a frame on the Login page. It lives outside the catalog
 *  shell because the screen turns at the content breakpoint — the photograph
 *  arrives and the column moves to its half — and a breakpoint only means
 *  something in a document of its own. */
export default async function AuthSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{ photograph?: string }>
}) {
  const query = await searchParams
  const centred = query.photograph === "off"

  return (
    <AuthSplit
      heading={PRESET.heading}
      description={PRESET.description}
      wash={
        <Image
          src={WASH.src}
          alt=""
          fill
          priority
          unoptimized
          className="object-cover"
        />
      }
      photograph={
        centred ? undefined : (
          <Image
            src={PHOTOGRAPH.src}
            alt={PHOTOGRAPH.alt}
            width={PHOTOGRAPH.width}
            height={PHOTOGRAPH.height}
            priority
            unoptimized
            className="size-full object-cover"
          />
        )
      }
    >
      <LoginForm />
    </AuthSplit>
  )
}
