import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Oltasez | Yapay Zekâ Destekli Phishing & URL Analiz Platformu",
  description: "Şüpheli bağlantıları ve oltalama (phishing) girişimlerini makine öğrenimi ile anında tespit edin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="antialiased bg-[#030712] text-slate-100 flex flex-col min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <div className="flex-1 cyber-grid relative overflow-hidden">
          {/* Ambient Arka Plan Siber Glow Işıkları */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-cyan-500/10 blur-[140px] rounded-full" />
          <div className="pointer-events-none absolute top-1/2 -right-36 w-[500px] h-[400px] bg-teal-500/10 blur-[150px] rounded-full" />
          
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
