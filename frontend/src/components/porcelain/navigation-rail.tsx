"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Globe, 
  ChatCircleDots, 
  Article, 
  FileText, 
  Info, 
  ShieldCheck,
  LockSimple
} from "@phosphor-icons/react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: "url", label: "URL İnceleme", href: "/", icon: Globe },
  { id: "sms", label: "SMS / Mesaj", href: "/?mode=sms", icon: ChatCircleDots },
  { id: "text", label: "Başlık & Metin", href: "/?mode=text", icon: Article },
  { id: "methodology", label: "Metodoloji", href: "/nasil-calisir", icon: FileText },
  { id: "about", label: "Hakkında", href: "/hakkinda", icon: Info },
  { id: "privacy", label: "Gizlilik", href: "/gizlilik", icon: LockSimple },
];

interface NavigationRailProps {
  currentTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function NavigationRail({ currentTab, onTabChange }: NavigationRailProps) {
  const pathname = usePathname();

  return (
    <aside className="w-16 md:w-56 shrink-0 border-r border-border-subtle bg-surface flex flex-col justify-between py-4 select-none">
      {/* Üst Logo & Uygulama Başlığı */}
      <div>
        <div className="px-3.5 mb-6 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ink text-surface flex items-center justify-center font-bold shadow-subtle shrink-0">
            <ShieldCheck size={18} weight="bold" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold tracking-tight text-ink uppercase">
              Oltasez
            </span>
            <span className="text-[10px] font-mono text-ink-muted">
              v1.0 Porcelain
            </span>
          </div>
        </div>

        {/* Ana Gezinme Linkleri */}
        <nav className="space-y-1 px-2" aria-label="Uygulama Alanları">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isTabActive = currentTab ? currentTab === item.id : false;
            const isPathActive = pathname === item.href && !currentTab;
            const isActive = isTabActive || isPathActive;

            const content = (
              <>
                <Icon
                  size={18}
                  weight={isActive ? "fill" : "regular"}
                  className={`shrink-0 transition-colors ${
                    isActive ? "text-accent" : "text-ink-secondary group-hover:text-ink"
                  }`}
                />
                <span className="hidden md:inline text-xs font-medium truncate">
                  {item.label}
                </span>
              </>
            );

            const classes = `w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors duration-150 group ${
              isActive
                ? "bg-frost text-ink font-semibold"
                : "text-ink-secondary hover:text-ink hover:bg-canvas"
            }`;

            if (onTabChange && ["url", "sms", "text"].includes(item.id)) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={classes}
                  title={item.label}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link key={item.id} href={item.href} className={classes} title={item.label}>
                {content}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Alt Durum & Güvenlik Bildirimi */}
      <div className="px-2 pt-4 border-t border-border-subtle/60">
        <div className="px-2.5 py-2 rounded-lg bg-canvas text-[11px] text-ink-muted hidden md:block">
          <div className="flex items-center gap-1.5 font-medium text-ink">
            <span className="w-1.5 h-1.5 rounded-full bg-safe" />
            <span>Motor Çevrimiçi</span>
          </div>
          <p className="text-[10px] text-ink-faint mt-0.5 leading-tight">
            Sıfır Ağ Taraması (No-Scraping)
          </p>
        </div>
      </div>
    </aside>
  );
}
