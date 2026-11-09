import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isError = false, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border bg-surface/80 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500",
          "shadow-inner backdrop-blur-md transition-all duration-200",
          "focus:outline-none focus:ring-2",
          isError
            ? "border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/20 text-rose-200"
            : "border-surface-border focus:border-cyan-400 focus:ring-cyan-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
