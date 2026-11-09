"use client";

import { useState } from "react";
import { 
  NavigationRail, 
  FrostedToolbar, 
  AnalysisWorkspace, 
  PorcelainPanel, 
  RiskIndicator, 
  EvidenceRow, 
  InspectionPanel 
} from "@/components/porcelain";
import { 
  analyzeUrl, 
  analyzeSms, 
  analyzeText, 
  ApiError 
} from "@/services/api";
import { 
  URLAnalysisResponse, 
  SMSAnalysisResponse, 
  TextAnalysisResponse 
} from "@/types/analysis";
import { 
  MagnifyingGlass, 
  ArrowRight, 
  ArrowClockwise, 
  ShieldCheck, 
  Warning, 
  WarningCircle, 
  Info,
  CheckCircle,
  Copy,
  Tag,
  Clock,
  ChatCircleText
} from "@phosphor-icons/react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("url");

  // URL state
  const [urlInput, setUrlInput] = useState("");
  const [urlResult, setUrlResult] = useState<URLAnalysisResponse | null>(null);

  // SMS state
  const [smsSender, setSmsSender] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [smsResult, setSmsResult] = useState<SMSAnalysisResponse | null>(null);

  // Text state
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [textResult, setTextResult] = useState<TextAnalysisResponse | null>(null);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setValidationError("");
    setServerError("");
  };

  // 1. URL Analysis Execution
  const executeUrlAnalysis = async (rawUrl: string) => {
    setValidationError("");
    setServerError("");
    const trimmed = rawUrl.trim();

    if (!trimmed) {
      setValidationError("Lütfen değerlendirmek istediğiniz bir web adresi (URL) giriniz.");
      return;
    }

    if (!trimmed.includes(".") || trimmed.length < 4) {
      setValidationError("Lütfen geçerli bir alan adı formatı giriniz (örn: site.com veya https://site.com).");
      return;
    }

    setIsLoading(true);
    setUrlResult(null);

    try {
      const data = await analyzeUrl({ url: trimmed });
      setUrlResult(data);
    } catch (err: any) {
      setServerError(err?.message || "Bağlantı analizi sırasında beklenmeyen bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. SMS Analysis Execution
  const executeSmsAnalysis = async () => {
    setValidationError("");
    setServerError("");
    const trimmedMsg = smsMessage.trim();

    if (!trimmedMsg) {
      setValidationError("Lütfen analiz edilecek SMS veya mesaj metnini giriniz.");
      return;
    }

    setIsLoading(true);
    setSmsResult(null);

    try {
      const data = await analyzeSms({
        message: trimmedMsg,
        sender: smsSender.trim() || undefined,
      });
      setSmsResult(data);
    } catch (err: any) {
      setServerError(err?.message || "SMS analizi sırasında beklenmeyen bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Text Analysis Execution
  const executeTextAnalysis = async () => {
    setValidationError("");
    setServerError("");
    const trimmedContent = textContent.trim();

    if (!trimmedContent) {
      setValidationError("Lütfen analiz edilecek e-posta veya metin gövdesini giriniz.");
      return;
    }

    setIsLoading(true);
    setTextResult(null);

    try {
      const data = await analyzeText({
        title: textTitle.trim() || undefined,
        content: trimmedContent,
      });
      setTextResult(data);
    } catch (err: any) {
      setServerError(err?.message || "Metin analizi sırasında beklenmeyen bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setValidationError("");
    setServerError("");
    if (activeTab === "url") {
      setUrlInput("");
      setUrlResult(null);
    } else if (activeTab === "sms") {
      setSmsSender("");
      setSmsMessage("");
      setSmsResult(null);
    } else {
      setTextTitle("");
      setTextContent("");
      setTextResult(null);
    }
  };

  return (
    <div className="flex h-screen bg-canvas text-ink overflow-hidden font-sans">
      {/* 1. SOL GEZİNME RAYI (NavigationRail) */}
      <NavigationRail currentTab={activeTab} onTabChange={handleTabChange} />

      {/* 2. ORTA ÇALIŞMA ALANI */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Üst Araç Çubuğu (FrostedToolbar) */}
        <FrostedToolbar
          left={
            <div className="flex items-center gap-2 text-xs text-ink-secondary">
              <span className="font-semibold text-ink">Çalışma Alanı</span>
              <span>/</span>
              <span className="font-medium text-accent">
                {activeTab === "url" && "URL Güvenlik İncelemesi"}
                {activeTab === "sms" && "SMS & Sosyal Mühendislik Analizi"}
                {activeTab === "text" && "Başlık & Metin Tehdit Analizi"}
              </span>
            </div>
          }
          right={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-safe-light text-safe border border-safe-border text-[11px] font-mono-tech">
                <span className="w-1.5 h-1.5 rounded-full bg-safe" />
                API v1.0
              </span>
            </div>
          }
        />

        {/* Ana Analiz Alanı (AnalysisWorkspace) */}
        <AnalysisWorkspace
          headerTitle={
            activeTab === "url"
              ? "URL Güvenlik ve Leksikal İnceleme"
              : activeTab === "sms"
              ? "SMS ve Dolandırıcılık Mesajı Analizi"
              : "Başlık ve Metin İçerik Değerlendirmesi"
          }
          headerSubtitle={
            activeTab === "url"
              ? "Şüpheli bağlantıları sayfa ziyaretine gerek kalmadan 14 leksikal öznitelik ve kök alan adı kurallarıyla inceleyin."
              : activeTab === "sms"
              ? "HGS borcu, sahte kargo bildirimi ve fatura taklidi mesajları aciliyet ve dil güvenliği açısından ayrık olarak değerlendirin."
              : "E-posta veya duyuru metinlerini hesap tehdidi, sahte çekiliş ve manipülasyon dili yönünden denetleyin."
          }
        >
          {/* ==============================================================
              TAB 1: URL ANALYZER
             ============================================================== */}
          {activeTab === "url" && (
            <div className="space-y-6">
              {/* Giriş Paneli */}
              <PorcelainPanel variant="solid" className="p-4 md:p-5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeUrlAnalysis(urlInput);
                  }}
                  className="space-y-3"
                >
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider">
                    İncelenecek Web Bağlantısı (URL)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1 flex items-center">
                      <MagnifyingGlass
                        size={18}
                        className="absolute left-3.5 text-ink-muted pointer-events-none"
                      />
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => {
                          setUrlInput(e.target.value);
                          if (validationError) setValidationError("");
                          if (serverError) setServerError("");
                        }}
                        placeholder="https://ornek-alan-adi.com/odeme veya site.xyz"
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border-fine bg-surface text-ink text-xs sm:text-sm font-mono-tech focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      />
                      {urlInput && (
                        <button
                          type="button"
                          onClick={handleReset}
                          className="absolute right-3 p-1 text-ink-muted hover:text-ink rounded"
                          title="Temizle"
                        >
                          <ArrowClockwise size={14} />
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-surface text-xs font-semibold hover:bg-accent-hover transition-colors shadow-subtle shrink-0 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <ArrowClockwise size={15} className="animate-spin" />
                          <span>İnceleniyor...</span>
                        </>
                      ) : (
                        <>
                          <span>Analiz Et</span>
                          <ArrowRight size={15} weight="bold" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {validationError && (
                  <p className="text-xs text-alert font-medium mt-2 flex items-center gap-1.5">
                    <WarningCircle size={14} weight="bold" />
                    <span>{validationError}</span>
                  </p>
                )}

                {/* Demo Örnekleri (Hızlı Doldurma) */}
                <div className="mt-4 pt-3 border-t border-border-subtle flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-ink-muted">
                    Test Senaryoları (Demo):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const u = "https://www.turkiye.gov.tr/hizmetler";
                      setUrlInput(u);
                      executeUrlAnalysis(u);
                    }}
                    className="px-2.5 py-1 rounded-md bg-canvas border border-border-subtle text-[11px] text-ink-secondary hover:text-ink hover:border-ink-muted transition-colors font-mono-tech"
                  >
                    e-Devlet (Meşru)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const u = "https://turkiye-gov-tr.ceza-odeme.cc/giris";
                      setUrlInput(u);
                      executeUrlAnalysis(u);
                    }}
                    className="px-2.5 py-1 rounded-md bg-alert-light border border-alert-border/60 text-[11px] text-alert hover:bg-alert-light transition-colors font-mono-tech"
                  >
                    Sahte e-Devlet (.cc)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const u = "http://192.168.1.105/fatura-odeme/portal.php";
                      setUrlInput(u);
                      executeUrlAnalysis(u);
                    }}
                    className="px-2.5 py-1 rounded-md bg-warning-light border border-warning-border/60 text-[11px] text-warning hover:bg-warning-light transition-colors font-mono-tech"
                  >
                    Ham IP Barındırma
                  </button>
                </div>
              </PorcelainPanel>

              {/* Sunucu Hatası */}
              {serverError && (
                <PorcelainPanel variant="solid" className="p-4 border-alert-border bg-alert-light text-alert text-xs flex items-start gap-2.5">
                  <Warning size={16} weight="bold" className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Analiz Servisi Yanıtı:</span> {serverError}
                  </div>
                </PorcelainPanel>
              )}

              {/* Rapor Paneli (Sonuç Durumu) */}
              {urlResult && (
                <PorcelainPanel variant="solid" className="p-5 md:p-6 space-y-6">
                  {/* Rapor Üst Başlık & Risk Göstergesi */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                    <div>
                      <div className="text-[11px] font-mono-tech uppercase tracking-wider text-ink-muted">
                        Adli İnceleme Sonucu
                      </div>
                      <h2 className="text-lg font-bold text-ink mt-0.5">
                        URL Tehdit Değerlendirmesi
                      </h2>
                    </div>
                    <RiskIndicator status={urlResult.status} score={urlResult.risk_score} />
                  </div>

                  {/* Bulgular Listesi */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                      Tespit Edilen Belirteçler ve Kanıtlar
                    </span>
                    <div className="space-y-1.5">
                      {urlResult.reasons.map((reason, idx) => (
                        <EvidenceRow
                          key={idx}
                          text={reason}
                          type={
                            urlResult.status.includes("Oltalama")
                              ? "alert"
                              : urlResult.status.includes("Şüpheli")
                              ? "warning"
                              : "verified"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sorumluluk Reddi / Güvenlik Bildirimi */}
                  <div className="p-3 rounded-lg bg-canvas border border-border-subtle text-[11px] text-ink-muted flex items-start gap-2">
                    <Info size={15} className="shrink-0 text-accent mt-0.5" />
                    <span>
                      <strong>Önemli Bildirim:</strong> Bu analiz, hedef web sitesine bağlanılmadan yalnızca leksikal kurallar ve kayıtlı resmî alan adı eşlemelerine dayalı bir ön incelemedir. Kesin güvenlik garantisi teşkil etmez.
                    </span>
                  </div>
                </PorcelainPanel>
              )}
            </div>
          )}

          {/* ==============================================================
              TAB 2: SMS FRAUD ANALYZER
             ============================================================== */}
          {activeTab === "sms" && (
            <div className="space-y-6">
              <PorcelainPanel variant="solid" className="p-4 md:p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Gönderen Başlığı / Numara (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={smsSender}
                    onChange={(e) => setSmsSender(e.target.value)}
                    placeholder="Örn: HGS-BILGI, PTT-KARGO veya +905551234567"
                    className="w-full px-3.5 py-2 rounded-lg border border-border-fine bg-surface text-ink text-xs font-mono-tech focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    SMS veya Mesaj Metni <span className="text-alert">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={smsMessage}
                    onChange={(e) => {
                      setSmsMessage(e.target.value);
                      if (validationError) setValidationError("");
                      if (serverError) setServerError("");
                    }}
                    placeholder="Gelen şüpheli SMS metnini buraya yapıştırın..."
                    className="w-full p-3 rounded-lg border border-border-fine bg-surface text-ink text-xs sm:text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-ink-muted mr-1">
                      Örnekler:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSmsSender("HGS-BILGI");
                        setSmsMessage(
                          "Sayin surucu, odenmemis HGS cezaniz vardir. 24 saat icinde odeyiniz yoksa icra takibi baslatilacaktir: http://hgs-ceza-ode.cc"
                        );
                      }}
                      className="px-2 py-0.5 rounded bg-canvas border border-border-subtle text-[11px] text-ink-secondary hover:text-ink"
                    >
                      HGS İcra Tuzağı
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSmsSender("HGS");
                        setSmsMessage(
                          "HGS bakiye yukleme isleminiz tamamlanmistir. Yeni bakiyeniz 350 TL'dir."
                        );
                      }}
                      className="px-2 py-0.5 rounded bg-canvas border border-border-subtle text-[11px] text-safe hover:border-safe"
                    >
                      Zararsız HGS Bildirimi
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3 py-1.5 rounded-lg border border-border-subtle text-xs text-ink-secondary hover:text-ink"
                    >
                      Temizle
                    </button>
                    <button
                      type="button"
                      onClick={executeSmsAnalysis}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-surface text-xs font-semibold hover:bg-accent-hover transition-colors shadow-subtle disabled:opacity-50"
                    >
                      {isLoading ? "İnceleniyor..." : "SMS Analizini Başlat"}
                      <ArrowRight size={14} weight="bold" />
                    </button>
                  </div>
                </div>

                {validationError && (
                  <p className="text-xs text-alert font-medium mt-1 flex items-center gap-1">
                    <WarningCircle size={14} weight="bold" />
                    <span>{validationError}</span>
                  </p>
                )}
              </PorcelainPanel>

              {/* SMS Sonuç Raporu */}
              {smsResult && (
                <PorcelainPanel variant="solid" className="p-5 md:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                    <div>
                      <div className="text-[11px] font-mono-tech uppercase tracking-wider text-ink-muted">
                        Mesaj Adli Raporu
                      </div>
                      <h2 className="text-lg font-bold text-ink mt-0.5">
                        Dolandırıcılık ve Manipülasyon Değerlendirmesi
                      </h2>
                    </div>
                    <RiskIndicator status={smsResult.status} score={smsResult.risk_score} />
                  </div>

                  {/* Konu ve Manipülasyon Belirteçleri (Ayrık Kartlar) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Konu Sınıflandırması */}
                    <div className="p-3.5 rounded-lg border border-border-subtle bg-canvas/60 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                        <Tag size={15} className="text-accent" />
                        <span>Tespit Edilen Konular</span>
                      </div>
                      {smsResult.detected_topics.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {smsResult.detected_topics.map((t) => (
                            <span
                              key={t.key}
                              className="px-2 py-0.5 rounded bg-surface border border-border-fine text-ink text-[11px] font-mono-tech"
                            >
                              {t.label}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-ink-muted">Özel bir taklit konusu bulunamadı.</p>
                      )}
                    </div>

                    {/* Aciliyet & Tehdit Baskısı */}
                    <div className="p-3.5 rounded-lg border border-border-subtle bg-canvas/60 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                        <Clock size={15} className="text-warning" />
                        <span>Manipülasyon Göstergeleri</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-ink-secondary">Zaman / İcra Baskısı:</span>
                          <span className={smsResult.manipulation.has_urgency ? "text-alert font-bold" : "text-safe"}>
                            {smsResult.manipulation.has_urgency ? "Var" : "Yok"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-ink-secondary">Ödeme / Borç Talebi:</span>
                          <span className={smsResult.manipulation.has_financial_demand ? "text-alert font-bold" : "text-safe"}>
                            {smsResult.manipulation.has_financial_demand ? "Var" : "Yok"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* İçerik Güvenliği / Dil Denetimi (Tamamen Bağımsız) */}
                  <div className="p-3.5 rounded-lg border border-border-subtle bg-surface space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink flex items-center gap-1.5">
                        <ChatCircleText size={15} className="text-ink-muted" />
                        İçerik Güvenliği & Dil Denetimi
                      </span>
                      <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded ${smsResult.content_safety.safe_for_work ? "bg-safe-light text-safe" : "bg-alert-light text-alert"}`}>
                        {smsResult.content_safety.safe_for_work ? "Temiz Dil" : "Uygunsuz Dil"}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-secondary">
                      {smsResult.content_safety.explanation}
                    </p>
                  </div>

                  {/* Bulgular */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                      Analiz Bulguları
                    </span>
                    {smsResult.reasons.map((r, i) => (
                      <EvidenceRow key={i} text={r} type={smsResult.risk_score >= 50 ? "alert" : "neutral"} />
                    ))}
                  </div>
                </PorcelainPanel>
              )}
            </div>
          )}

          {/* ==============================================================
              TAB 3: TITLE & CONTENT ANALYZER
             ============================================================== */}
          {activeTab === "text" && (
            <div className="space-y-6">
              <PorcelainPanel variant="solid" className="p-4 md:p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Konu Başlığı / E-posta Konusu (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                    placeholder="Örn: Acil: Hesabınız Güvenlik Nedeniyle Bloke Edildi"
                    className="w-full px-3.5 py-2 rounded-lg border border-border-fine bg-surface text-ink text-xs font-mono-tech focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Metin Gövdesi <span className="text-alert">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={textContent}
                    onChange={(e) => {
                      setTextContent(e.target.value);
                      if (validationError) setValidationError("");
                      if (serverError) setServerError("");
                    }}
                    placeholder="E-posta veya duyuru metnini buraya yapıştırın..."
                    className="w-full p-3 rounded-lg border border-border-fine bg-surface text-ink text-xs sm:text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-lg border border-border-subtle text-xs text-ink-secondary hover:text-ink"
                  >
                    Temizle
                  </button>
                  <button
                    type="button"
                    onClick={executeTextAnalysis}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-surface text-xs font-semibold hover:bg-accent-hover transition-colors shadow-subtle disabled:opacity-50"
                  >
                    {isLoading ? "İnceleniyor..." : "Metni Denetle"}
                    <ArrowRight size={14} weight="bold" />
                  </button>
                </div>
              </PorcelainPanel>

              {textResult && (
                <PorcelainPanel variant="solid" className="p-5 md:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                    <div>
                      <div className="text-[11px] font-mono-tech uppercase tracking-wider text-ink-muted">
                        Metin İnceleme Raporu
                      </div>
                      <h2 className="text-lg font-bold text-ink mt-0.5">
                        Sosyal Mühendislik & Güvenlik Değerlendirmesi
                      </h2>
                    </div>
                    <RiskIndicator status={textResult.status} score={textResult.risk_score} />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                      Değerlendirme Bulguları
                    </span>
                    {textResult.reasons.map((r, i) => (
                      <EvidenceRow key={i} text={r} type={textResult.risk_score >= 50 ? "alert" : "neutral"} />
                    ))}
                  </div>
                </PorcelainPanel>
              )}
            </div>
          )}
        </AnalysisWorkspace>
      </div>

      {/* 3. SAĞ TEKNİK TEFTİŞ PANELI (InspectionPanel - Contextual) */}
      <InspectionPanel result={urlResult} />
    </div>
  );
}
