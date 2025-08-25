import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 33 42"
    {...props}
  >
    <path
      fill="currentColor"
      d="M30 12.368V27.68a5.955 5.955 0 0 0-7.243.962 6.1 6.1 0 0 0-.953 7.308 6.017 6.017 0 0 0 2.9 2.566c1.22.51 2.573.6 3.849.255a5.998 5.998 0 0 0 3.207-2.163A6.09 6.09 0 0 0 33 32.922V2.424A2.439 2.439 0 0 0 31.983.442a2.388 2.388 0 0 0-2.193-.3l-19.2 6.92a2.403 2.403 0 0 0-1.153.886A2.437 2.437 0 0 0 9 9.34v21.362a5.956 5.956 0 0 0-7.242.962 6.1 6.1 0 0 0-.955 7.307 6.017 6.017 0 0 0 2.9 2.566c1.22.51 2.572.6 3.848.256a5.998 5.998 0 0 0 3.208-2.16A6.09 6.09 0 0 0 12 35.948v-17.1l18-6.48Z"
    />
  </svg>
)
export default SvgComponent
