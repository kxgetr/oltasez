"use client";

import Link from "next/link";

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
      <header className="w-full border-b border-slate-100 px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="font-semibold text-sm tracking-tight text-slate-900">
          Oltasez
        </Link>
        <Link href="/" className="text-xs text-slate-700 hover:text-slate-900">
          Geri dön
        </Link>
      </header>

      <main className="w-full max-w-xl mx-auto px-6 py-12 flex-1">
        <h1 className="text-xl font-semibold text-slate-900 mb-4">
          Gizlilik
        </h1>

        <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-1.5">
            <h2 className="font-semibold text-slate-900 text-sm">
              Veri saklama
            </h2>
            <p>
              Kontrol edilen bağlantılar, mesajlar ve metinler sunucuda kaydedilmez. Analiz anlık olarak bellekte yapılır ve sonuç üretildikten hemen sonra silinir.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-semibold text-slate-900 text-sm">
              Hedef sunucuya bağlanmama
            </h2>
            <p>
              Girdiğiniz web bağlantılarına sunucumuz tarafından ziyaret veya sayfa kazıma isteği yapılmaz. Bu sayede IP adresiniz karşı tarafa iletilmez.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-semibold text-slate-900 text-sm">
              Çerezler ve takipçiler
            </h2>
            <p>
              Sitede reklam çerezi, üçüncü taraf takip kodu veya kullanıcı profilleme araçları bulunmaz.
            </p>
          </section>
        </div>
      </main>

      <footer className="w-full border-t border-slate-100 px-6 py-4 text-center text-[11px] text-slate-600 max-w-4xl mx-auto">
        Oltasez • Sayfa içeriği taranmaz, veriler kaydedilmez.
      </footer>
    </div>
  );
}
