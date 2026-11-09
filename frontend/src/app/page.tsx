"use client";

import { useState } from "react";
import { 
  Search, 
  ArrowRight, 
  Zap, 
  Binary, 
  SlidersHorizontal, 
  CheckCircle2, 
  ArrowDownCircle, 
  Globe2,
  FileSearch,
  Sparkles,
  Info,
  RotateCcw,
  MessageSquare,
  FileText,
  Link2
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResultPanel } from "@/components/analysis/result-panel";
import { SampleUrlSelector } from "@/components/analysis/sample-urls";
import { EmptyState } from "@/components/analysis/empty-state";
import { LoadingState } from "@/components/analysis/loading-state";
import { ErrorState } from "@/components/analysis/error-state";
import { ModeSelector, AnalysisMode } from "@/components/analysis/mode-selector";
import { MessageResultPanel } from "@/components/analysis/message-result-panel";
import { 
  URLAnalysisResponse, 
  SMSAnalysisResponse, 
  TextAnalysisResponse 
} from "@/types/analysis";
import { 
  analyzeUrl, 
  analyzeSms, 
  analyzeText, 
  ApiError 
} from "@/services/api";

export default function Home() {
  const [activeMode, setActiveMode] = useState<AnalysisMode>("url");

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

  // Shared status state
  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollToAnalyzer = () => {
    const el = document.getElementById("analyzer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleModeChange = (mode: AnalysisMode) => {
    setActiveMode(mode);
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
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError("Analiz servisine erişilirken beklenmeyen bir ağ yanıtı alındı.");
      }
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
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError("SMS analiz servisine ulaşılamadı.");
      }
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
      setValidationError("Lütfen analiz edilecek e-posta veya metin içeriğini giriniz.");
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
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError("Metin analiz servisine ulaşılamadı.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetCurrent = () => {
    setValidationError("");
    setServerError("");
    if (activeMode === "url") {
      setUrlInput("");
      setUrlResult(null);
    } else if (activeMode === "sms") {
      setSmsSender("");
      setSmsMessage("");
      setSmsResult(null);
    } else {
      setTextTitle("");
      setTextContent("");
      setTextResult(null);
    }
  };

  // Quick fill samples for SMS & Text
  const loadSmsSample = (sender: string, text: string) => {
    setSmsSender(sender);
    setSmsMessage(text);
  };

  const loadTextSample = (title: string, content: string) => {
    setTextTitle(title);
    setTextContent(content);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ============================================================
          1. HERO SECTION
         ============================================================ */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden text-center">
        <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full" />

        <Container size="default">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-8 shadow-[0_0_20px_-3px_rgba(6,182,212,0.15)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Türkçe Odaklı Siber Tehdit & Dolandırıcılık Analiz Platformu
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Oltalama ve SMS Tuzaklarını{" "}
            <span className="bg-gradient-to-r from-teal-200 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
              Anında Çözümleyin
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            HGS borcu, sahte kargo bildirimi, fatura taklidi ve yanıltıcı bağlantıları güvenli, gizlilik odaklı ve çok boyutlu sezgisel motorumuzla saniyeler içinde denetleyin.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={scrollToAnalyzer} className="shadow-lg shadow-cyan-500/25 group w-full sm:w-auto">
              <span>Analize Başla</span>
              <ArrowDownCircle className="w-4 h-4 ml-2 transition-transform group-hover:translate-y-0.5" />
            </Button>
            <a
              href="#how-it-works"
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-surface-border/60 hover:border-slate-600 bg-surface/30 backdrop-blur-sm"
            >
              <span>3 Boyutlu Analiz Mimarisi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> URL & Leksikal Analiz
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> SMS & Sosyal Mühendislik Tespiti
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Bağımsız İçerik Güvenliği
            </span>
          </div>
        </Container>
      </section>

      {/* ============================================================
          2. ANALYZER SECTION (3 MOD SEÇİCİ & ANALİZ ALANI)
         ============================================================ */}
      <section id="analyzer" className="py-16 sm:py-24 bg-[#030712]/90 border-y border-surface-border/70 relative">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 mb-2 uppercase tracking-widest bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Çok Modlu Canlı Analiz
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Güvenlik Denetim Merkezi
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Analiz etmek istediğiniz veri tipini seçin ve içeriği yapıştırın.
            </p>
          </div>

          {/* MOD SEÇİCİ TABLAR */}
          <ModeSelector currentMode={activeMode} onSelectMode={handleModeChange} />

          {/* ==================== MOD 1: URL ANALİZİ ==================== */}
          {activeMode === "url" && (
            <div className="animate-fade-in">
              <div className="max-w-3xl mx-auto p-2 sm:p-2.5 rounded-2xl analyzer-focal-box">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeUrlAnalysis(urlInput);
                  }}
                  className="flex flex-col sm:flex-row gap-2.5"
                >
                  <div className="relative flex-1 flex items-center">
                    <Search className="w-5 h-5 absolute left-4 text-cyan-400/80" />
                    <Input
                      type="text"
                      placeholder="https://hesap-dogrulama.xyz veya ornek-site.com"
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value);
                        if (validationError) setValidationError("");
                        if (serverError) setServerError("");
                      }}
                      isError={Boolean(validationError || serverError)}
                      className="pl-12 pr-10 border-none bg-transparent shadow-none text-sm sm:text-base placeholder:text-slate-500 focus:ring-0 text-white"
                    />
                    {urlInput && (
                      <button
                        type="button"
                        onClick={handleResetCurrent}
                        title="Temizle"
                        className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <Button type="submit" size="lg" isLoading={isLoading} className="sm:w-auto w-full group shrink-0">
                    <span>Analiz Et</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </div>

              {validationError && (
                <p className="text-center text-xs font-mono text-rose-400 mt-3 animate-fade-in">
                  {validationError}
                </p>
              )}

              <div className="max-w-3xl mx-auto mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400 text-center">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Desteklenen biçimler: <code>https://...</code>, <code>http://...</code> veya doğrudan alan adı (örn: <code>site.com</code>).</span>
              </div>

              {/* URL Örnekleri */}
              <SampleUrlSelector
                onSelect={(s) => {
                  setUrlInput(s);
                  executeUrlAnalysis(s);
                }}
                selectedUrl={urlInput}
              />

              {/* URL Sonuç Alanı */}
              {isLoading ? (
                <LoadingState />
              ) : serverError ? (
                <ErrorState message={serverError} onRetry={() => executeUrlAnalysis(urlInput)} />
              ) : urlResult ? (
                <ResultPanel result={urlResult} />
              ) : (
                <EmptyState />
              )}
            </div>
          )}

          {/* ==================== MOD 2: SMS ANALİZİ ==================== */}
          {activeMode === "sms" && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <div className="p-4 sm:p-6 rounded-2xl border border-surface-border bg-surface/80 shadow-2xl backdrop-blur-md space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    SMS Başlığı / Gönderen Kimliği (Opsiyonel)
                  </label>
                  <Input
                    type="text"
                    placeholder="Örn: HGS-INFO, PTT-BILGI veya +905551234567"
                    value={smsSender}
                    onChange={(e) => setSmsSender(e.target.value)}
                    className="bg-slate-950/70 border-surface-border text-white text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    SMS Metni <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Mesaj metnini buraya yapıştırın..."
                    value={smsMessage}
                    onChange={(e) => {
                      setSmsMessage(e.target.value);
                      if (validationError) setValidationError("");
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-surface-border text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 placeholder:text-slate-500 resize-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-slate-400 mr-1">Hazır Senaryolar:</span>
                    <button
                      type="button"
                      onClick={() =>
                        loadSmsSample(
                          "HGS-INFO",
                          "Sayın Araç Sahibi, 2.450 TL ödenmemiş HGS geçiş borcunuz bulunmaktadır. İcra takibi başlatılmaması için derhal ödeyiniz: http://hgs-ceza-online.cc/odeme"
                        )
                      }
                      className="px-2 py-1 rounded bg-slate-900 border border-surface-border text-[11px] text-cyan-300 hover:border-cyan-500/50"
                    >
                      HGS Tuzağı
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        loadSmsSample(
                          "PTT-KARGO",
                          "Paketiniz adres eksikliği sebebiyle şubemizde bekletilmektedir. 24 saat içinde güncelleyiniz: http://ptt-kargo-takip.xyz/bilgi"
                        )
                      }
                      className="px-2 py-1 rounded bg-slate-900 border border-surface-border text-[11px] text-teal-300 hover:border-teal-500/50"
                    >
                      Kargo Tuzağı
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        loadSmsSample(
                          "HGS",
                          "HGS bakiye yukleme isleminiz tamamlanmistir. Yeni bakiyeniz 250 TL."
                        )
                      }
                      className="px-2 py-1 rounded bg-slate-900 border border-surface-border text-[11px] text-emerald-300 hover:border-emerald-500/50"
                    >
                      Zararsız HGS Bilgisi
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResetCurrent}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Temizle
                    </Button>
                    <Button
                      type="button"
                      onClick={executeSmsAnalysis}
                      isLoading={isLoading}
                      className="flex-1 sm:flex-none shadow-lg shadow-cyan-500/20"
                    >
                      <span>SMS Analizini Başlat</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {validationError && (
                <p className="text-center text-xs font-mono text-rose-400 mt-3 animate-fade-in">
                  {validationError}
                </p>
              )}

              {/* SMS Sonuç Alanı */}
              {isLoading ? (
                <LoadingState />
              ) : serverError ? (
                <ErrorState message={serverError} onRetry={executeSmsAnalysis} />
              ) : smsResult ? (
                <MessageResultPanel result={smsResult} mode="sms" />
              ) : (
                <EmptyState />
              )}
            </div>
          )}

          {/* ==================== MOD 3: BAŞLIK VE METİN ANALİZİ ==================== */}
          {activeMode === "text" && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <div className="p-4 sm:p-6 rounded-2xl border border-surface-border bg-surface/80 shadow-2xl backdrop-blur-md space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Konu Başlığı / E-posta Konusu (Opsiyonel)
                  </label>
                  <Input
                    type="text"
                    placeholder="Örn: Acil Hesap Bildirimi, Fatura Gecikmesi vb."
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                    className="bg-slate-950/70 border-surface-border text-white text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    İçerik Metni <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="E-posta gövdesi, duyuru veya mesaj metnini buraya yapıştırın..."
                    value={textContent}
                    onChange={(e) => {
                      setTextContent(e.target.value);
                      if (validationError) setValidationError("");
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-surface-border text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 placeholder:text-slate-500 resize-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-slate-400 mr-1">Hazır Şablonlar:</span>
                    <button
                      type="button"
                      onClick={() =>
                        loadTextSample(
                          "Hesabınız Güvenlik Nedeniyle Askıya Alındı",
                          "Değerli müşterimiz, banka hesabınızda şüpheli işlem girişimleri tespit edilmiştir. 1 saat içerisinde güvenli onay sayfasına giderek bilgilerinizi doğrulamazsanız hesabınız bloke edilecektir: http://banka-onay-sistemi.cc/dogrula"
                        )
                      }
                      className="px-2 py-1 rounded bg-slate-900 border border-surface-border text-[11px] text-rose-300 hover:border-rose-500/50"
                    >
                      Banka Bloke E-postası
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        loadTextSample(
                          "Gecikmiş Doğalgaz Faturası",
                          "Sayın abonemiz, ödenmemiş faturanız sebebiyle gaz arzınız 24 saat içinde kesilecektir. Kesintiyi önlemek için derhal online ödeme yapınız: http://fatura-borc-ode.xyz"
                        )
                      }
                      className="px-2 py-1 rounded bg-slate-900 border border-surface-border text-[11px] text-amber-300 hover:border-amber-500/50"
                    >
                      Fatura Kesintisi Tuzağı
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResetCurrent}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Temizle
                    </Button>
                    <Button
                      type="button"
                      onClick={executeTextAnalysis}
                      isLoading={isLoading}
                      className="flex-1 sm:flex-none shadow-lg shadow-cyan-500/20"
                    >
                      <span>Metni Denetle</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {validationError && (
                <p className="text-center text-xs font-mono text-rose-400 mt-3 animate-fade-in">
                  {validationError}
                </p>
              )}

              {/* Metin Sonuç Alanı */}
              {isLoading ? (
                <LoadingState />
              ) : serverError ? (
                <ErrorState message={serverError} onRetry={executeTextAnalysis} />
              ) : textResult ? (
                <MessageResultPanel result={textResult} mode="text" />
              ) : (
                <EmptyState />
              )}
            </div>
          )}
        </Container>
      </section>

      {/* ============================================================
          3. FEATURES SECTION (MINIMAL SaaS KARTLARI)
         ============================================================ */}
      <section className="py-20 sm:py-28">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
              Temel Nitelikler
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Neden Oltasez?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Geleneksel tarama yöntemlerinin gecikmelerinden arındırılmış, hafif ve hedefe yönelik analiz mimarisi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="interactive">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <CardTitle className="text-base text-white">Ultra Düşük Gecikme</CardTitle>
                <CardDescription className="text-xs text-slate-400 leading-relaxed mt-2">
                  Hedef sunucuya ağ bağlantısı kurmadan, yalnızca leksikal ve metin özellikleri üzerinden milisaniyeler içinde değerlendirme yapar.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-teal-950/70 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Binary className="w-6 h-6" />
                </div>
                <CardTitle className="text-base text-white">Çok Modlu Sezgisel Motor</CardTitle>
                <CardDescription className="text-xs text-slate-400 leading-relaxed mt-2">
                  URL yapısı, SMS manipülasyon taktikleri ve e-posta içeriklerini ayrık risk ve konu modelleriyle inceler.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-sky-950/70 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <CardTitle className="text-base text-white">Ayrık Güvenlik Modeli</CardTitle>
                <CardDescription className="text-xs text-slate-400 leading-relaxed mt-2">
                  Konu taklidi, aciliyet baskısı ve dil güvenliğini (küfür/hakaret) birbirine karıştırmadan şeffafça sınıflandırır.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Globe2 className="w-6 h-6" />
                </div>
                <CardTitle className="text-base text-white">Türkçe Tehditlere Özel</CardTitle>
                <CardDescription className="text-xs text-slate-400 leading-relaxed mt-2">
                  HGS borcu, e-Devlet, kargo teslimatı ve elektrik/su/internet faturası dolandırıcılık modelleri için optimize edilmiş kalıplar.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Container>
      </section>

      {/* ============================================================
          4. HOW IT WORKS SECTION
         ============================================================ */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#030712]/50 border-t border-surface-border/50">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
              Çalışma Mantığı
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Sistem Nasıl Çalışır?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Uçtan uca güvenli, veri kazıma gerektirmeyen şeffaf 3 aşamalı değerlendirme döngüsü.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-surface/50 border border-surface-border/70 relative">
              <div className="w-9 h-9 rounded-lg bg-cyan-950 text-cyan-400 font-mono text-sm font-bold flex items-center justify-center mb-4 border border-cyan-500/30">
                01
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Metin ve URL Ayrıştırma</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                İçerik içindeki alan adları, aciliyet belirteçleri ve konu anahtar kelimeleri regex ve leksikal ayrıştırıcı ile çıkarılır.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface/50 border border-surface-border/70 relative">
              <div className="w-9 h-9 rounded-lg bg-cyan-950 text-cyan-400 font-mono text-sm font-bold flex items-center justify-center mb-4 border border-cyan-500/30">
                02
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Çok Boyutlu Sınıflandırma</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Konu türü, oltalama riski ve içerik güvenliği 3 bağımsız mantık katmanında işlenir. Sahte AI güven puanları üretilmez.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface/50 border border-surface-border/70 relative">
              <div className="w-9 h-9 rounded-lg bg-cyan-950 text-cyan-400 font-mono text-sm font-bold flex items-center justify-center mb-4 border border-cyan-500/30">
                03
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Ayrıntılı Şeffaf Rapor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Risk skoru, tetiklenen göstergeler, IP/entropi ölçümleri ve Türkçe açıklamalar kullanıcıya anlaşılır şekilde sunulur.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
