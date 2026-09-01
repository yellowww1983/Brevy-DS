import { llmsMap } from "@/llms"

/** Built once, like every other page here. Nothing about it depends on who is
 *  asking. */
export const dynamic = "force-static"

export function GET() {
  return new Response(llmsMap(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  })
}
