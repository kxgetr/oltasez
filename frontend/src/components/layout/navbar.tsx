"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, Cpu, Menu, X, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { checkBackendHealth } from "@/services/api";

export function Navbar() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    checkBackendHealth()
      .then(() => setBackendStatus("online"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  const navLinks = [
    { href: "/", label: "Analiz Merkezi" },
    { href: "/nasil-calisir", label: "Nasıl Çalışır?" },
    { href: "/hakkinda", label: "Hakkında" },
    { href: "/gizlilik", label: "Gizlilik" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border/80 bg-[#030712]/85 backdrop-blur-xl">
      <Container size="default">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Kimlik */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-xl p-1">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600 text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-extrabold tracking-tight text-white">
                OLTA<span className="text-cyan-400">SEZ</span>
              </span>
              <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
                PROD
              </span>
            </div>
          </Link>

          {/* Masaüstü Navigasyon */}
          <nav className="hidden md:flex items-center gap-1 bg-surface/50 p-1.5 rounded-xl border border-surface-border/60">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Sağ Durum Bilgisi & Mobil Menü Tetikleyici */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface/80 px-3 py-1.5 text-xs font-mono">
              <span className="text-slate-400 hidden sm:inline">Motor:</span>
              {backendStatus === "checking" && (
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-[11px]">Kontrol Ediliyor</span>
                </span>
              )}
              {backendStatus === "online" && (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px]">Çevrimiçi</span>
                </span>
              )}
              {backendStatus === "offline" && (
                <span className="flex items-center gap-1.5 text-rose-400" title="API servisi yanıt vermiyor">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="text-[11px]">Çevrimdışı</span>
                </span>
              )}
            </div>

            {/* Mobil Menü Butonu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              aria-label="Menüyü aç/kapat"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobil Açılır Menü */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface-border/60 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? "bg-cyan-500/15 text-cyan-300 font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
