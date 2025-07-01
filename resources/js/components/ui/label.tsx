import * as React from "react"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "form-label fw-medium",
        className
      )}
      {...props}
    />
  )
}

export { Label }
