import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "btn d-inline-flex align-items-center justify-content-center gap-2 rounded text-sm fw-medium",
  {
    variants: {
      variant: {
        default: "btn-outline-secondary",
        outline: "btn-outline-secondary border",
      },
      size: {
        default: "btn-sm",
        sm: "btn-sm",
        lg: "btn-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
