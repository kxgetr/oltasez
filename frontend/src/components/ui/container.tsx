import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "full"
}

export function Container({ className, size = "default", children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        size === "sm" && "max-w-3xl",
        size === "default" && "max-w-5xl",
        size === "lg" && "max-w-7xl",
        size === "full" && "max-w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
