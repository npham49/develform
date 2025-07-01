import * as React from "react"

import { cn } from "@/lib/utils"

interface SeparatorProps extends React.ComponentProps<"hr"> {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <hr
      data-slot="separator-root"
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "border-top",
        orientation === "vertical" && "border-start h-100",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
