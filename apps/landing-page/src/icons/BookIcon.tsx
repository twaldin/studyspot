import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 40 36"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.75}
      d="M20 9.111V34m0-24.889a7.067 7.067 0 0 0-2.109-5.028A7.246 7.246 0 0 0 12.8 2h-9c-.477 0-.935.187-1.273.52A1.767 1.767 0 0 0 2 3.779v23.11c0 .472.19.925.527 1.258.338.333.796.52 1.273.52h10.8c1.432 0 2.806.563 3.818 1.563A5.3 5.3 0 0 1 20 34m0-24.889c0-1.886.759-3.695 2.109-5.028A7.246 7.246 0 0 1 27.2 2h9c.477 0 .935.187 1.273.52.337.334.527.786.527 1.258v23.11c0 .472-.19.925-.527 1.258-.338.333-.796.52-1.273.52H25.4a5.434 5.434 0 0 0-3.818 1.563A5.3 5.3 0 0 0 20 34"
    />
  </svg>
)
export default SvgComponent
