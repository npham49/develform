import * as React from "react"
import { CheckIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface DropdownContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined)

function DropdownMenu({
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
    <DropdownContext.Provider value={{ open: isOpen, setOpen }}>
      <div data-slot="dropdown-menu" className="dropdown" {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

function DropdownMenuTrigger({
  children,
  ...props
}: React.ComponentProps<"button">) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu")

  return (
    <button
      data-slot="dropdown-menu-trigger"
      className="dropdown-toggle"
      data-bs-toggle="dropdown"
      onClick={() => context.setOpen(!context.open)}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuContent({
  className,
  children,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
}) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu")

  if (!context.open) return null

  return (
    <div
      data-slot="dropdown-menu-content"
      className={cn(
        "dropdown-menu show",
        align === "end" && "dropdown-menu-end",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({
  className,
  children,
  variant = "default",
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "default" | "destructive"
}) {
  const context = React.useContext(DropdownContext)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    context?.setOpen(false)
    props.onClick?.(e)
  }

  return (
    <button
      data-slot="dropdown-menu-item"
      className={cn(
        "dropdown-item",
        variant === "destructive" && "text-danger",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<"button"> & {
  checked?: boolean
}) {
  return (
    <DropdownMenuItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn("d-flex align-items-center", className)}
      {...props}
    >
      <span className="me-2">
        {checked && <CheckIcon className="h-4 w-4" />}
      </span>
      {children}
    </DropdownMenuItem>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <DropdownMenuItem
      data-slot="dropdown-menu-radio-item"
      className={cn("d-flex align-items-center", className)}
      {...props}
    >
      <span className="me-2">
        <CircleIcon className="h-2 w-2 opacity-50" />
      </span>
      {children}
    </DropdownMenuItem>
  )
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn("dropdown-header", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"hr">) {
  return (
    <hr
      data-slot="dropdown-menu-separator"
      className={cn("dropdown-divider", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("opacity-60 ms-auto text-xs", className)}
      {...props}
    />
  )
}

function DropdownMenuGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-group"
      className={cn("", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
}