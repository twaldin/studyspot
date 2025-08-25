import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 35 29"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M31.177 2H18.412l-7.294 25-5.47-10.714H2m20.059 0L33 27m-10.941 0L33 16.286"
    />
  </svg>
)
export default SvgComponent
