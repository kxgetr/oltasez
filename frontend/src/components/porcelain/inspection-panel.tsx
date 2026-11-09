import React from "react";
import { URLAnalysisResponse } from "@/types/analysis";
import { Fingerprint, Cpu, LockKey, Binary, LinkSimple } from "@phosphor-icons/react";

interface InspectionPanelProps {
  result: URLAnalysisResponse | null;
  onClose?: () => void;
}

export function InspectionPanel({ result, onClose }: InspectionPanelProps) {
  if (!result) {
    return (
      <aside className="w-80 border-l border-border-subtle bg-surface/50 p-5 hidden xl:flex flex-col justify-center items-center text-center text-ink-muted">
        <Fingerprint size={32} weight="light" className="text-ink-faint mb-2" />
        <p className="text-xs font-medium text-ink">Adli İnceleme Paneli</p>
        <p className="text-[11px] text-ink-faint mt-1 max-w-[200px]">
          Aktif bir URL analiz edildiğinde teknik öznitelikler burada listelenir.
        </p>
      </aside>
    );
  }

  const f = result.features;

  return (
    <aside className="w-80 shrink-0 border-l border-border-subtle bg-surface p-5 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-6">
        {/* Panel Başlığı */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Fingerprint size={18} weight="bold" className="text-accent" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              Teknik Göstergeler
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-ink-muted bg-frost px-2 py-0.5 rounded">
            14 Öznitelik
          </span>
        </div>

        {/* Alan Adı ve Temel Bilgiler */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
            Hedef Bağlantı
          </span>
          <div className="p-2.5 rounded-lg bg-canvas border border-border-subtle">
            <div className="flex items-center gap-1.5 text-xs font-mono-tech text-ink break-all">
              <LinkSimple size={13} className="shrink-0 text-accent" />
              <span>{result.url}</span>
            </div>
          </div>
        </div>

        {/* 14 Leksikal Öznitelik Tablosu */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
            Matematiksel Dağılım
          </span>
          <div className="divide-y divide-border-subtle text-xs border border-border-subtle rounded-lg bg-surface overflow-hidden">
            <div className="flex justify-between items-center p-2.5 bg-canvas/40">
              <span className="text-ink-secondary text-[11px]">Shannon Entropisi:</span>
              <span className="font-mono-tech font-semibold text-ink">
                {f.entropy ? f.entropy.toFixed(3) : "0.000"}
              </span>
            </div>
            <div className="flex justify-between items-center p-2.5">
              <span className="text-ink-secondary text-[11px]">Toplam URL Boyu:</span>
              <span className="font-mono-tech text-ink">{f.url_length} kar</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-canvas/40">
              <span className="text-ink-secondary text-[11px]">Alan Adı Boyu:</span>
              <span className="font-mono-tech text-ink">{f.domain_length} kar</span>
            </div>
            <div className="flex justify-between items-center p-2.5">
              <span className="text-ink-secondary text-[11px]">Alt Alan Adı Sayısı:</span>
              <span className="font-mono-tech text-ink">{f.subdomain_count}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-canvas/40">
              <span className="text-ink-secondary text-[11px]">Rakam Yoğunluğu:</span>
              <span className="font-mono-tech text-ink">
                {(f.digit_ratio * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-2.5">
              <span className="text-ink-secondary text-[11px]">Özel Karakterler:</span>
              <span className="font-mono-tech text-ink">{f.special_char_count}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-canvas/40">
              <span className="text-ink-secondary text-[11px]">Ham IP Adresi:</span>
              <span className={`font-mono-tech text-[11px] font-semibold ${f.has_ip_address ? "text-alert" : "text-safe"}`}>
                {f.has_ip_address ? "Evet (Riskli)" : "Hayır (Alan Adı)"}
              </span>
            </div>
            <div className="flex justify-between items-center p-2.5">
              <span className="text-ink-secondary text-[11px]">HTTPS Protokolü:</span>
              <span className={`font-mono-tech text-[11px] font-semibold ${f.uses_https ? "text-safe" : "text-warning"}`}>
                {f.uses_https ? "Aktif" : "Eksik (HTTP)"}
              </span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-canvas/40">
              <span className="text-ink-secondary text-[11px]">Punycode / Homograf:</span>
              <span className={`font-mono-tech text-[11px] font-semibold ${f.has_punycode ? "text-alert" : "text-ink-muted"}`}>
                {f.has_punycode ? "Tespit Edildi (xn--)" : "Yok"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Bilgisi ve Kısıtlar */}
      <div className="pt-4 mt-6 border-t border-border-subtle text-[11px] text-ink-muted space-y-1">
        <div className="flex items-center gap-1.5 font-medium text-ink">
          <Cpu size={14} className="text-accent" />
          <span>Heuristic Heuristic v1.0</span>
        </div>
        <p className="text-[10px] text-ink-faint leading-tight">
          Sayfa kazıma (scraping) yapılmamıştır. Veriler anlık leksikal matematik formüllerine dayanır.
        </p>
      </div>
    </aside>
  );
}
