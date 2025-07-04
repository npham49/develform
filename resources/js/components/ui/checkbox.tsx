import * as React from "react"

import { cn } from "@/lib/utils"

interface CheckboxProps extends React.ComponentProps<"input"> {
  checked?: boolean
  onClick?: () => void
}

function Checkbox({
  className,
  checked,
  onClick,
  onChange,
  ...props
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onClick?.()
    onChange?.(e)
  }

  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn("form-check-input", className)}
      checked={checked}
      onChange={handleChange}
      {...props}
    />
  )
}

export { Checkbox }
