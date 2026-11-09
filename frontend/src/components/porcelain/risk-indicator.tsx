import React from "react";
import { ShieldCheck, Warning, WarningOctagon, Question } from "@phosphor-icons/react";

export type RiskLevelType = "safe" | "suspicious" | "phishing" | "unknown";

interface RiskIndicatorProps {
  status: string; // Turkish or English status string
  score?: number | null;
  className?: string;
  showScore?: boolean;
}

export function RiskIndicator({
  status,
  score,
  className = "",
  showScore = true,
}: RiskIndicatorProps) {
  const norm = status.toLowerCase();
  let level: RiskLevelType = "unknown";
  let label = "Bilinmeyen Durum";
  let bgClass = "bg-canvas text-ink-muted border-border-fine";
  let Icon = Question;

  if (norm.includes("güvenli") || norm === "safe" || norm === "low") {
    level = "safe";
    label = "Güvenli / Düşük Risk";
    bgClass = "bg-safe-light text-safe border-safe-border";
    Icon = ShieldCheck;
  } else if (norm.includes("şüpheli") || norm === "suspicious" || norm === "medium") {
    level = "suspicious";
    label = "Şüpheli Belirteçler";
    bgClass = "bg-warning-light text-warning border-warning-border";
    Icon = Warning;
  } else if (norm.includes("oltalama") || norm === "phishing" || norm === "high") {
    level = "phishing";
    label = "Yüksek Oltalama Riski";
    bgClass = "bg-alert-light text-alert border-alert-border";
    Icon = WarningOctagon;
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-medium ${bgClass} ${className}`}
    >
      <Icon size={14} weight="bold" className="shrink-0" />
      <span>{label}</span>
      {showScore && typeof score === "number" && (
        <span className="font-mono-tech font-semibold ml-0.5 text-[11px] opacity-90">
          %{score}
        </span>
      )}
    </div>
  );
}
