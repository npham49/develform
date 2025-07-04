import * as React from "react"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "position-relative d-inline-flex rounded-circle overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="avatar-image"
      className={cn("w-100 h-100", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "bg-secondary d-flex align-items-center justify-content-center rounded-circle w-100 h-100",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
