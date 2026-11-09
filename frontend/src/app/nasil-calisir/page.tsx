"use client";

import Link from "next/link";
import { 
  NavigationRail, 
  FrostedToolbar, 
  AnalysisWorkspace, 
  PorcelainPanel, 
  EvidenceRow 
} from "@/components/porcelain";
import { Network, ShieldCheck, LockKey, ArrowRight } from "@phosphor-icons/react";

export default function NasilCalisirPage() {
  return (
    <div className="flex h-screen bg-canvas text-ink overflow-hidden font-sans">
      <NavigationRail currentTab="methodology" />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <FrostedToolbar
          left={
            <div className="flex items-center gap-2 text-xs text-ink-secondary">
              <Link href="/" className="hover:text-ink">
                Çalışma Alanı
              </Link>
              <span>/</span>
              <span className="font-medium text-accent">Araştırma Metodolojisi</span>
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
          headerTitle="Siber Tehdit Analiz Metodolojisi"
          headerSubtitle="Oltasez, hedef sunucuya bağlanmadan tamamen leksikal öznitelikler ve doğrulanmış kök alan adı haritalaması ile çalışır."
        >
          <div className="space-y-6 max-w-4xl">
            {/* 1. Modül */}
            <PorcelainPanel variant="solid" className="p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border-subtle">
                <div className="w-8 h-8 rounded-lg bg-canvas text-accent flex items-center justify-center font-bold">
                  <Network size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    1. URL Leksikal Analizörü (Zero-Network Architecture)
                  </h3>
                  <p className="text-[11px] text-ink-muted">
                    Sunucudan hedef bağlantıya hiçbir HTTP/HTTPS isteği gönderilmez.
                  </p>
                </div>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Şüpheli bir web adresini ziyaret etmek kullanıcıyı istemci taraflı kötü amaçlı yazılımlara veya oturum çalma tuzaklarına maruz bırakabilir. Oltasez, UCI PhiUSIIL veri kümesi standartlarına dayalı olarak doğrudan URL metninden 14 matematiksel öznitelik (Shannon entropisi, alt alan derinliği, punycode/homograf taklidi, IP kullanımı) çıkarır.
              </p>
              <div className="space-y-1.5 pt-2">
                <EvidenceRow text="Doğrulanmış e-Devlet, KGM ve banka kök alan adları güvenli kabul edilir." type="verified" />
                <EvidenceRow text="Substring eşlemesi yapılmaz; sahte alan adları ('turkiye-gov-tr.cc') taklit olarak etiketlenir." type="warning" />
              </div>
            </PorcelainPanel>

            {/* 2. Modül */}
            <PorcelainPanel variant="solid" className="p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border-subtle">
                <div className="w-8 h-8 rounded-lg bg-canvas text-warning flex items-center justify-center font-bold">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    2. Ayrık Dolandırıcılık ve Konu Modeli
                  </h3>
                  <p className="text-[11px] text-ink-muted">
                    Konu varlığı tek başına dolandırıcılık kanıtı sayılmaz.
                  </p>
                </div>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Bir SMS veya metinde &quot;HGS&quot;, &quot;PTT&quot; veya &quot;Fatura&quot; kelimesinin geçmesi suç unsuru değildir. Oltasez; konu etiketlemesini, aciliyet/haciz baskısını ve sahte bağlantı varlığını ayrı ayrı inceler.
              </p>
            </PorcelainPanel>

            {/* 3. Modül */}
            <PorcelainPanel variant="solid" className="p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border-subtle">
                <div className="w-8 h-8 rounded-lg bg-canvas text-alert flex items-center justify-center font-bold">
                  <LockKey size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    3. Bağımsız İçerik Güvenliği (Content Safety)
                  </h3>
                  <p className="text-[11px] text-ink-muted">
                    Küfür veya argo dil oltalama (phishing) riskiyle birleştirilmez.
                  </p>
                </div>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Kaba ve küfürlü bir mesaj phishing değildir; kusursuz Türkçeyle yazılmış bir banka sahtekarlığı ise yüksek risklidir. Bu iki kavramın bağımsız sınıflandırılması yanlış alarmları önler.
              </p>
            </PorcelainPanel>
          </div>
        </AnalysisWorkspace>
      </div>
    </div>
  );
}
