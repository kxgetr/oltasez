import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-800/60 border border-slate-700/40",
        className
      )}
      {...props}
    />
  )
}

export function CyberLoadingScan({ text = "URL Analiz Ediliyor..." }: { text?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-full max-w-md h-2 rounded-full bg-slate-800 cyber-scan-line border border-cyan-500/30" />
      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-wider">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        {text}
      </div>
    </div>
  )
}
