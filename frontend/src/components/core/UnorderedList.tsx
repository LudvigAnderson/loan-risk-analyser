import type { ReactNode, HTMLAttributes } from "react"

interface ULProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode
}

export default function UnorderedList({ children }: ULProps) {
  return (
    <ul className="list-disc list-outside">
      {children}
    </ul>
  )
}