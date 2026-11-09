"use client";

import Link from "next/link";
import { 
  NavigationRail, 
  FrostedToolbar, 
  AnalysisWorkspace, 
  PorcelainPanel 
} from "@/components/porcelain";
import { Target, Sparkle, ArrowRight } from "@phosphor-icons/react";

export default function HakkindaPage() {
  return (
    <div className="flex h-screen bg-canvas text-ink overflow-hidden font-sans">
      <NavigationRail currentTab="about" />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <FrostedToolbar
          left={
            <div className="flex items-center gap-2 text-xs text-ink-secondary">
              <Link href="/" className="hover:text-ink">
                Çalışma Alanı
              </Link>
              <span>/</span>
              <span className="font-medium text-accent">Hakkında</span>
            </div>
          }
          right={
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-surface text-xs font-semibold hover:bg-accent-hover transition-colors"
            >
              <span>Canlı Analiz</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          }
        />

        <AnalysisWorkspace
          headerTitle="Oltasez Projesi Hakkında"
          headerSubtitle="Türkiye siber güvenlik tehdit ortamında Türkçe dil dinamiklerine özel geliştirilmiş açık kaynaklı analiz çalışma alanı."
        >
          <div className="space-y-6 max-w-4xl">
            <PorcelainPanel variant="solid" className="p-5 md:p-6 space-y-3">
              <div className="flex items-center gap-2 text-ink font-bold text-sm">
                <Target size={18} className="text-accent" />
                <span>Çıkış Noktası ve Problem</span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Uluslararası siber tehdit veritabanları Türkçe dilbilgisine, kurum taklitlerine (HGS, e-Devlet, PTT, GİB) ve yerel SMS dolandırıcılık kalıplarına yeterli duyarlılığı gösterememektedir. Oltasez, yerel siber riskleri matematiksel özniteliklerle çözümler.
              </p>
            </PorcelainPanel>

            <PorcelainPanel variant="solid" className="p-5 md:p-6 space-y-3">
              <div className="flex items-center gap-2 text-ink font-bold text-sm">
                <Sparkle size={18} className="text-warning" />
                <span>Açıklanabilir Güvenlik (Explainable Security)</span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Kullanıcıya uydurma &quot;%99 Güvenli&quot; gibi yapay yüzdeler vermek yerine; hangi matematiksel ve dilbilgisel göstergelerin tetiklendiği adli bir rapor halinde şeffafça sunulur.
              </p>
            </PorcelainPanel>
          </div>
        </AnalysisWorkspace>
      </div>
    </div>
  );
}
