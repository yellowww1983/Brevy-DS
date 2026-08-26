import type { ComponentProps } from "react"

/** LinkedIn, exported from the design file. See facebook.tsx for why the
 *  brand marks live here as components and carry their own stroke. */
function LinkedIn(props: ComponentProps<"svg">) {
  return (
    <svg
      data-brand="linkedin"
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
      <path d="M10.6641 5.33203C11.7249 5.33203 12.7423 5.75346 13.4925 6.5036C14.2426 7.25375 14.6641 8.27117 14.6641 9.33203V13.9987H11.9974V9.33203C11.9974 8.97841 11.8569 8.63927 11.6069 8.38922C11.3568 8.13917 11.0177 7.9987 10.6641 7.9987C10.3104 7.9987 9.9713 8.13917 9.72125 8.38922C9.47121 8.63927 9.33073 8.97841 9.33073 9.33203V13.9987H6.66406V9.33203C6.66406 8.27117 7.08549 7.25375 7.83564 6.5036C8.58578 5.75346 9.6032 5.33203 10.6641 5.33203Z" />
      <path d="M4.0026 6H1.33594V14H4.0026V6Z" />
      <path d="M2.66927 3.9987C3.40565 3.9987 4.0026 3.40174 4.0026 2.66536C4.0026 1.92898 3.40565 1.33203 2.66927 1.33203C1.93289 1.33203 1.33594 1.92898 1.33594 2.66536C1.33594 3.40174 1.93289 3.9987 2.66927 3.9987Z" />
    </svg>
  )
}

export { LinkedIn }
