"use client";

import * as React from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Hash, 
  Layers, 
  Network, 
  Percent, 
  Sparkles, 
  Info, 
  Copy, 
  Check, 
  Lock, 
  Unlock, 
  KeyRound, 
  Binary, 
  Cpu, 
  Activity,
  ArrowUpRight
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { URLAnalysisResponse } from "@/types/analysis";
import { getStatusStyle } from "@/lib/status-styles";

interface ResultPanelProps {
  result: URLAnalysisResponse;
}

export function ResultPanel({ result }: ResultPanelProps) {
  const [copied, setCopied] = React.useState(false);
  const statusStyle = getStatusStyle(result.status);

  // SVG Gauge Hesaplamaları
  const radius = 68;
  const arcLength = Math.PI * radius; // ~213.6
  const scoreClamped = Math.min(Math.max(result.risk_score, 0), 100);
  const strokeDashoffset = arcLength - (arcLength * scoreClamped) / 100;

  const copyUrl = () => {
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const f = result.features;

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 transition-all duration-500 ease-out animate-fade-in space-y-6">
      {/* 1. DASHBOARD ÜST BANNER: SKOR VE TEHDİT DEĞERLENDİRMESİ */}
      <Card
        className={`relative overflow-hidden border ${statusStyle.cardBorder} ${statusStyle.glowClass}`}
        variant="default"
      >
        <CardHeader className="pb-4 border-b border-surface-border/50 bg-slate-900/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>İncelenen Web Kaynağı</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400/90 font-medium">Deterministik Değerlendirme</span>
              </div>
              <div className="flex items-center gap-2.5 group">
                <p className="font-mono text-sm sm:text-base text-cyan-100 font-medium truncate select-all tracking-tight">
                  {result.url}
                </p>
                <button
                  type="button"
                  onClick={copyUrl}
                  title="Bağlantıyı Kopyala"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Badge status={result.status} className="self-start sm:self-center px-4 py-1.5 text-xs font-semibold shadow-sm" />
          </div>
        </CardHeader>

        <CardContent className="pt-6 sm:pt-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Sol Panel: Minimalist Yarım Halka Göstergesi (5 Kolon) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#030712]/70 border border-surface-border/80 relative overflow-hidden">
              <div className="relative flex items-center justify-center w-48 h-28 overflow-hidden">
                <svg className="w-48 h-48 -rotate-180 transform" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="10"
                    strokeDasharray={arcLength}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={statusStyle.gaugeStroke}
                    strokeWidth="10"
                    strokeDasharray={arcLength}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute top-12 flex flex-col items-center">
                  <span className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                    {result.risk_score}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                    Risk Skoru (0–100)
                  </span>
                </div>
              </div>

              {/* Skala Seviyeleri */}
              <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 px-3 mt-3 border-t border-slate-800/80 pt-2.5">
                <span className="text-emerald-400/90">0 Güvenli</span>
                <span className="text-amber-400/90">35 Şüpheli</span>
                <span className="text-rose-400/90">65+ Tehdit</span>
              </div>
            </div>

            {/* Sağ Panel: Durum Analizi ve Aksiyon Rehberi (7 Kolon) */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-surface/50 border border-surface-border/80">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-surface-muted border border-surface-border shrink-0 mt-0.5">
                    {(result.status === "Güvenli" || result.status === "safe") && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                    {(result.status === "Şüpheli" || result.status === "suspicious") && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    {(result.status === "Oltalama Riski" || result.status === "phishing") && <ShieldAlert className="w-5 h-5 text-rose-400" />}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-100 tracking-tight leading-snug">
                      {statusStyle.summaryText}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {statusStyle.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-slate-200 font-medium">Güvenlik Önerisi:</strong> {statusStyle.actionText}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. ORTA PANEL: ÇIKARILAN 14 MATEMATİKSEL PARAMETRE */}
      {f && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Çıkarılan URL Parametreleri
            </h4>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
              14 Öznitelik
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-surface/50 border border-surface-border/70 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>URL Uzunluğu</span>
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="font-mono text-xl font-bold text-white mt-1.5">
                {f.url_length} <span className="text-[10px] text-slate-400 font-normal">karakter</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/50 border border-surface-border/70 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Alan Adı Boyutu</span>
                <span className="text-cyan-400 font-mono text-[11px]">DOM</span>
              </div>
              <p className="font-mono text-xl font-bold text-white mt-1.5">
                {f.domain_length} <span className="text-[10px] text-slate-400 font-normal">karakter</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/50 border border-surface-border/70 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Alt Alan Adı</span>
                <Layers className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <p className="font-mono text-xl font-bold text-white mt-1.5">
                {f.subdomain_count} <span className="text-[10px] text-slate-400 font-normal">katman</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/50 border border-surface-border/70 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Şifreleme</span>
                {f.uses_https ? <Lock className="w-3.5 h-3.5 text-emerald-400" /> : <Unlock className="w-3.5 h-3.5 text-rose-400" />}
              </div>
              <p className={`font-mono text-sm font-bold mt-2 ${f.uses_https ? "text-emerald-400" : "text-rose-400"}`}>
                {f.uses_https ? "HTTPS (Aktif)" : "HTTP (Şifresiz)"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/50 border border-surface-border/70 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Ham IP Kullanımı</span>
                <Network className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <p className={`font-mono text-sm font-bold mt-2 ${f.has_ip_address ? "text-rose-400" : "text-emerald-400"}`}>
                {f.has_ip_address ? "Evet (Kritik)" : "Hayır (DNS)"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/50 border border-surface-border/70 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Shannon Entropisi</span>
                <Binary className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="font-mono text-xl font-bold text-white mt-1.5">
                {f.entropy}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/50 border border-surface-border/70 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Rakam Dağılımı</span>
                <Percent className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="font-mono text-xl font-bold text-white mt-1.5">
                %{Math.round(f.digit_ratio * 100)}
                <span className="text-[10px] text-slate-400 font-normal ml-1">({f.digit_count} rakam)</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/50 border border-surface-border/70 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Punycode (Homograf)</span>
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className={`font-mono text-sm font-bold mt-2 ${f.has_punycode ? "text-rose-400" : "text-slate-300"}`}>
                {f.has_punycode ? "Mevcut (xn--)" : "Tespit Edilmedi"}
              </p>
            </div>

            {/* İkincil Öznitelik İpuçları Çubuğu */}
            <div className="p-3.5 rounded-xl bg-surface/40 border border-surface-border/60 col-span-2 sm:col-span-3 lg:col-span-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-300">
              <span>Nokta: <strong className="text-white font-medium">{f.dot_count}</strong></span>
              <span>•</span>
              <span>Tire: <strong className="text-white font-medium">{f.hyphen_count}</strong></span>
              <span>•</span>
              <span>Özel Karakter: <strong className="text-white font-medium">{f.special_char_count}</strong></span>
              <span>•</span>
              <span>Yol Uzunluğu: <strong className="text-white font-medium">{f.path_length}</strong></span>
              <span>•</span>
              <span>Sorgu Parametresi: <strong className="text-white font-medium">{f.query_param_count}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 3. ALT PANEL: GEREKÇELER VE GÜVENLİK BULGULARI */}
      <Card variant="default">
        <CardHeader className="pb-3 border-b border-surface-border/50 bg-slate-900/30">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Karara Dayanak Oluşturan Güvenlik Bulguları
          </h4>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="space-y-2.5">
            {result.reasons && result.reasons.length > 0 ? (
              result.reasons.map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3.5 text-sm text-slate-200 bg-[#030712]/60 border border-surface-border/70 rounded-xl p-3.5 transition-all hover:border-slate-700"
                >
                  <div className={`mt-0.5 shrink-0 ${statusStyle.iconColor}`}>
                    {(result.status === "Güvenli" || result.status === "safe") && <ShieldCheck className="w-4 h-4" />}
                    {(result.status === "Şüpheli" || result.status === "suspicious") && <AlertTriangle className="w-4 h-4" />}
                    {(result.status === "Oltalama Riski" || result.status === "phishing") && <ShieldAlert className="w-4 h-4" />}
                  </div>
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400 italic">
                Ek bir risk bulgusuna rastlanmadı.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* 4. SORUMLULUK REDDİ / AI BİLGİ NOTU */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3 text-slate-400 text-xs">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Güvenlik Bildirimi:</strong> Bu değerlendirme, bağlantının yapısal özniteliklerine dayalı yapay zekâ destekli bir olasılık tahminidir. Doğrudan bir güvenlik garantisi teşkil etmez; kurumsal ve hassas işlemlerinizde ilave güvenlik adımlarını gözetiniz.
        </p>
      </div>
    </div>
  );
}
