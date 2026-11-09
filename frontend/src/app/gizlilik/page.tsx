import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock, EyeOff, ShieldCheck, ServerOff, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Gizlilik & Veri İşleme Politikası | Oltasez",
  description: "Oltasez'in sıfır ağ isteği (Zero-Network) ve gizlilik odaklı veri işleme prensipleri.",
};

export default function GizlilikPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container size="default">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
            <Lock className="w-3.5 h-3.5" />
            Gizlilik Taahhüdü ve KVKK İlkeleri
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Gizlilik ve Veri İşleme
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Oltasez, kullanıcı mahremiyetini ve güvenliğini en üst düzeyde korumak üzere &quot;Privacy-by-Design&quot; (Tasarımda Gizlilik) ilkesiyle geliştirilmiştir.
          </p>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Madde 1 */}
          <Card className="border-surface-border/80 bg-surface/70">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ServerOff className="w-4 h-4" />
                </div>
                <CardTitle className="text-base sm:text-lg text-white">
                  1. Sıfır Ağ İsteği (Zero-Network / No Web Scraping)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
              <p>
                Analiz için girdiğiniz web bağlantılarına sunucumuz tarafından <strong>kesinlikle HTTP/HTTPS isteği gönderilmez</strong>. Sayfa kaynak kodları çekilmez, çerezler (cookies) işlenmez ve web sitesine sizin adınıza bağlanılmaz.
              </p>
              <p className="text-slate-400">
                Bu sayede kimlik avı sitelerinin sizi tespit etmesi veya IP adresinizin hedef sunucuya iletilmesi engellenmiş olur.
              </p>
            </CardContent>
          </Card>

          {/* Madde 2 */}
          <Card className="border-surface-border/80 bg-surface/70">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-950 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <EyeOff className="w-4 h-4" />
                </div>
                <CardTitle className="text-base sm:text-lg text-white">
                  2. Kullanıcı Verilerinin Saklanmaması
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
              <p>
                Analiz formuna yapıştırdığınız SMS metinleri, e-posta içerikleri veya alan adları sunucu belleğinde geçici olarak analiz edilir ve yanıt üretildikten sonra <strong>anında bellekten serbest bırakılır</strong>.
              </p>
              <p className="text-slate-400">
                Metinleriniz herhangi bir veritabanında saklanmaz, profil çıkarma amaçlı kullanılmaz ve üçüncü taraf veri aracılarına satılmaz.
              </p>
            </CardContent>
          </Card>

          {/* Madde 3 */}
          <Card className="border-surface-border/80 bg-surface/70">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <FileCheck className="w-4 h-4" />
                </div>
                <CardTitle className="text-base sm:text-lg text-white">
                  3. Çerez ve İzleyici Politikası
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Platformumuzda reklam çerezleri, üçüncü taraf davranışsal izleyiciler (trackers) veya kimliğinizi tespit eden gözetleme kodları bulunmamaktadır. Yalnızca uygulamanın temel performansını koruyan hafif ve anonim telemetri prensipleri geçerlidir.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
