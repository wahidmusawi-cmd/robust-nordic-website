import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({
  variant = "black",
  className,
  priority = false,
}: {
  variant?: "black" | "white"
  className?: string
  priority?: boolean
}) {
  const src = variant === "white" ? "/brand/robust-nordic-white.png" : "/brand/robust-nordic-black.png"
  return (
    <Link href="/" aria-label="Robust Nordic etusivu" className={cn("inline-flex items-center", className)}>
      <Image
        src={src || "/placeholder.svg"}
        alt="Robust Nordic"
        width={3792}
        height={1057}
        priority={priority}
        className="h-7 w-auto"
      />
    </Link>
  )
}
