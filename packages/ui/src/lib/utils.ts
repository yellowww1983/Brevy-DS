import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/** The eight type roles this system names, which Tailwind mints from
 *  `--text-*` in the token file.
 *
 *  tailwind-merge has to be told about them. It reads `text-` and decides
 *  between a size and a colour by whether the value is one it knows; a name it
 *  has never heard of is filed as a colour. So `cn("text-h2", "text-emerald-500")`
 *  quietly dropped the size and left a 16px heading — a class that is in the
 *  source, absent from the DOM, and impossible to see in review.
 *
 *  It only bit where a class list is merged rather than written out, which is
 *  every block that branches a heading's colour on a prop. Written here rather
 *  than worked around at each call site, because the next one would not know
 *  to. */
const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["h1", "h2", "h3", "body-lg", "body", "caption", "label"],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return merge(clsx(inputs))
}
