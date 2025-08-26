import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 9 12"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        d="M0 6 .668.656A.75.75 0 0 1 1.413 0h3.952a.634.634 0 0 1 .595.858L4.875 3.75H8.14a.86.86 0 0 1 .71 1.345l-4.505 6.586a.737.737 0 0 1-.607.321H3.67a.67.67 0 0 1-.647-.83L4.125 6.75H.75A.75.75 0 0 1 0 6Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="currentColor" d="M0 0h9v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgComponent
