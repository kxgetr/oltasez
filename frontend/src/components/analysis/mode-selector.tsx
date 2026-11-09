import React from "react";
import { Link2, MessageSquare, FileText } from "lucide-react";

export type AnalysisMode = "url" | "sms" | "text";

interface ModeSelectorProps {
  currentMode: AnalysisMode;
  onSelectMode: (mode: AnalysisMode) => void;
}

export function ModeSelector({ currentMode, onSelectMode }: ModeSelectorProps) {
  const modes = [
    {
      id: "url" as AnalysisMode,
      title: "URL Analizi",
      description: "Web bağlantısı ve alan adı incelemesi",
      icon: Link2,
    },
    {
      id: "sms" as AnalysisMode,
      title: "SMS / Mesaj Analizi",
      description: "HGS, kargo, fatura ve manipülatif mesajlar",
      icon: MessageSquare,
    },
    {
      id: "text" as AnalysisMode,
      title: "Başlık ve Metin Analizi",
      description: "E-posta, duyuru ve uzun metin denetimi",
      icon: FileText,
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelectMode(mode.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-cyan-950/80 border-cyan-500/80 text-cyan-200 shadow-[0_0_20px_-3px_rgba(6,182,212,0.3)]"
                : "bg-surface/60 border-surface-border/60 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-surface"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
            <span>{mode.title}</span>
          </button>
        );
      })}
    </div>
  );
}
