import * as React from "react";
import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-8 sm:p-12 rounded-2xl border border-surface-border/60 bg-surface/30 backdrop-blur-sm text-center">
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto mb-4 shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)]">
        <Search className="w-7 h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
        Analiz İçin Bağlantı Bekleniyor
      </h3>
      <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
        Güvenliğinden şüphelendiğiniz bağlantıyı yukarıya yapıştırarak sorgulayın veya aşağıdaki örnek senaryoları deneyin.
      </p>
      <div className="mt-5 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Güvenli (0–34)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Şüpheli (35–64)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Oltalama Riski (65–100)
        </span>
      </div>
    </div>
  );
}
