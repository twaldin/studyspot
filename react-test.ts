import { ButtonHTMLAttributes } from "react";

interface TestProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  foo: string;
}

const test: TestProps = {
  foo: "bar",
  className: "test-class", // This should work
  onClick: () => console.log("clicked"),
  disabled: false
};

console.log(test.className);