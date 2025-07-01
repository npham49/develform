import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface SheetContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextType | undefined>(undefined)

function Sheet({
  open,
  onOpenChange,
  children,
  ...props
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const setOpen = React.useCallback((newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }, [isControlled, onOpenChange])

  return (
    <SheetContext.Provider value={{ open: isOpen, setOpen }}>
      <div data-slot="sheet" {...props}>
        {children}
      </div>
    </SheetContext.Provider>
  )
}

function SheetTrigger({
  children,
  ...props
}: React.ComponentProps<"button">) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetTrigger must be used within Sheet")

  return (
    <button
      data-slot="sheet-trigger"
      onClick={() => context.setOpen(true)}
      {...props}
    >
      {children}
    </button>
  )
}

function SheetClose({
  children,
  ...props
}: React.ComponentProps<"button">) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetClose must be used within Sheet")

  return (
    <button
      data-slot="sheet-close"
      onClick={() => context.setOpen(false)}
      {...props}
    >
      {children}
    </button>
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right" | "top" | "bottom"
}) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetContent must be used within Sheet")

  if (!context.open) return null

  return (
    <>
      <div 
        className="offcanvas-backdrop fade show"
        onClick={() => context.setOpen(false)}
      />
      <div
        data-slot="sheet-content"
        className={cn(
          "offcanvas show",
          side === "left" && "offcanvas-start",
          side === "right" && "offcanvas-end", 
          side === "top" && "offcanvas-top",
          side === "bottom" && "offcanvas-bottom",
          className
        )}
        tabIndex={-1}
        {...props}
      >
        {children}
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 mt-3 me-3"
          onClick={() => context.setOpen(false)}
        >
          <XIcon size={16} />
          <span className="visually-hidden">Close</span>
        </button>
      </div>
    </>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("offcanvas-header", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("offcanvas-footer mt-auto p-3", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="sheet-title"
      className={cn("offcanvas-title fw-semibold", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="sheet-description"
      className={cn("text-muted small", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}