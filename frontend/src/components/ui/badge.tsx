import * as React from "react"
import { cn } from "@/lib/utils"
import { RiskStatus } from "@/types/analysis"
import { getStatusStyle } from "@/lib/status-styles"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: RiskStatus | string
  variant?: "safe" | "suspicious" | "danger" | "neutral" | "cyber"
  showDot?: boolean
}

export function Badge({
  className,
  status,
  variant = "neutral",
  showDot = true,
  children,
  ...props
}: BadgeProps) {
  // Eğer status ("safe" | "suspicious" | "phishing") verilmişse merkezi stilden çeker
  if (status) {
    const style = getStatusStyle(status);
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide border transition-all",
          style.badgeBg,
          style.badgeBorder,
          style.badgeText,
          className
        )}
        {...props}
      >
        {showDot && <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", style.dotColor)} />}
        {children || style.label}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide border transition-colors",
        variant === "safe" && "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
        variant === "suspicious" && "bg-amber-500/10 text-amber-300 border-amber-500/30",
        variant === "danger" && "bg-rose-500/15 text-rose-300 border-rose-500/40",
        variant === "cyber" && "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
        variant === "neutral" && "bg-slate-800/80 text-slate-300 border-slate-700/80",
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "safe" && "bg-emerald-400 animate-pulse",
            variant === "suspicious" && "bg-amber-400 animate-pulse",
            variant === "danger" && "bg-rose-400 animate-pulse",
            variant === "cyber" && "bg-cyan-400 animate-pulse",
            variant === "neutral" && "bg-slate-400"
          )}
        />
      )}
      {children}
    </div>
  )
}
