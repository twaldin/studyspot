import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 37 35"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.5}
      d="M31.134 33H10.74l-8.176-8.33a1.935 1.935 0 0 1 0-2.733L21.986 2.563a1.945 1.945 0 0 1 2.738 0l9.711 9.687a1.935 1.935 0 0 1 0 2.732L16.568 33M29.19 20.02 16.957 7.813"
    />
  </svg>
)
export default SvgComponent
