import * as React from "react"

import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<React.ComponentProps<"input">, "type"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Switch({
  className,
  checked,
  onCheckedChange,
  onChange,
  ...props
}: SwitchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked)
    onChange?.(e)
  }

  return (
    <input
      type="checkbox"
      data-slot="switch"
      className={cn("form-check-input", className)}
      checked={checked}
      onChange={handleChange}
      {...props}
    />
  )
}

export { Switch }
