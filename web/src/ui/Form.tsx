import type { FormHTMLAttributes } from "react";

export default function Form({
  className,
  ...props
}: FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      className={`flex flex-col gap-y-8 border-4 rounded-4xl p-8 ${className}`}
      {...props}
    />
  );
}
