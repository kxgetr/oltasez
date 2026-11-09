import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Network, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Binary, 
  Tag, 
  SlidersHorizontal,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nasıl Çalışır? | Oltasez Siber Tehdit Analiz Mimarisi",
  description: "Oltasez'in 3 bağımsız motoru (URL, SMS/Mesaj ve İçerik Güvenliği) hakkında kapsamlı teknik dokümantasyon.",
};

export default function NasilCalisirPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container size="default">
        {/* Başlık Alanı */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5" />
            Teknik Mimari & Değerlendirme Yöntemleri
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Oltasez Nasıl Çalışır?
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Hedef sunucuyu ziyaret etmeden, gizliliği ihlal etmeden ve kullanıcı verilerini kazımadan; tamamen leksikal öznitelikler, dil kalıpları ve siber güvenlik sezgileriyle çalışan 3 boyutlu koruma motoru.
          </p>
        </div>

        {/* 3 Bağımsız Motor Bölümü */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {/* 1. MOTOR: URL DETECTION ENGINE */}
          <Card className="border-cyan-500/30 bg-surface/80 backdrop-blur-md">
            <CardHeader className="border-b border-surface-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                    Modül 01
                  </div>
                  <CardTitle className="text-xl text-white">
                    URLDetectionEngine (Leksikal Bağlantı Analizörü)
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                Geleneksel web tarayıcıları şüpheli bir linki açtığında kullanıcıyı zararlı yazılım indirme veya oturum çalma tehlikesine maruz bırakabilir. Oltasez <strong>Zero-Network (Sıfır Ağ Bağlantısı)</strong> prensibini benimser:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-surface-border">
                  <div className="font-semibold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Binary className="w-3.5 h-3.5 text-cyan-400" />
                    14 Matematiksel Öznitelik
                  </div>
                  <p className="text-xs text-slate-400">
                    Shannon entropisi, alt alan adı derinliği, rakam yoğunluğu, IP kullanımı ve özel karakter dağılımı milisaniyeler içinde çıkarılır.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-surface-border">
                  <div className="font-semibold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-teal-400" />
                    Resmî Alan Adı Eşlemesi
                  </div>
                  <p className="text-xs text-slate-400">
                    e-Devlet, KGM, PTT, GİB ve bankaların tescilli kök alan adları güvenli sayılır; naif substring kontrolleri engellenerek taklitler yakalanır.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. MOTOR: SCAM TEXT ENGINE */}
          <Card className="border-teal-500/30 bg-surface/80 backdrop-blur-md">
            <CardHeader className="border-b border-surface-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-400">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-teal-400 uppercase tracking-wider">
                    Modül 02
                  </div>
                  <CardTitle className="text-xl text-white">
                    ScamTextEngine (Türkçe Dolandırıcılık Tespiti)
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                Türkiye siber dolandırıcılık ekosisteminde en sık görülen HGS geçiş cezası, sahte kargo teslimatı, elektrik faturası kesintisi ve banka bloke tehditlerini inceler.
              </p>
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs">
                <strong>Kritik Ayrım İlkesi:</strong> Bir metinde &quot;HGS&quot; veya &quot;Fatura&quot; kelimesinin geçmesi <strong>asla tek başına dolandırıcılık kanıtı sayılmaz</strong>. Risk puanı; aciliyet baskısı, haciz tehdidi, kredi kartı/şifre isteme ve sahte link varlığıyla birlikte hesaplanır.
              </div>
            </CardContent>
          </Card>

          {/* 3. MOTOR: CONTENT SAFETY ENGINE */}
          <Card className="border-purple-500/30 bg-surface/80 backdrop-blur-md">
            <CardHeader className="border-b border-surface-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
                    Modül 03
                  </div>
                  <CardTitle className="text-xl text-white">
                    ContentSafetyEngine (İçerik Güvenliği ve Dil Denetimi)
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                Küfür, hakaret ve saldırgan üslubu tespit eder. Maskelenmiş karakterleri (leetspeak: <code>$erefsiz</code>, <code>s4l4k</code>) ve Türkçe karakter varyasyonlarını tanır.
              </p>
              <p>
                <strong>Bağlam Duyarlılığı:</strong> Alıntı içinde (tırnak içinde) geçen veya haber niteliğindeki küfürler hafifletilir. En önemlisi; küfür içermesi bir metni phishing yapmaz, dolandırıcılık skoru ile içerik güvenliği skoru tamamen ayrı raporlanır.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-semibold text-sm hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-opacity"
          >
            <span>Canlı Analiz Merkezini Dene</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
