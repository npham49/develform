import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

function Dialog({
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
    <DialogContext.Provider value={{ open: isOpen, setOpen }}>
      <div data-slot="dialog" {...props}>
        {children}
      </div>
    </DialogContext.Provider>
  )
}

function DialogTrigger({
  children,
  ...props
}: React.ComponentProps<"button">) {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogTrigger must be used within Dialog")

  return (
    <button
      data-slot="dialog-trigger"
      onClick={() => context.setOpen(true)}
      {...props}
    >
      {children}
    </button>
  )
}

function DialogClose({
  children,
  ...props
}: React.ComponentProps<"button">) {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogClose must be used within Dialog")

  return (
    <button
      data-slot="dialog-close"
      onClick={() => context.setOpen(false)}
      {...props}
    >
      {children}
    </button>
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogContent must be used within Dialog")

  if (!context.open) return null

  return (
    <>
      <div 
        className="modal-backdrop fade show"
        onClick={() => context.setOpen(false)}
      />
      <div
        data-slot="dialog-content"
        className={cn("modal fade show d-block", className)}
        tabIndex={-1}
        {...props}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
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
        </div>
      </div>
    </>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("modal-header", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("modal-footer", className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="dialog-title"
      className={cn("modal-title fw-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-muted small", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
}
