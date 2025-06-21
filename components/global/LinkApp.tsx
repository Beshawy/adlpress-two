import Link from "next/link"
import React from "react"

export default function LinkApp({children,href, className}: {
    children: React.ReactNode
    href: string,
    className?: string
}) {
  return (
    <Link href={`${href}`} className={className}>{children}</Link>
  )
}
