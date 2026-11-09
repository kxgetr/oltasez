import React from "react";

interface FrostedToolbarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  center?: React.ReactNode;
  className?: string;
}

export function FrostedToolbar({
  left,
  right,
  center,
  className = "",
}: FrostedToolbarProps) {
  return (
    <div
      className={`h-12 px-4 flex items-center justify-between border-b border-border-subtle bg-surface/85 backdrop-blur-md sticky top-0 z-30 ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">{left}</div>
      {center && <div className="flex items-center justify-center flex-1">{center}</div>}
      <div className="flex items-center gap-2 shrink-0">{right}</div>
    </div>
  );
}
