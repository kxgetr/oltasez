import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ShieldCheck, Cpu, Lock, AlertCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-surface-border/70 bg-[#02050e] py-12 text-xs text-slate-400">
      <Container size="default">
        {/* Güvenlik Feragatnamesi (Uyarı Bandı) */}
        <div className="mb-8 p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-semibold">Önemli Güvenlik Bildirimi:</span> Oltasez tarafından üretilen analiz sonuçları, leksikal öznitelik ve yapay zekâ sezgilerine dayalı bir <strong>ön değerlendirme aracıdır</strong>. Hiçbir analiz sonucu <strong>%100 kesin güvenlik garantisi teşkil etmez</strong>. Şüpheli durumlarda resmî kurumlar ile doğrudan iletişime geçiniz ve hassas bilgilerinizi paylaşmayınız.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-surface-border/50">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-mono text-base font-bold text-white tracking-wide">
                OLTA<span className="text-cyan-400">SEZ</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Türkçe diline ve yerel siber dolandırıcılık modellerine (HGS borcu, sahte kargo bildirimi, fatura gecikmesi) özel geliştirilmiş, leksikal ve makine öğrenimi tabanlı tehdit analiz platformu.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-3">
              Platform & Rehber
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Canlı Analiz Merkezi
                </Link>
              </li>
              <li>
                <Link href="/nasil-calisir" className="hover:text-cyan-300 transition-colors">
                  Nasıl Çalışır? (3 Modlu Mimari)
                </Link>
              </li>
              <li>
                <Link href="/hakkinda" className="hover:text-cyan-300 transition-colors">
                  Proje & Bilimsel Amaç
                </Link>
              </li>
              <li>
                <Link href="/gizlilik" className="hover:text-cyan-300 transition-colors">
                  Gizlilik & Veri İşleme Politikası
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-3">
              Mühendislik & Güvenlik
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Zero-Network / No Web Scraping</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>FastAPI & Next.js App Router</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1">
                Kişisel verileriniz, oturum çerezleriniz veya girdiğiniz URL'ler kaydedilmez ve üçüncü taraflara satılmaz.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 Oltasez. Tüm hakları saklıdır. Açık kaynaklı siber güvenlik girişimi.</p>
          <p className="font-mono text-cyan-400/80">Sürüm: v1.0.0-prod</p>
        </div>
      </Container>
    </footer>
  );
}
