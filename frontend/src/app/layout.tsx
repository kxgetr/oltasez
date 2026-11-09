import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oltasez - Bağlantı ve Mesaj Güvenlik Kontrolü",
  description: "Şüpheli web bağlantılarını, SMS ve mesajları saniyeler içinde kontrol edin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased bg-white text-slate-900 min-h-screen selection:bg-blue-50 selection:text-blue-700">
        {children}
      </body>
    </html>
  );
}
