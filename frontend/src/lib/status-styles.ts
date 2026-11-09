import { RiskStatus } from "@/types/analysis";

export interface StatusStyleConfig {
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  dotColor: string;
  cardBorder: string;
  glowClass: string;
  gaugeStroke: string;
  progressBarColor: string;
  iconColor: string;
  summaryText: string;
  actionText: string;
  description: string;
}

export function getStatusStyle(status: RiskStatus | string): StatusStyleConfig {
  const normalized = status.toLowerCase();

  if (normalized === "safe" || normalized === "güvenli") {
    return {
      label: "Güvenli",
      badgeBg: "bg-emerald-500/10",
      badgeBorder: "border-emerald-500/30",
      badgeText: "text-emerald-400",
      dotColor: "bg-emerald-400",
      cardBorder: "border-emerald-500/30",
      glowClass: "shadow-[0_0_40px_-10px_rgba(16,185,129,0.18)]",
      gaugeStroke: "#10b981",
      progressBarColor: "bg-emerald-500",
      iconColor: "text-emerald-400",
      summaryText: "Yapısal ve leksikal özniteliklere göre tehdit tespit edilmedi.",
      actionText: "Bağlantı olağan standartlara uygundur; temel güvenlik önlemlerini koruyunuz.",
      description: "Alan adı mimarisi, SSL/TLS şifrelemesi ve karakter dağılımı meşru standartlar içerisindedir.",
    };
  }

  if (normalized === "suspicious" || normalized === "şüpheli") {
    return {
      label: "Şüpheli",
      badgeBg: "bg-amber-500/10",
      badgeBorder: "border-amber-500/35",
      badgeText: "text-amber-400",
      dotColor: "bg-amber-400",
      cardBorder: "border-amber-500/35",
      glowClass: "shadow-[0_0_40px_-10px_rgba(245,158,11,0.18)]",
      gaugeStroke: "#f59e0b",
      progressBarColor: "bg-amber-500",
      iconColor: "text-amber-400",
      summaryText: "Olağandışı yapısal desenler ve şüpheli belirteçler saptandı.",
      actionText: "Sayfadaki formlara kimlik, parola veya finansal veri girmeyiniz.",
      description: "Çok katmanlı alt alan adı, şüpheli uzantı veya aldatıcı anahtar kelime desenleri içeriyor.",
    };
  }

  // phishing / oltalama riski
  return {
    label: "Oltalama Riski",
    badgeBg: "bg-rose-500/15",
    badgeBorder: "border-rose-500/40",
    badgeText: "text-rose-400",
    dotColor: "bg-rose-400",
    cardBorder: "border-rose-500/40",
    glowClass: "shadow-[0_0_45px_-10px_rgba(239,68,68,0.22)]",
    gaugeStroke: "#ef4444",
    progressBarColor: "bg-rose-500",
    iconColor: "text-rose-400",
    summaryText: "Kritik oltalama (phishing) karakteristiği tespit edildi.",
    actionText: "Bu bağlantıyı ziyaret etmeyiniz ve derhal oturumu sonlandırınız.",
    description: "Ham IP barındırma, sahte marka benzerliği veya yanıltıcı yönlendirme parametreleri bulundu.",
  };
}
