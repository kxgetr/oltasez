import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger"
  size?: "default" | "sm" | "lg"
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712]",
          "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
          // Varyantlar
          variant === "default" && [
            "bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 hover:from-teal-400 hover:via-cyan-400 hover:to-sky-400",
            "text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30",
          ],
          variant === "secondary" && [
            "bg-surface hover:bg-surface-muted text-slate-200 border border-surface-border hover:border-slate-600",
          ],
          variant === "outline" && [
            "border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400",
          ],
          variant === "ghost" && [
            "text-slate-300 hover:text-white hover:bg-slate-800/60",
          ],
          variant === "danger" && [
            "bg-rose-600/90 hover:bg-rose-600 text-white shadow-lg shadow-rose-600/20 border border-rose-500/40",
          ],
          // Boyutlar
          size === "sm" && "h-9 px-3.5 text-xs rounded-lg gap-1.5",
          size === "default" && "h-11 px-5 text-sm gap-2",
          size === "lg" && "h-13 px-7 text-base font-semibold gap-2.5",
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"
