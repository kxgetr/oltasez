import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "flat"
  glowColor?: "cyan" | "emerald" | "amber" | "rose" | "none"
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", glowColor = "none", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-300",
          variant === "default" && "glass-panel shadow-card-glass",
          variant === "interactive" && "glass-panel-interactive shadow-card-glass cursor-pointer",
          variant === "flat" && "bg-surface/50 border border-surface-border",
          glowColor === "cyan" && "shadow-[0_0_35px_-5px_rgba(6,182,212,0.25)] border-cyan-500/40",
          glowColor === "emerald" && "shadow-[0_0_35px_-5px_rgba(16,185,129,0.25)] border-emerald-500/40",
          glowColor === "amber" && "shadow-[0_0_35px_-5px_rgba(245,158,11,0.25)] border-amber-500/40",
          glowColor === "rose" && "shadow-[0_0_35px_-5px_rgba(239,68,68,0.3)] border-rose-500/40",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-3", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold tracking-tight text-white", className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-400 mt-1", className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-3", className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0 flex items-center", className)} {...props} />
}
