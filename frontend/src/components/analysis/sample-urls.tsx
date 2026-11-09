"use client";

import * as React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export interface DemoSample {
  title: string;
  category: "safe" | "suspicious" | "phishing";
  badgeText: string;
  url: string;
  tagline: string;
}

export const DEMO_SAMPLES: DemoSample[] = [
  {
    title: "e-Devlet Kapısı",
    category: "safe",
    badgeText: "Güvenli Örnek",
    url: "https://www.turkiye.gov.tr/hizmetler",
    tagline: "Doğrulanmış HTTPS, meşru kurumsal alan adı ve standart URL yapısı."
  },
  {
    title: "Alışılmadık Alt Alan Adı",
    category: "suspicious",
    badgeText: "Şüpheli Örnek",
    url: "https://login-verify.account-update.service-support.xyz/auth",
    tagline: "Çok katmanlı alt alan adı, .xyz uzantısı ve hesap doğrulama anahtar kelimeleri."
  },
  {
    title: "Ham IP & Sahte Fatura",
    category: "phishing",
    badgeText: "Oltalama (Phishing)",
    url: "http://192.168.1.105/fatura-odeme-merkezi-onay.php?user=verify",
    tagline: "Şifresiz HTTP protokolü, doğrudan ham IP barındırma ve aldatıcı ödeme formu."
  },
  {
    title: "Homograf (Punycode)",
    category: "phishing",
    badgeText: "Karakter Taklidi",
    url: "https://xn--amazn-7qa.com/order-confirmation-signin?token=9823",
    tagline: "Punycode (xn--) teknolojisiyle benzer harfler kullanılarak marka taklidi."
  }
];

interface SampleUrlSelectorProps {
  onSelect: (url: string) => void;
  selectedUrl?: string;
}

export function SampleUrlSelector({ onSelect, selectedUrl }: SampleUrlSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Örnek Test Senaryoları <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 ml-1.5">(Demo)</span>
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Tek tıkla otomatik doldurur</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_SAMPLES.map((sample, idx) => {
          const isSelected = selectedUrl === sample.url;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(sample.url)}
              className={`p-3.5 rounded-xl text-left border transition-all duration-200 group flex flex-col justify-between ${
                isSelected
                  ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_-3px_rgba(6,182,212,0.3)]"
                  : "bg-surface/50 border-surface-border hover:bg-surface-muted/80 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {sample.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      sample.category === "safe"
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        : sample.category === "suspicious"
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                    }`}
                  >
                    {sample.badgeText}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-400 truncate max-w-full">
                  {sample.url}
                </p>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {sample.tagline}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity">
                <span>Testi Başlat</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
