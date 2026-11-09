import React from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Tag, 
  Clock, 
  MessageSquareWarning, 
  ExternalLink,
  Info
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SMSAnalysisResponse, TextAnalysisResponse } from "@/types/analysis";

interface MessageResultPanelProps {
  result: SMSAnalysisResponse | TextAnalysisResponse;
  mode: "sms" | "text";
}

export function MessageResultPanel({ result, mode }: MessageResultPanelProps) {
  const isDanger = result.status === "Oltalama Riski" || result.status === "phishing";
  const isSuspicious = result.status === "Şüpheli" || result.status === "suspicious";

  const getStatusBadge = () => {
    if (isDanger) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <ShieldAlert className="w-3.5 h-3.5" />
          Yüksek Oltalama Riski
        </span>
      );
    }
    if (isSuspicious) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          Şüpheli İçerik
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <ShieldCheck className="w-3.5 h-3.5" />
        Güvenli Görünüyor
      </span>
    );
  };

  return (
    <div className="mt-8 space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* 1. ÜST ÖZET KARTI */}
      <Card className="border-surface-border/80 bg-surface/80 backdrop-blur-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getStatusBadge()}
              {"sender" in result && result.sender && (
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-surface-border">
                  Gönderen: {result.sender}
                </span>
              )}
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold text-white mt-1">
              {mode === "sms" ? "SMS Güvenlik Değerlendirmesi" : "Metin İçerik İnceleme Raporu"}
            </CardTitle>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-xl border border-surface-border/60">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Dolandırıcılık Skoru
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                %{result.risk_score}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-surface-border flex items-center justify-center font-mono text-xs font-semibold">
              <span className={isDanger ? "text-rose-400" : isSuspicious ? "text-amber-400" : "text-emerald-400"}>
                {result.risk_score}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-5">
          {/* Tespit Edilen Konular (Ayrık Konsept) */}
          <div>
            <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tespit Edilen Konu Kategorileri (Konu ≠ Dolandırıcılık Kanıtı):</span>
            </div>
            {result.detected_topics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.detected_topics.map((topic) => (
                  <div
                    key={topic.key}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
                  >
                    <span>{topic.label}</span>
                    <span className="text-[10px] text-cyan-400/60 font-sans">
                      ({topic.matched_terms.join(", ")})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Belirgin bir kurum veya taklit konusu tespit edilmedi.</p>
            )}
          </div>

          {/* Manipülasyon ve Tehdit Belirteçleri */}
          <div>
            <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Aciliyet ve Manipülasyon İpuçları:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className={`p-2.5 rounded-lg border ${result.manipulation.has_urgency ? "bg-amber-950/20 border-amber-500/40 text-amber-300" : "bg-slate-900/40 border-surface-border/40 text-slate-400"}`}>
                <div className="font-semibold">Aciliyet Baskısı</div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  {result.manipulation.has_urgency ? "Zaman sınırlaması tespit edildi" : "Normal zamanlama"}
                </div>
              </div>
              <div className={`p-2.5 rounded-lg border ${result.manipulation.has_financial_demand ? "bg-amber-950/20 border-amber-500/40 text-amber-300" : "bg-slate-900/40 border-surface-border/40 text-slate-400"}`}>
                <div className="font-semibold">Ödeme Talebi</div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  {result.manipulation.has_financial_demand ? "Maddi talep/borç vurgusu" : "Ödeme talebi yok"}
                </div>
              </div>
              <div className={`p-2.5 rounded-lg border ${result.manipulation.has_threat ? "bg-rose-950/20 border-rose-500/40 text-rose-300" : "bg-slate-900/40 border-surface-border/40 text-slate-400"}`}>
                <div className="font-semibold">Tehdit & İcra Baskısı</div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  {result.manipulation.has_threat ? "Yasal/kolluk tehdidi mevcut" : "Tehdit unsuru yok"}
                </div>
              </div>
            </div>
          </div>

          {/* İçerik Güvenliği / Küfür Denetimi (Tamamen Ayrık) */}
          <div className="p-3.5 rounded-xl border border-surface-border bg-slate-950/40">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-mono text-slate-300 flex items-center gap-1.5">
                <MessageSquareWarning className="w-3.5 h-3.5 text-purple-400" />
                İçerik Güvenliği ve Dil Denetimi
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${result.content_safety.safe_for_work ? "text-emerald-400 bg-emerald-950/40" : "text-purple-300 bg-purple-950/50 border border-purple-500/30"}`}>
                {result.content_safety.safe_for_work ? "Temiz Dil" : "Uygunsuz / Saldırgan Dil"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {result.content_safety.explanation}
            </p>
          </div>

          {/* Tespit Gerekçeleri */}
          <div>
            <div className="text-xs font-mono text-slate-400 mb-2">Değerlendirme Bulguları:</div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {result.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/50 p-2 rounded-lg border border-surface-border/40">
                  <span className="text-cyan-400 font-mono mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayıklanan ve Taranan Bağlantılar */}
          {result.extracted_urls.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mesaj İçindeki Bağlantıların Yapısal Analizi ({result.extracted_urls.length}):</span>
              </div>
              <div className="space-y-2">
                {result.extracted_urls.map((u, i) => (
                  <div key={i} className="p-3 rounded-lg border border-surface-border bg-slate-900/70 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-white truncate max-w-[80%]">{u.url}</span>
                      <span className={`font-mono text-[11px] px-2 py-0.5 rounded ${u.risk_score >= 60 ? "bg-rose-950 text-rose-300" : "bg-emerald-950 text-emerald-300"}`}>
                        Skor: %{u.risk_score}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Entropi: {u.features.entropy.toFixed(2)} | HTTPS: {u.features.uses_https ? "Evet" : "Hayır"} | IP Adresi: {u.features.has_ip_address ? "Evet" : "Hayır"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saydamlık Notu: Yapay Zeka Skoru */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface/50 border border-surface-border text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{result.ai_score_explanation}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
