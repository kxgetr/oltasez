"use client";

import Link from "next/link";

export default function NasilCalisirPage() {
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
          Nasıl çalışır
        </h1>

        <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-1.5">
            <h2 className="font-semibold text-slate-900 text-sm">
              Bağlantı analizi
            </h2>
            <p>
              Bağlantı taranırken hedef sunucuya istek gönderilmez. Alan adının yapısı, karakter karmaşıklığı (entropi), ham IP kullanımı ve bilinen resmî kurum taklitleri kontrol edilir.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-semibold text-slate-900 text-sm">
              Mesaj ve metin analizi
            </h2>
            <p>
              Metindeki kurum taklitleri (HGS, kargo, fatura), yapay aciliyet baskısı (icra, bloke, son 24 saat) ve içerikteki bağlantılar incelenir.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-semibold text-slate-900 text-sm">
              Konu ve risk ayrımı
            </h2>
            <p>
              Bir metinde &quot;HGS&quot; veya &quot;fatura&quot; kelimesinin geçmesi tek başına dolandırıcılık işareti değildir. Risk ancak tehdit, baskı veya sahte yönlendirme ile birlikte değerlendirilir.
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
