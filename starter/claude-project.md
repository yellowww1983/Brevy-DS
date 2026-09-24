## This project

- It is one landing page. The page is `src/app/page.tsx`; build it there, and split sections into files under `src/app/` when it gets long.
- Start the dev server with `pnpm dev` before you change anything, so the person you are working with watches the page change as you build it.
- If `pnpm` is not found, run `corepack enable` first, then `pnpm install`.
- Never a raw value: `bg-secondary`, not a hex in a class; `p-6`, not `p-[24px]`. Every colour, size, radius and spacing comes from the tokens.
- Do not edit anything in `vendor/` or `node_modules/`. The package is Brevy's and is shared; compose out of what it ships.
