"use client"

import { Check, ChevronDown, Copy, Download, FolderDown } from "lucide-react"
import { DropdownMenu } from "radix-ui"
import { useState } from "react"

import { STARTER_FILE, STARTER_HREF } from "@/starter"

import { useCopy } from "./use-copy"

/** What the downloaded file is called. Named for what it is rather than for
 *  the convention it is served under: `llms-full.txt` means nothing to someone
 *  looking through their downloads. Markdown, because that is what it is. */
const FILENAME = "brevy-design-system.md"

const ITEM =
  "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 outline-none data-[highlighted]:bg-catalog-hover"

const HALF =
  "inline-flex h-full items-center hover:bg-catalog-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"

/** Hands over the whole system at once, pasted or as a file.
 *
 *  Both fetch `/llms-full.txt` rather than assembling anything, which is what
 *  keeps this a button. The documentation is 119KB and the alternative is
 *  importing it into a client component, which would send all of it to every
 *  visitor whether or not anybody presses this.
 *
 *  It also means there is one aggregate rather than three: what lands on the
 *  clipboard and what lands in the downloads folder are the file, byte for
 *  byte, so none of them can come apart.
 *
 *  The download exists because the paste does not fit. A chat message stops
 *  well short of 119KB and the end of the system — the blocks — never
 *  arrives; an attachment has no such limit. Copy stays the first choice and
 *  the file sits one step behind it, because a single page's worth still
 *  pastes fine.
 *
 *  It lives in the top bar because it is about the catalog rather than about
 *  the page — the page's own Copy for Claude sits with the page, and these
 *  answer different questions. */
export function CopySystem() {
  const { copied, copy } = useCopy()
  const [failed, setFailed] = useState(false)

  return (
    <div className="inline-flex h-8 shrink-0 items-stretch overflow-hidden rounded-md border border-border text-xs font-medium text-foreground">
      <button
        type="button"
        aria-label="Copy the whole system for Claude"
        onClick={() => {
          setFailed(false)
          void fetch("/llms-full.txt")
            .then((response) => response.text())
            .then(copy)
            .catch(() => {
              setFailed(true)
            })
        }}
        className={`${HALF} gap-1.5 px-2.5`}
      >
        {copied ? (
          <Check
            className="size-3.5 icon-stroke text-sidebar-primary"
            aria-hidden
          />
        ) : (
          <Copy className="size-3.5 icon-stroke" aria-hidden />
        )}
        <span aria-live="polite">
          {failed ? "Try again" : copied ? "Copied" : "Copy entire system"}
        </span>
      </button>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          aria-label="More ways to get the whole system"
          className={`${HALF} border-l border-border px-1.5 data-[state=open]:bg-catalog-hover`}
        >
          <ChevronDown className="size-3.5 icon-stroke" aria-hidden />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={4}
            className="z-50 min-w-48 rounded-md border border-border bg-popover p-1 text-xs font-medium text-popover-foreground shadow-md"
          >
            <DropdownMenu.Item asChild>
              <a href="/llms-full.txt" download={FILENAME} className={ITEM}>
                <Download className="size-3.5 icon-stroke" aria-hidden />
                Download entire system
              </a>
            </DropdownMenu.Item>

            {/* A different reader from the two above: they hand the system
                to Claude, this hands a person a project to build in. */}
            <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-border" />
            <DropdownMenu.Label className="px-2 pt-1 pb-0.5 text-xs font-normal text-muted-foreground">
              Start a new page
            </DropdownMenu.Label>
            <DropdownMenu.Item asChild>
              <a href={STARTER_HREF} download={STARTER_FILE} className={ITEM}>
                <FolderDown className="size-3.5 icon-stroke" aria-hidden />
                Download starter project
              </a>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}
