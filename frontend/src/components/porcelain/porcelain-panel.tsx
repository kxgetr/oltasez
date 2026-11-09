import React from "react";

interface PorcelainPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "solid" | "glass" | "frost";
  className?: string;
}

export function PorcelainPanel({
  children,
  variant = "solid",
  className = "",
  ...props
}: PorcelainPanelProps) {
  let baseStyle = "rounded-xl border transition-all duration-150";

  if (variant === "solid") {
    baseStyle += " bg-surface border-border-subtle shadow-subtle";
  } else if (variant === "glass") {
    baseStyle += " porcelain-glass shadow-elevated";
  } else if (variant === "frost") {
    baseStyle += " bg-frost/70 border-border-subtle backdrop-blur-md";
  }

  return (
    <div className={`${baseStyle} ${className}`} {...props}>
      {children}
    </div>
  );
}
