import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

type Props = {
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function Button({
  className = "",
  type,
  children,
  onClick,
}: Props) {
  return (
    <button
      type={type}
      className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 active:bg-blue-900 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
