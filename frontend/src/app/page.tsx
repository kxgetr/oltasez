"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  analyzeUrl, 
  analyzeSms, 
  analyzeText 
} from "@/services/api";
import { 
  URLAnalysisResponse, 
  SMSAnalysisResponse, 
  TextAnalysisResponse 
} from "@/types/analysis";

type ActiveTab = "url" | "sms" | "text";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("url");
  const [inputVal, setInputVal] = useState("");
  const [secondaryInput, setSecondaryInput] = useState(""); // SMS sender or email title
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Results
  const [urlResult, setUrlResult] = useState<URLAnalysisResponse | null>(null);
  const [smsResult, setSmsResult] = useState<SMSAnalysisResponse | null>(null);
  const [textResult, setTextResult] = useState<TextAnalysisResponse | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeTab]);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setInputVal("");
    setSecondaryInput("");
    setErrorMsg("");
    setUrlResult(null);
    setSmsResult(null);
    setTextResult(null);
    setShowTechnicalDetails(false);
  };

  const handleAnalyze = async () => {
    setErrorMsg("");
    const trimmed = inputVal.trim();

    if (!trimmed) {
      setErrorMsg(
        activeTab === "url" 
          ? "Bir bağlantı giriniz." 
          : activeTab === "sms" 
          ? "Mesaj metnini giriniz." 
          : "Metin içeriğini giriniz."
      );
      return;
    }

    if (activeTab === "url" && (!trimmed.includes(".") || trimmed.length < 4)) {
      setErrorMsg("Geçerli bir alan adı formatı giriniz (örn: site.com).");
      return;
    }

    setIsLoading(true);
    setUrlResult(null);
    setSmsResult(null);
    setTextResult(null);
    setShowTechnicalDetails(false);

    try {
      if (activeTab === "url") {
        const data = await analyzeUrl({ url: trimmed });
        setUrlResult(data);
      } else if (activeTab === "sms") {
        const data = await analyzeSms({
          message: trimmed,
          sender: secondaryInput.trim() || undefined,
        });
        setSmsResult(data);
      } else {
        const data = await analyzeText({
          title: secondaryInput.trim() || undefined,
          content: trimmed,
        });
        setTextResult(data);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Servis bağlantısı kurulamadı. Lütfen tekrar deneyiniz.");
    } finally {
      setIsLoading(false);
    }
  };

  // Status mapping
  const getUnifiedResult = () => {
    if (activeTab === "url" && urlResult) {
      const statusLower = urlResult.status.toLowerCase();
      let statusTitle = "Belirgin risk tespit edilmedi";
      let statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
      let shortExplanation = "Bağlantıda bilinen taklit veya şüpheli kalıp bulunamadı.";

      if (statusLower.includes("oltalama") || statusLower.includes("phishing") || statusLower === "high") {
        statusTitle = "Riskli bağlantı";
        statusColor = "text-rose-700 bg-rose-50 border-rose-200";
        shortExplanation = "Bağlantı bilinen kurumsal taklit veya aldatıcı yapı içeriyor.";
      } else if (statusLower.includes("şüpheli") || statusLower.includes("suspicious") || statusLower === "medium") {
        statusTitle = "Şüpheli işaretler bulundu";
        statusColor = "text-amber-800 bg-amber-50 border-amber-200";
        shortExplanation = "Olağandışı yapı veya yüksek riskli uzantı tespit edildi.";
      }

      return {
        title: statusTitle,
        colorClass: statusColor,
        explanation: shortExplanation,
        findings: urlResult.reasons.slice(0, 3),
        features: urlResult.features
      };
    }

    if (activeTab === "sms" && smsResult) {
      const statusLower = smsResult.status.toLowerCase();
      let statusTitle = "Belirgin risk tespit edilmedi";
      let statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
      let shortExplanation = "Mesajda acil ödeme talebi veya sahte bağlantı saptanmadı.";

      if (statusLower.includes("oltalama") || statusLower.includes("phishing") || statusLower === "high") {
        statusTitle = "Riskli mesaj";
        statusColor = "text-rose-700 bg-rose-50 border-rose-200";
        shortExplanation = "Mesajda sahte kurum taklidi, baskı veya aldatıcı bağlantı var.";
      } else if (statusLower.includes("şüpheli") || statusLower.includes("suspicious") || statusLower === "medium") {
        statusTitle = "Şüpheli içerik";
        statusColor = "text-amber-800 bg-amber-50 border-amber-200";
        shortExplanation = "Mesajda aciliyet veya şüpheli yönlendirme bulundu.";
      }

      return {
        title: statusTitle,
        colorClass: statusColor,
        explanation: shortExplanation,
        findings: smsResult.reasons.slice(0, 3),
        features: null
      };
    }

    if (activeTab === "text" && textResult) {
      const statusLower = textResult.status.toLowerCase();
      let statusTitle = "Belirgin risk tespit edilmedi";
      let statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
      let shortExplanation = "Metin içeriğinde doğrudan tehdit veya sahte yönlendirme bulunamadı.";

      if (statusLower.includes("oltalama") || statusLower.includes("phishing") || statusLower === "high") {
        statusTitle = "Riskli içerik";
        statusColor = "text-rose-700 bg-rose-50 border-rose-200";
        shortExplanation = "İçerikte hesap kapatma tehdidi veya sahte doğrulama tuzağı var.";
      } else if (statusLower.includes("şüpheli") || statusLower.includes("suspicious") || statusLower === "medium") {
        statusTitle = "Şüpheli ifadeler";
        statusColor = "text-amber-800 bg-amber-50 border-amber-200";
        shortExplanation = "İçerikte zaman baskısı veya aldatıcı kalıplar mevcut.";
      }

      return {
        title: statusTitle,
        colorClass: statusColor,
        explanation: shortExplanation,
        findings: textResult.reasons.slice(0, 3),
        features: null
      };
    }

    return null;
  };

  const result = getUnifiedResult();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans selection:bg-slate-100">
      {/* 1. HEADER (Minimal & Clean) */}
      <header className="w-full border-b border-slate-100 px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-semibold text-sm tracking-tight text-slate-900">
            Oltasez
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            güvenlik kontrolü
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-xs text-slate-700">
          <Link href="/nasil-calisir" className="hover:text-slate-900 transition-colors">
            Nasıl çalışır
          </Link>
          <Link href="/gizlilik" className="hover:text-slate-900 transition-colors">
            Gizlilik
          </Link>
        </nav>
      </header>

      {/* 2. MAIN APPLICATION WORKSPACE (Open -> Paste -> Analyze -> See Result -> Leave) */}
      <main className="w-full max-w-xl mx-auto px-6 py-12 sm:py-20 flex-1 flex flex-col justify-center">
        {/* Başlık */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            {activeTab === "url" && "Bağlantı kontrolü"}
            {activeTab === "sms" && "Mesaj kontrolü"}
            {activeTab === "text" && "Metin kontrolü"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 mt-1">
            {activeTab === "url" && "Şüpheli bir web adresini kontrol edin."}
            {activeTab === "sms" && "Gelen şüpheli SMS veya mesajı kontrol edin."}
            {activeTab === "text" && "E-posta veya duyuru metnini kontrol edin."}
          </p>
        </div>

        {/* 3 Kompakt Sekme */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-lg w-fit mb-5">
          <button
            type="button"
            onClick={() => handleTabChange("url")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === "url"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Bağlantı
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("sms")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === "sms"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Mesaj
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("text")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === "text"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Başlık
          </button>
        </div>

        {/* Form Alanı */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="space-y-3"
        >
          {/* İkincil girdi: SMS başlığı veya e-posta konusu */}
          {activeTab === "sms" && (
            <input
              type="text"
              value={secondaryInput}
              onChange={(e) => setSecondaryInput(e.target.value)}
              placeholder="Gönderen adı veya numara (opsiyonel)"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
            />
          )}

          {activeTab === "text" && (
            <input
              type="text"
              value={secondaryInput}
              onChange={(e) => setSecondaryInput(e.target.value)}
              placeholder="Konu başlığı (opsiyonel)"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
            />
          )}

          {/* Ana Girdi */}
          {activeTab === "url" ? (
            <input
              ref={inputRef as any}
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-mono-tech text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />
          ) : (
            <textarea
              ref={inputRef as any}
              rows={4}
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="Metni buraya yapıştırın..."
              className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none transition-colors"
            />
          )}

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium">
              {errorMsg}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-600 font-mono">
              Enter ile kontrol et
            </span>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Kontrol ediliyor..." : "Kontrol et"}
            </button>
          </div>
        </form>

        {/* 3. SONUÇ ALANI (3 Saniyede Anlaşılır Yalın Kart) */}
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-4 animate-fade-in">
            {/* Durum Rozeti */}
            <div className={`p-4 rounded-lg border ${result.colorClass}`}>
              <div className="text-sm font-semibold">
                {result.title}
              </div>
              <p className="text-xs mt-1 text-slate-700">
                {result.explanation}
              </p>
            </div>

            {/* En Fazla 3 Önemli Bulgu */}
            {result.findings.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-medium text-slate-700">
                  Tespitler
                </div>
                <ul className="space-y-1 text-xs text-slate-700">
                  {result.findings.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-slate-500 font-mono">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Genişletilebilir Teknik Detaylar (İsteğe Bağlı) */}
            {result.features && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="text-[11px] text-slate-700 hover:text-slate-900 underline underline-offset-2"
                >
                  {showTechnicalDetails ? "Teknik detayları gizle" : "Teknik detaylar"}
                </button>

                {showTechnicalDetails && (
                  <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-mono-tech text-slate-600 space-y-1">
                    <div>Entropi: {result.features.entropy?.toFixed(3)}</div>
                    <div>Uzunluk: {result.features.url_length} karakter</div>
                    <div>Protokol: {result.features.uses_https ? "HTTPS" : "HTTP"}</div>
                    <div>IP barındırma: {result.features.has_ip_address ? "Var" : "Yok"}</div>
                    <div>Punycode: {result.features.has_punycode ? "Var" : "Yok"}</div>
                  </div>
                )}
              </div>
            )}

            {/* Bilgilendirme Notu */}
            <p className="text-[11px] text-slate-600 pt-2 leading-relaxed">
              Bu sonuç bir ön kontroldür, kesin güvenlik garantisi teşkil etmez.
            </p>
          </div>
        )}
      </main>

      {/* 4. FOOTER (Tek Satır, Sade) */}
      <footer className="w-full border-t border-slate-100 px-6 py-4 text-center text-[11px] text-slate-600 max-w-4xl mx-auto">
        Oltasez • Sayfa içeriği taranmaz, veriler kaydedilmez.
      </footer>
    </div>
  );
}
