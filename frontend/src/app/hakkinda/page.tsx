import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Sparkles, BookOpen, Target, CheckCircle2, Award } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkında | Oltasez Siber Tehdit & Phishing Savunması",
  description: "Oltasez projesinin akademik temelleri, Türkçe odaklı siber güvenlik hedefleri ve misyonu.",
};

export default function HakkindaPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container size="default">
        {/* Giriş */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Proje Vizyonu & Akademik Amaç
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Oltasez Hakkında
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Dijital dönüşümün hızlandığı günümüzde, vatandaşları ve kurumları Türkçe dil dinamiklerine göre tasarlanmış sosyal mühendislik tuzaklarına karşı korumayı hedefleyen açık kaynaklı bir siber güvenlik girişimi.
          </p>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="border-surface-border/80 bg-surface/70">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-3">
                <Target className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg text-white">Problem ve Çıkış Noktası</CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-400 leading-relaxed space-y-3">
              <p>
                Küresel antivirüs ve web güvenliği araçları genellikle İngilizce hedefli oltalama saldırılarına göre eğitilmiştir. Türkiye&apos;de ise dolandırıcılar; HGS geçiş ihlalleri, e-Devlet kapısı sahte bildirimleri, kargo takip kodları ve gecikmiş elektrik faturaları gibi yerel kavramları istismar etmektedir.
              </p>
              <p>
                Oltasez, bu yerel tehdit biçimlerini Türkçe dilbilgisel ve morfolojik kalıplarıyla ele alarak özel bir güvenlik kalkanı sunar.
              </p>
            </CardContent>
          </Card>

          <Card className="border-surface-border/80 bg-surface/70">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg text-white">Şeffaflık ve Yapay Zekâ Etiği</CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-400 leading-relaxed space-y-3">
              <p>
                Pek çok sistem kullanıcılara doğrulanmamış ve anlaşılmaz &quot;%99 Güvenli&quot; gibi uydurma yapay zekâ skorları sunar.
              </p>
              <p>
                Oltasez ise <strong>Açıklanabilir Güvenlik (Explainable AI / Security)</strong> ilkesiyle hareket eder: Üretilen her risk skorunun gerekçeleri, hangi göstergelerin tetiklendiği ve sınırlamaları açıkça kullanıcıya raporlanır.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Temel İlkeler */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#030712]/80 border border-surface-border">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            Temel Değerlerimiz & Taahhütlerimiz
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Gizlilik Önceliği
              </div>
              <p className="text-slate-400">
                Hedef web adreslerine hiçbir ağ isteği gönderilmez. Kullanıcıların girdiği metinler asla üçüncü taraflara satılmaz.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Ayrık Risk Modeli
              </div>
              <p className="text-slate-400">
                Konu, dolandırıcılık riski ve küfür/hakaret içerik güvenliği 3 bağımsız kategoride ele alınır; birbirine karıştırılmaz.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Açık ve Erişilebilir
              </div>
              <p className="text-slate-400">
                Hem teknik uzmanlar hem de son kullanıcılar için anlaşılır, sade ve Türkçe siber güvenlik rehberliği sağlar.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
