import * as React from "react"

import { cn } from "@/lib/utils"

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function TooltipTrigger({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tooltip-trigger"
      {...props}
    >
      {children}
    </div>
  )
}

function TooltipContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tooltip-content"
      className={cn("tooltip bs-tooltip-auto", className)}
      role="tooltip"
      {...props}
    >
      <div className="tooltip-inner">
        {children}
      </div>
    </div>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
}