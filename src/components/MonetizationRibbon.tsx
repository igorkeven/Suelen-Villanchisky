import * as React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Crown, Star, Flame, Link as LinkIcon } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { useAdultConsent } from "@/hooks/useAdultConsent";

type PlatformKey = "topfans" | "privacy" | "telegram" | "default";

type PlatformItem = {
  name: string;
  url: string;
  key?: PlatformKey;        // força a marca se quiser
  priority?: boolean;
  shortLabel?: string;      // rótulo curto (mobile)
  icon?: React.ElementType; // ícone opcional por item
};

// 🔧 Paleta por plataforma (ajuste os hex se preferir)
const BRAND_STYLES: Record<PlatformKey, { bg: string; hover: string; fg: string; icon: React.ElementType; short: string }> = {
  topfans:  { bg: "#7C3AED", hover: "#6D28D9", fg: "#FFFFFF", icon: Star,          short: "TopFans" },
  privacy:  { bg: "#111827", hover: "#0F1624", fg: "#FFFFFF", icon: Crown,         short: "Privacy" },
  telegram: { bg: "#229ED9", hover: "#1F8DC3", fg: "#FFFFFF", icon: FaTelegramPlane, short: "Telegram" },
  default:  { bg: "#E11D48", hover: "#C41041", fg: "#FFFFFF", icon: Flame,         short: "Premium" },
};

// Detecta a marca pelo host da URL (fallback: default)
function guessKeyFromUrl(url: string): PlatformKey {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("topfans")) return "topfans";
    if (host.includes("privacy.com.br")) return "privacy";
    if (host.includes("t.me") || host.includes("telegram.me")) return "telegram";
  } catch {}
  return "default";
}

function getBrandMeta(p: PlatformItem) {
  const key: PlatformKey = p.key || guessKeyFromUrl(p.url);
  const style = BRAND_STYLES[key] ?? BRAND_STYLES.default;
  const Icon = (p.icon as React.ElementType) || style.icon || LinkIcon;
  const label = p.name || style.short;
  return { ...style, Icon, label, key };
}

// ✅ Preencha as URLs reais aqui
const PLATFORMS: PlatformItem[] = [
  {
    name: "TopFans",
    url: "https://topfans.me/SEU_PERFIL", // ou topfans.com
    key: "topfans",
    priority: true,
    shortLabel: "TopFans",
  },
  {
    name: "Privacy",
    url: "https://privacy.com.br/SEU_PERFIL",
    key: "privacy",
    priority: true,
    shortLabel: "Privacy",
  },
  {
    name: "Telegram (Free)",
    url: "https://t.me/SEU_CANAL",
    key: "telegram",
    priority: false,
    shortLabel: "Telegram",
  },
];

export function MonetizationRibbon() {
  const { consented } = useAdultConsent();
  if (!consented) return null;

  return (
    <>
      {/* Desktop - Top Ribbon */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">
              🔥 Conteúdo exclusivo nas plataformas:
            </span>

            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map((platform) => {
                const meta = getBrandMeta(platform);
                return (
                  <Button
                    key={platform.name}
                    asChild
                    className={`text-sm py-2 px-4 rounded-xl shadow-md ${platform.priority ? "ring-1 ring-white/10" : ""}`}
                    style={{ backgroundColor: meta.bg, color: meta.fg }}
                    aria-label={`Abrir ${meta.label}`}
                  >
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                    >
                      <meta.Icon className="w-4 h-4 mr-2" />
                      {meta.label}
                      <ExternalLink className="w-3 h-3 ml-2 opacity-80" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile - Bottom Dock */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-white/20">
        <div className="grid grid-cols-3 gap-1 p-2">
          {PLATFORMS.map((platform) => {
            const meta = getBrandMeta(platform);
            return (
              <Button
                key={platform.name}
                asChild
                variant="ghost"
                className="flex flex-col items-center p-3 h-auto space-y-1 rounded-2xl hover:opacity-90"
                aria-label={`Abrir ${meta.label}`}
              >
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                >
                  <meta.Icon className="w-5 h-5 mx-auto" style={{ color: meta.bg }} />
                  <span className="text-[11px] font-medium" style={{ color: meta.bg }}>
                    {platform.shortLabel || meta.label}
                  </span>
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}
