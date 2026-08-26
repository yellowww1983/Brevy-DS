import type { ComponentProps } from "react"

/** Instagram, exported from the design file. See facebook.tsx for why the
 *  brand marks live here as components and carry their own stroke.
 *
 *  Figma exports this one wrapped in a clip path whose rectangle is the whole
 *  16 box, so it clips nothing; it is dropped, along with the global id it
 *  carried, which would have collided the moment two instances shared a
 *  page. */
function Instagram(props: ComponentProps<"svg">) {
  return (
    <svg
      data-brand="instagram"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M11.3359 1.33203H4.66927C2.82832 1.33203 1.33594 2.82442 1.33594 4.66536V11.332C1.33594 13.173 2.82832 14.6654 4.66927 14.6654H11.3359C13.1769 14.6654 14.6693 13.173 14.6693 11.332V4.66536C14.6693 2.82442 13.1769 1.33203 11.3359 1.33203Z" />
      <path d="M10.6639 7.5802C10.7461 8.13503 10.6514 8.70168 10.393 9.19954C10.1347 9.69741 9.72596 10.1011 9.22495 10.3533C8.72394 10.6055 8.15617 10.6933 7.60239 10.6042C7.04862 10.515 6.53704 10.2536 6.14043 9.85698C5.74381 9.46036 5.48236 8.94878 5.39325 8.39501C5.30414 7.84124 5.39191 7.27346 5.64408 6.77245C5.89626 6.27144 6.29999 5.86269 6.79786 5.60436C7.29572 5.34603 7.86237 5.25126 8.4172 5.33353C8.98315 5.41746 9.5071 5.68118 9.91166 6.08574C10.3162 6.4903 10.5799 7.01425 10.6639 7.5802Z" />
      <path d="M11.6641 4.33203H11.6707" />
    </svg>
  )
}

export { Instagram }
