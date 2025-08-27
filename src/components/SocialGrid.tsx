import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/suelen.villanchisky?igsh=ZGNtNzUyaW4xNGox",
    icon: Instagram,
    description: "Fotos e stories diários",
  },
  {
    name: "Telegram (Grátis)",
    url: "https://t.me/SEU_CANAL_TELEGRAM?start=site",
    icon: FaTelegramPlane,
    description: "Grupo gratuito com novidades e prévias",
  },
];

export function SocialGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      {SOCIAL_LINKS.map((social) => {
        const isTelegram = social.name.toLowerCase().includes("telegram");
        const bubbleClass = isTelegram
          ? "bg-[#229ED9]/20"
          : "bg-gradient-to-br from-pink-500/20 to-purple-500/20";
        const iconClass = isTelegram ? "text-[#229ED9]" : "text-pink-500";

        return (
          <Button
            key={social.name}
            asChild
            variant="outline"
            className="w-full overflow-hidden relative p-0 rounded-2xl border-white/20 hover:border-primary/80"
          >
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir ${social.name}`}
              className="w-full"
            >
              <div className="flex items-center gap-4 p-6 w-full">
                <div className={`p-3 rounded-full shrink-0 ${bubbleClass}`}>
                  <social.icon className={`w-6 h-6 ${iconClass}`} />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-foreground truncate">{social.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{social.description}</p>
                </div>

                <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
              </div>
            </a>
          </Button>
        );
      })}
    </div>
  );
}
