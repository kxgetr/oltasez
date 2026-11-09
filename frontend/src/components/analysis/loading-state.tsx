import * as React from "react";
import { Activity } from "lucide-react";

export function LoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-8 sm:p-10 rounded-2xl border border-cyan-500/40 bg-surface/50 backdrop-blur-md shadow-[0_0_35px_-5px_rgba(6,182,212,0.25)] text-center">
      <div className="relative w-16 h-16 mx-auto mb-5 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping opacity-75" />
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
          <Activity className="w-7 h-7 animate-pulse text-cyan-400" />
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
        Bağlantı İnceleniyor
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
        Leksikal öznitelikler çıkarılıyor ve makine öğrenimi modelleriyle tehdit skoru hesaplanıyor...
      </p>

      <div className="w-full max-w-md h-2 rounded-full bg-slate-900 cyber-scan-line border border-cyan-500/30 mx-auto mt-6" />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-[11px] font-mono text-slate-400">
        <span className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          1. Yapısal Ayrıştırma
        </span>
        <span className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          2. 14 Öznitelik Çıkarımı
        </span>
        <span className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          3. Tehdit Sınıflandırması
        </span>
      </div>
    </div>
  );
}
