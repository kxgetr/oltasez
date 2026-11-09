"use client";

import Link from "next/link";
import { 
  NavigationRail, 
  FrostedToolbar, 
  AnalysisWorkspace, 
  PorcelainPanel 
} from "@/components/porcelain";
import { LockSimple, EyeSlash, ArrowRight } from "@phosphor-icons/react";

export default function GizlilikPage() {
  return (
    <div className="flex h-screen bg-canvas text-ink overflow-hidden font-sans">
      <NavigationRail currentTab="privacy" />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <FrostedToolbar
          left={
            <div className="flex items-center gap-2 text-xs text-ink-secondary">
              <Link href="/" className="hover:text-ink">
                Çalışma Alanı
              </Link>
              <span>/</span>
              <span className="font-medium text-accent">Gizlilik Bildirimi</span>
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
          headerTitle="Gizlilik ve Veri Güvenliği Taahhüdü"
          headerSubtitle="Oltasez, kullanıcı girdilerini üçüncü taraflara satmaz, sunucuda kalıcı olarak saklamaz ve hedef bağlantılara izinsiz istek atmaz."
        >
          <div className="space-y-6 max-w-4xl">
            <PorcelainPanel variant="solid" className="p-5 md:p-6 space-y-3">
              <div className="flex items-center gap-2 text-ink font-bold text-sm">
                <LockSimple size={18} className="text-safe" />
                <span>1. Sıfır Kalıcı Veri Saklama</span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Analiz formuna yapıştırdığınız web bağlantıları veya SMS metinleri yalnızca anlık leksikal matematik formüllerinden geçirilir. Yanıt oluşturulduktan sonra bellekten silinir; hiçbir veritabanına kaydedilmez.
              </p>
            </PorcelainPanel>

            <PorcelainPanel variant="solid" className="p-5 md:p-6 space-y-3">
              <div className="flex items-center gap-2 text-ink font-bold text-sm">
                <EyeSlash size={18} className="text-accent" />
                <span>2. Loglardan Hassas Bilgi Maskeleme</span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                URL sorgularınızda veya parametrelerinizde yer alabilecek olası parola, oturum anahtarı (token), OTP veya kart numaraları sunucu loglarına yazılmadan önce otomatik olarak maskelenir.
              </p>
            </PorcelainPanel>
          </div>
        </AnalysisWorkspace>
      </div>
    </div>
  );
}
