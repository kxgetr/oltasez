import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oltasez | Porcelain Siber Tehdit Analiz Çalışma Alanı",
  description: "macOS zanaatkarlığı ve adli soruşturma istasyonu hassasiyetinde Türkçe odaklı siber güvenlik analiz platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased bg-canvas text-ink min-h-screen selection:bg-accent/15 selection:text-accent">
        {children}
      </body>
    </html>
  );
}
