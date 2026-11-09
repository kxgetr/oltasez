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
  RotateCcw
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
import { URLAnalysisResponse } from "@/types/analysis";
import { analyzeUrl, ApiError } from "@/services/api";

export default function Home() {
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<URLAnalysisResponse | null>(null);

  const scrollToAnalyzer = () => {
    const el = document.getElementById("analyzer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const executeAnalysis = async (rawUrl: string) => {
    setUrlError("");
    setServerError("");

    const trimmed = rawUrl.trim();
    if (!trimmed) {
      setUrlError("Lütfen değerlendirmek istediğiniz bir web adresi (URL) giriniz.");
      return;
    }

    if (!trimmed.includes(".") || trimmed.length < 4) {
      setUrlError("Lütfen geçerli bir alan adı formatı giriniz (örn: site.com veya https://site.com).");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const data = await analyzeUrl({ url: trimmed });
      setResult(data);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError("Analiz servisine erişilirken beklenmeyen bir ağ veya sunucu yanıtı alındı.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeAnalysis(urlInput);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setUrlInput(sampleUrl);
    executeAnalysis(sampleUrl);
  };

  const handleReset = () => {
    setUrlInput("");
    setResult(null);
    setUrlError("");
    setServerError("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ============================================================
          1. HERO SECTION (PREMIUM SIBER ESTETİK)
         ============================================================ */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden text-center">
        {/* Odak Işık Halkası */}
        <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full" />

        <Container size="default">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-8 shadow-[0_0_20px_-3px_rgba(6,182,212,0.15)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Yapay Zekâ Tabanlı URL Tehdit Değerlendirme Sistemi
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Oltalama Girişimlerini{" "}
            <span className="bg-gradient-to-r from-teal-200 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
              Anında Tespit Edin
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Şüpheli web bağlantılarını sayfa taramasına veya veri kazımaya gerek duymadan, doğrudan leksikal öznitelikler ve makine öğrenimi modelleriyle saniyeler içinde analiz edin.
          </p>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Kimlik avı, sahte giriş ekranları ve yanıltıcı alan adlarına karşı gizlilik odaklı akıllı savunma.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={scrollToAnalyzer} className="shadow-lg shadow-cyan-500/25 group w-full sm:w-auto">
              <span>Hemen Analiz Başlat</span>
              <ArrowDownCircle className="w-4 h-4 ml-2 transition-transform group-hover:translate-y-0.5" />
            </Button>
            <a
              href="#how-it-works"
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-surface-border/60 hover:border-slate-600 bg-surface/30 backdrop-blur-sm"
            >
              <span>Çalışma Prensibi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> %100 URL Odaklı
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Gizlilik Dostu (No Scraping)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> 14 Matematiksel Belirteç
            </span>
          </div>
        </Container>
      </section>

      {/* ============================================================
          2. ANALYZER SECTION (GÖRSEL ODAK NOKTASI - FOCAL POINT)
         ============================================================ */}
      <section id="analyzer" className="py-16 sm:py-24 bg-[#030712]/90 border-y border-surface-border/70 relative">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 mb-2 uppercase tracking-widest bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Canlı Analiz Motoru
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Bağlantı Güvenlik Analizörü
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Şüpheli e-posta, SMS veya mesaj bağlantılarını yapıştırarak anında test edin.
            </p>
          </div>

          {/* FOCAL BOX: PREMIUM URL ARAMA ALANI */}
          <div className="max-w-3xl mx-auto p-2 sm:p-2.5 rounded-2xl analyzer-focal-box">
            <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 absolute left-4 text-cyan-400/80" />
                <Input
                  type="text"
                  placeholder="https://hesap-dogrulama.xyz veya ornek-site.com"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (urlError) setUrlError("");
                    if (serverError) setServerError("");
                  }}
                  isError={Boolean(urlError || serverError)}
                  className="pl-12 pr-10 border-none bg-transparent shadow-none text-sm sm:text-base placeholder:text-slate-500 focus:ring-0 text-white"
                />
                {urlInput && (
                  <button
                    type="button"
                    onClick={handleReset}
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

          {urlError && (
            <p className="text-center text-xs font-mono text-rose-400 mt-3 animate-fade-in">
              {urlError}
            </p>
          )}

          <div className="max-w-3xl mx-auto mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400 text-center">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Desteklenen biçimler: <code>https://...</code>, <code>http://...</code> veya doğrudan alan adı (örn: <code>site.com</code>).</span>
          </div>

          {/* ÖRNEK URL DENEME ALANI */}
          <SampleUrlSelector onSelect={handleSelectSample} selectedUrl={urlInput} />

          {/* ANALİZ DURUM ALANI */}
          {isLoading ? (
            <LoadingState />
          ) : serverError ? (
            <ErrorState message={serverError} onRetry={() => executeAnalysis(urlInput)} />
          ) : result ? (
            <ResultPanel result={result} />
          ) : (
            <EmptyState />
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
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <CardTitle>Milisaniyelik Yanıt</CardTitle>
                <CardDescription>
                  Web sunucusuyla iletişim kurmadan doğrudan URL yapısını ayrıştırarak saniyeler içinde netice üretir.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <CardTitle>Ölçülebilir Risk Skoru</CardTitle>
                <CardDescription>
                  0 ile 100 arasında normalize edilmiş matematiksel risk puanı ve 3 kademeli durum sınıflandırması.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                  <Binary className="w-5 h-5" />
                </div>
                <CardTitle>Açıklanabilir Güvenlik</CardTitle>
                <CardDescription>
                  Kararın arkasındaki somut bulguları (entropi, alt alan adı, IP kullanımı) açık maddeler halinde sunar.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Globe2 className="w-5 h-5" />
                </div>
                <CardTitle>Gizlilik Öncelikli</CardTitle>
                <CardDescription>
                  Sayfa kaynak kodlarını taramaz, oturum veya kullanıcı verisi toplamaz; tamamen leksikal analiz yürütür.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Container>
      </section>

      {/* ============================================================
          4. HOW IT WORKS SECTION (SÜREÇ ADIMLARI)
         ============================================================ */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#030712]/90 border-t border-surface-border/60">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
              İşleyiş Modeli
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              3 Aşamalı Değerlendirme
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Analiz boru hattının arka planda yürüttüğü temel işlem adımları:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="relative overflow-hidden" variant="default">
              <div className="absolute top-5 right-5 font-mono text-3xl font-extrabold text-slate-800/80 select-none">
                01
              </div>
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <CardTitle>1. Ayrıştırma & Normalizasyon</CardTitle>
                <CardDescription>
                  Girilen bağlantı; protokol, alan adı, alt alan adı katmanları, yol ve sorgu parametrelerine güvenle ayrıştırılır.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden" variant="default">
              <div className="absolute top-5 right-5 font-mono text-3xl font-extrabold text-slate-800/80 select-none">
                02
              </div>
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                  <FileSearch className="w-5 h-5" />
                </div>
                <CardTitle>2. Öznitelik Çıkarımı</CardTitle>
                <CardDescription>
                  Karakter entropisi, rakam yoğunluğu, IP barındırma, aldatıcı kelimeler ve homograf (punycode) belirteçleri hesaplanır.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden" variant="default">
              <div className="absolute top-5 right-5 font-mono text-3xl font-extrabold text-slate-800/80 select-none">
                03
              </div>
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <Binary className="w-5 h-5" />
                </div>
                <CardTitle>3. Model Çıkarımı & Raporlama</CardTitle>
                <CardDescription>
                  Eğitilmiş sınıflandırıcı model olasılıkları hesaplar; risk skoru, durum rozeti ve açıklayıcı bulgular oluşturulur.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
