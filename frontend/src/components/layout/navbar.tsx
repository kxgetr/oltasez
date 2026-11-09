"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, Zap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { checkBackendHealth } from "@/services/api";

export function Navbar() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    checkBackendHealth()
      .then(() => setBackendStatus("online"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border/70 bg-[#030712]/80 backdrop-blur-xl">
      <Container size="default">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Kimlik */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600 text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-extrabold tracking-tight text-white">
                  OLTA<span className="text-cyan-400">SEZ</span>
                </span>
                <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
                  MVP
                </span>
              </div>
            </div>
          </Link>

          {/* Sağ Durum Bilgisi & Menü */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface/80 px-3 py-1.5 text-xs font-mono">
              <span className="text-slate-400 hidden sm:inline">Analiz Motoru:</span>
              {backendStatus === "checking" && (
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                  Hazırlanıyor
                </span>
              )}
              {backendStatus === "online" && (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Çevrimiçi
                </span>
              )}
              {backendStatus === "offline" && (
                <span className="flex items-center gap-1.5 text-rose-400" title="FastAPI servisi bekleniyor">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  Çevrimdışı
                </span>
              )}
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 pl-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>URL Tehdit İstihbaratı</span>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
