import { Container } from "@/components/ui/container";
import { ShieldCheck, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-surface-border/60 bg-[#030712]/95 py-10 text-xs text-slate-500">
      <Container size="default">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-200 font-semibold tracking-wide">
                Oltasez Siber Tehdit Analiz Platformu
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Yapay zekâ ve leksikal URL öznitelikleriyle oltalama (phishing) tespit sistemi.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] text-slate-400 bg-surface/60 px-4 py-2 rounded-xl border border-surface-border">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Cpu className="w-3.5 h-3.5" /> Next.js & FastAPI
            </span>
            <span>•</span>
            <span>scikit-learn ML</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span className="text-emerald-400">v0.1-mvp</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-surface-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 Oltasez. Tüm hakları saklıdır. Açık kaynaklı siber güvenlik projesi.</p>
          <p className="font-mono">Gizlilik Odaklı Mimari — Sayfa İçeriği Taranmaz</p>
        </div>
      </Container>
    </footer>
  );
}
