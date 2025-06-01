import type { ReactNode } from "react";

type Props = {
  className?: string;
  href: string;
  children: ReactNode;
};

export default function Link({ className = "", href, children }: Props) {
  return (
    <a
      href={href}
      className={`text-blue-600 underline cursor-pointer hover:text-blue-700 ${className}`}
    >
      {children}
    </a>
  );
}
