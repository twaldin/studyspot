import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 27 39"
    {...props}
  >
    <path
      fill="currentColor"
      d="M3.857 0h19.286c1.023 0 2.004.41 2.727 1.142A3.922 3.922 0 0 1 27 3.9v31.2a3.922 3.922 0 0 1-1.13 2.758A3.836 3.836 0 0 1 23.143 39H3.857a3.836 3.836 0 0 1-2.727-1.142A3.922 3.922 0 0 1 0 35.1V3.9c0-1.034.406-2.026 1.13-2.758A3.836 3.836 0 0 1 3.857 0Zm0 3.9v7.8h19.286V3.9H3.857Zm0 11.7v3.9h3.857v-3.9H3.857Zm7.714 0v3.9h3.858v-3.9H11.57Zm7.715 0v3.9h3.857v-3.9h-3.857ZM3.857 23.4v3.9h3.857v-3.9H3.857Zm7.714 0v3.9h3.858v-3.9H11.57Zm7.715 0v3.9h3.857v-3.9h-3.857ZM3.857 31.2v3.9h3.857v-3.9H3.857Zm7.714 0v3.9h3.858v-3.9H11.57Zm7.715 0v3.9h3.857v-3.9h-3.857Z"
    />
  </svg>
)
export default SvgComponent
