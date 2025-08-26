import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 105 32"
    {...props}
  >
    <path
      fill="currentColor"
      d="M91.053.861a12.977 12.977 0 0 1 12.951 12.125l.027.853v4.325a12.973 12.973 0 0 1-12.12 12.946l-.854.027-68.587.002c-.97 0-1.927-.218-2.801-.636l-.64-.352L2.262 19.67a4.325 4.325 0 0 1-.404-7.058l.407-.285L19.032 1.844a6.488 6.488 0 0 1 2.716-.942l.721-.042L91.054.86ZM78.08 9.511l-54.991-.002-10.38 6.49 10.383 6.487 54.992.002-.004-12.978Zm17.303 4.328a4.326 4.326 0 0 0-3.784-4.292l-.541-.033-4.328-.003.003 12.977h4.325a4.325 4.325 0 0 0 4.291-3.783l.034-.542V13.84Z"
    />
  </svg>
)
export default SvgComponent
