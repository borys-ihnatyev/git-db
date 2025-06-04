import { createElement, type ReactNode } from "react";

type Props = {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
};
export default function Heading({ children, size = 1 }: Props) {
  const type = "h" + size;

  return createElement(type, {
    className: "font-bold text-6xl",
    children,
  });
}
