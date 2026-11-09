import React from "react";
import { CheckCircle, WarningCircle, Info } from "@phosphor-icons/react";

interface EvidenceRowProps {
  text: string;
  type?: "neutral" | "warning" | "alert" | "verified";
  meta?: string;
}

export function EvidenceRow({ text, type = "neutral", meta }: EvidenceRowProps) {
  let Icon = Info;
  let iconClass = "text-ink-muted";
  let borderClass = "border-border-subtle";

  if (type === "warning") {
    Icon = WarningCircle;
    iconClass = "text-warning";
    borderClass = "border-warning-border/40 bg-warning-light/30";
  } else if (type === "alert") {
    Icon = WarningCircle;
    iconClass = "text-alert";
    borderClass = "border-alert-border/40 bg-alert-light/30";
  } else if (type === "verified") {
    Icon = CheckCircle;
    iconClass = "text-safe";
    borderClass = "border-safe-border/40 bg-safe-light/30";
  }

  return (
    <div
      className={`flex items-start justify-between gap-3 p-2.5 rounded-lg border text-xs leading-relaxed ${borderClass}`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <Icon size={15} weight="bold" className={`shrink-0 mt-0.5 ${iconClass}`} />
        <span className="text-ink text-[12px]">{text}</span>
      </div>
      {meta && (
        <span className="shrink-0 font-mono-tech text-[11px] text-ink-muted">
          {meta}
        </span>
      )}
    </div>
  );
}
