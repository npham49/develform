import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "badge d-inline-flex align-items-center justify-content-center rounded border px-2 py-1 text-xs fw-medium",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white",
        secondary:
          "bg-secondary text-white",
        destructive:
          "bg-danger text-white",
        outline:
          "bg-outline-secondary text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
