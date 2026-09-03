import { BrevyLockup } from "@brevy/ui"

/** Half the logo's height, drawn rather than described.
 *
 *  The lockup stands at its own 40 and the ring around it is `p-5`, which is
 *  the 20 the rule asks for. The inner outline is the drawing's own box, so a
 *  reader can see that the margin is measured from the artwork and not from
 *  some padded container around it. */
export function LogoClearSpace() {
  return (
    <div className="flex flex-col gap-6 tablet:flex-row tablet:items-start">
      <div className="w-fit rounded-xl border border-dashed border-primary/60 p-5">
        <BrevyLockup className="h-10 w-auto text-brand-500 outline-1 outline-offset-0 outline-border dark:text-primary" />
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 self-center text-sm">
        <dt className="text-muted-foreground">The dashed ring</dt>
        <dd className="tabular-nums">
          20px, which is half of the 40 it stands at
        </dd>

        <dt className="text-muted-foreground">The rule</dt>
        <dd>0.5 h on every side, whatever h is</dd>

        <dt className="text-muted-foreground">Why half</dt>
        <dd>
          The mark sits 0.300 h from the wordmark, so half a height keeps
          anything outside further off than the logo&rsquo;s own parts
        </dd>
      </dl>
    </div>
  )
}
