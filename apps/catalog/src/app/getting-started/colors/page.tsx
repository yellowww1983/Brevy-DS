import { ContentPage, HEADING } from "@/components/content-page"
import { CopyToken, PaletteSwatch, TokenSwatch } from "@/components/swatch"
import type { Section } from "@/components/table-of-contents"
import { BORROWED, BRAND_GROUPS, OMITTED, SEMANTIC_GROUPS } from "@/colors"

const SECTIONS: readonly Section[] = [
  { id: "brand-palette", title: "Brand palette" },
  { id: "semantic-tokens", title: "Semantic tokens" },
  { id: "borrowed", title: "Borrowed" },
  { id: "not-in-the-system", title: "Not in the system" },
]

const SUB_HEADING = "mt-10 text-base font-semibold"
const NOTE = "mt-2 text-sm leading-relaxed text-muted-foreground"

function Ramp({
  family,
  shades,
}: {
  family: string
  shades: readonly string[]
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{family}</p>
      <div className="flex flex-col gap-0.5">
        {shades.map((shade) => (
          <PaletteSwatch key={shade} family={family} shade={shade} />
        ))}
      </div>
    </div>
  )
}

export default function ColorsPage() {
  return (
    <ContentPage sections={SECTIONS}>
      <h1 className="text-4xl font-bold tracking-tight">Colors</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Ten ramps drawn for Brevy, and a short set of names that decide which of
        them a page actually gets. Every value below is read off the colour the
        browser paints, so nothing here can drift from what ships. Click a name
        to copy it.
      </p>

      <h2 id="brand-palette" className={HEADING}>
        Brand palette
      </h2>
      <p className="mt-4 leading-relaxed">
        The full ramps, including shades nothing has reached for yet — this is
        the palette that exists to be used, not an inventory of what has been
        used so far.
      </p>

      {BRAND_GROUPS.map((group) => (
        <section key={group.id}>
          <h3 className={SUB_HEADING}>{group.title}</h3>
          <p className={NOTE}>{group.note}</p>
          <div className="mt-5 grid gap-8 sm:grid-cols-2">
            {group.ramps.map((ramp) => (
              <Ramp
                key={ramp.family}
                family={ramp.family}
                shades={ramp.shades}
              />
            ))}
          </div>
        </section>
      ))}

      <h2 id="semantic-tokens" className={HEADING}>
        Semantic tokens
      </h2>
      <p className="mt-4 leading-relaxed">
        These are the names a page asks for. Each one resolves to a different
        colour depending on the theme, which is the whole point of using it
        instead of a ramp — and the reason both answers are shown side by side
        here rather than one at a time.
      </p>

      {SEMANTIC_GROUPS.map((group) => (
        <section key={group.id}>
          <h3 className={SUB_HEADING}>{group.title}</h3>
          <p className={NOTE}>{group.note}</p>

          <div className="mt-5">
            <div className="grid grid-cols-3 gap-4 border-b border-border pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <span>Token</span>
              <span>Light</span>
              <span>Dark</span>
            </div>

            {group.tokens.map((token) => (
              <div
                key={token.token}
                data-token={token.token}
                className="grid grid-cols-3 items-center gap-4 border-b border-border py-3"
              >
                <CopyToken token={token.token} />
                <TokenSwatch
                  token={token.token}
                  source={token.light}
                  theme="light"
                />
                <TokenSwatch
                  token={token.token}
                  source={token.dark}
                  theme="dark"
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <h2 id="borrowed" className={HEADING}>
        Borrowed
      </h2>
      <p className="mt-4 leading-relaxed">
        Three ramps that came from Tailwind rather than from the Brevy palette,
        and only the shades something reaches for — what the design draws, plus
        what a semantic token resolves to in either theme. The rest of each ramp
        is still available in code and deliberately absent here.
      </p>
      <p className={NOTE}>
        Worth knowing: neutral and zinc are not pinned. Every other ramp on this
        page is written out in the token file with values taken from the design;
        these two are not written down at all, so they fall through to
        Tailwind&rsquo;s own — recomputed values, not the drawn ones.
      </p>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {BORROWED.map((ramp) => (
          <div key={ramp.family}>
            <Ramp family={ramp.family} shades={ramp.shades} />
            <p className={NOTE}>{ramp.why}</p>
          </div>
        ))}
      </div>

      <h2 id="not-in-the-system" className={HEADING}>
        Not in the system
      </h2>
      <p className="mt-4 leading-relaxed">
        Six more ramps sit in the token file — {OMITTED.join(", ")} — and no
        swatch of them appears here. Nothing in the design draws them, and the
        only thing in code that names them is a set of five chart colours that
        no component renders. They are reachable if a chart ever needs them, and
        showing sixty-six swatches for it would bury the palette that is
        actually in use.
      </p>
    </ContentPage>
  )
}
