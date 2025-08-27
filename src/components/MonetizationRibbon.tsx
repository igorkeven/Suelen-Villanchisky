import * as React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Crown, Star, Flame, Link as LinkIcon } from "lucide-react";
import { FaTelegramPlane} from "react-icons/fa";
import { useAdultConsent } from "@/hooks/useAdultConsent";

type PlatformKey = "topfans" | "privacy" | "telegram" | "default";
type Variant = "solid" | "inverted" | "tint";

type PlatformItem = {
  name: string;
  url: string;
  key?: PlatformKey;
  priority?: boolean;
  shortLabel?: string;
  icon?: React.ElementType;
};

const BRAND_STYLES: Record<
  PlatformKey,
  {
    variant: Variant;
    bg: string;
    hover?: string;
    fg: string;
    border?: string;
    icon: React.ElementType;
    short: string;
  }
> = {
  topfans:  { variant: "solid",    bg: "#7C3AED", hover: "#6D28D9", fg: "#FFFFFF", icon: Star,           short: "TopFans" },
  // 👇 Privacy agora INVERTED (fundo claro) para contrastar no tema dark
  privacy:  { variant: "inverted", bg: "#F8FAFC", hover: "#E5E7EB", fg: "#111827", border: "#CBD5E1", icon: Crown, short: "Privacy" },
  telegram: { variant: "solid",    bg: "#229ED9", hover: "#1F8DC3", fg: "#FFFFFF", icon: FaTelegramPlane, short: "Telegram" },
  default:  { variant: "solid",    bg: "#E11D48", hover: "#C41041", fg: "#FFFFFF", icon: Flame,          short: "Premium" },
};



// helpers (cole antes do bloco Mobile)
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const norm = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n = parseInt(norm, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function withAlpha(hex: string, a: number) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}


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

// preencha com suas URLs reais:
const PLATFORMS: PlatformItem[] = [
  { name: "TopFans",           url: "https://topfans.me/SEU_PERFIL",   key: "topfans",  priority: true,  shortLabel: "TopFans" },
  { name: "Privacy",           url: "https://privacy.com.br/SEU_PERFIL", key: "privacy", priority: true,  shortLabel: "Privacy" },
  { name: "Telegram (Grátis)", url: "https://t.me/SEU_CANAL",          key: "telegram", priority: false, shortLabel: "Telegram" },
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
            <span className="text-sm text-muted-foreground">🔥 Conteúdo exclusivo nas plataformas:</span>

            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map((p) => {
                const meta = getBrandMeta(p);

                // botão para variantes
                const common = {
                  key: p.name,
                  asChild: true,
                  "aria-label": `Abrir ${meta.label}`,
                  rel: "noopener noreferrer nofollow sponsored",
                } as const;

                return meta.variant === "solid" ? (
                  <Button
                    {...common}
                    className={`text-sm py-2 px-4 rounded-xl shadow-md ${p.priority ? "ring-1 ring-white/10" : ""} hover:opacity-90`}
                    style={{ backgroundColor: meta.bg, color: meta.fg }}
                  >
                    <a href={p.url} target="_blank">
                      <meta.Icon className="w-4 h-4 mr-2" />
                      {meta.label}
                      <ExternalLink className="w-3 h-3 ml-2 opacity-80" />
                    </a>
                  </Button>
                ) : (
                  // INVERTED: fundo claro + texto escuro + borda
                  <Button
                    {...common}
                    variant="outline"
                    className={`text-sm py-2 px-4 rounded-xl shadow-md ${p.priority ? "ring-1 ring-white/10" : ""} hover:opacity-90`}
                    style={{
                      backgroundColor: meta.bg,
                      color: meta.fg,
                      borderColor: meta.border || "rgba(255,255,255,0.15)",
                    }}
                  >
                    <a href={p.url} target="_blank" className="flex items-center">
                      <meta.Icon className="w-4 h-4 mr-2" />
                      {meta.label}
                      <ExternalLink className="w-3 h-3 ml-2 opacity-60" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

{/* Mobile - Bottom Dock (ajustado) */}
<div
  className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-white/20"
  style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.25rem)" }}
>
  {/* safe area iOS */}
  <div className="grid grid-cols-3 gap-1 p-2">
    {PLATFORMS.map((p) => {
      const meta = getBrandMeta(p);

      // Cor base da marca:
      const brand = meta.variant === "inverted" ? (meta.border || meta.fg) : meta.bg;

      // Fundo translúcido (pílula) para mobile
      const bg = meta.variant === "inverted" ? meta.bg : withAlpha(brand, 0.16);
      const hoverBg = meta.variant === "inverted" ? (meta.hover || "#E5E7EB") : withAlpha(brand, 0.26);
      const border = meta.variant === "inverted" ? (meta.border || withAlpha(brand, 0.6)) : withAlpha(brand, 0.7);
      const textColor = meta.variant === "inverted" ? meta.fg : brand;

      return (
        <Button
          key={p.name}
          asChild
          variant="outline"
          className="flex flex-col items-center p-3 h-auto space-y-1 rounded-2xl transition-colors overflow-hidden min-w-0"
          style={{ backgroundColor: bg, borderColor: border, color: textColor }}
        >
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            onMouseEnter={(e) => ((e.currentTarget.parentElement as HTMLButtonElement).style.backgroundColor = hoverBg)}
            onMouseLeave={(e) => ((e.currentTarget.parentElement as HTMLButtonElement).style.backgroundColor = bg)}
            aria-label={`Abrir ${meta.label}`}
            className="flex flex-col items-center"
          >
            <meta.Icon className="w-5 h-5 mx-auto" style={{ color: textColor }} />
            <span className="text-[11px] font-medium whitespace-nowrap" style={{ color: textColor }}>
              {p.shortLabel || meta.short}
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
