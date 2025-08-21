import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button as HeadlessButton } from "@headlessui/react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function Button({ children, className="btn", ...props }: ButtonProps) {
  return (
    <HeadlessButton className={className} {...props}>
      {children}
    </HeadlessButton>
  )
}