import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button as HeadlessButton } from "@headlessui/react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function Button({ children, className="", ...props }: ButtonProps) {
  return (
    <HeadlessButton className={`btn ${className}`} {...props}>
      {children}
    </HeadlessButton>
  )
}