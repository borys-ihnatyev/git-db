import type { InputHTMLAttributes } from "react";

export default function Input({
  className,
  type = "text",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`border-2 border-blue-500 rounded-2xl px-4 py-2 ${className}`}
      type={type}
      {...rest}
    ></input>
  );
}
