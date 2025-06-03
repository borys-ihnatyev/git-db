import type { TextareaHTMLAttributes } from "react";

export default function TextArea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`border-2 border-blue-500 rounded-2xl p-4 ${className}`}
      {...rest}
    ></textarea>
  );
}
