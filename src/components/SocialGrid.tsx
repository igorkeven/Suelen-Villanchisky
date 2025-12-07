// src/components/SocialGrid.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FaTelegramPlane,
  FaInstagram,
  FaTwitter,
  FaLock,
  FaStar,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";

type SocialLinkUI = {
  name: string;
  url: string;
  description: string;
  iconKey: string;
  color: string;
  iconColor: string;
  order?: number;
  showOnHome?: boolean;
};

// ÍCONE fixo por rede
function getIconByKey(key: string) {
  const k = (key || "").toLowerCase();

  if (k === "instagram" || k === "insta") return FaInstagram;
  if (k === "telegram" || k === "tg") return FaTelegramPlane;
  if (k === "whatsapp" || k === "wa") return FaWhatsapp;
  if (k === "x" || k === "twitter") return FaTwitter;
  if (k === "privacy" || k === "priv") return FaLock;
  if (k === "topfans" || k === "fans") return FaStar;
  if (k === "onlyfans") return FaStar; // placeholder estiloso
  if (k === "linktree" || k === "tree") return FaLink;

  // default
  return FaTelegramPlane;
}

// COR fixa por rede
function getColorsByKey(key: string) {
  const k = (key || "").toLowerCase();

  if (k === "instagram" || k === "insta") {
    return {
      color:
        "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
      iconColor: "text-white",
    };
  }

  if (k === "telegram" || k === "tg") {
    return {
      color: "bg-[#229ED9]",
      iconColor: "text-white",
    };
  }

  if (k === "whatsapp" || k === "wa") {
    return {
      color: "bg-[#25D366]",
      iconColor: "text-white",
    };
  }

  if (k === "x" || k === "twitter") {
    return {
      color: "bg-black",
      iconColor: "text-white",
    };
  }

  if (k === "onlyfans") {
    return {
      color: "bg-[#00AFF0]",
      iconColor: "text-white",
    };
  }

  if (k === "privacy" || k === "priv") {
    return {
      color: "bg-[#5E17EB]",
      iconColor: "text-white",
    };
  }

  if (k === "topfans" || k === "fans") {
    return {
      color: "bg-[#FF006E]",
      iconColor: "text-white",
    };
  }

  if (k === "linktree" || k === "tree") {
    return {
      color: "bg-[#39E09B]",
      iconColor: "text-black",
    };
  }

  // fallback genérico
  return {
    color: "bg-primary",
    iconColor: "text-white",
  };
}

// fallback estático caso o Firestore não tenha nada
const STATIC_SOCIAL_LINKS: SocialLinkUI[] = [
  {
    name: "Instagram (Suelen)",
    url: "https://www.instagram.com/suelen.villanchisky?igsh=ZGNtNzUyaW4xNGox",
    iconKey: "instagram",
    description: "Fotos e stories diários",
    ...getColorsByKey("instagram"),
  },
  {
    name: "Instagram (Casal)",
    url: "https://www.instagram.com/casal.hot.047",
    iconKey: "instagram",
    description: "Momentos do casal",
    ...getColorsByKey("instagram"),
  },
  {
    name: "Telegram (Grátis)",
    url: "https://t.me/+jQIdptSosr02NzIx",
    iconKey: "telegram",
    description: "Grupo gratuito com novidades e prévias",
    ...getColorsByKey("telegram"),
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/Suh_memories?t=oNBkhWkN4QsTiDuob8mBJA&s=09",
    iconKey: "x",
    description: "Fotos e atualizações rápidas",
    ...getColorsByKey("x"),
  },
];

export function SocialGrid() {
  const [links, setLinks] = useState<SocialLinkUI[]>(STATIC_SOCIAL_LINKS);

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, "socialLinks"));
        const snap = await getDocs(q);

        const list: SocialLinkUI[] = snap.docs.map((d) => {
          const data = d.data() as any;
          const iconKey = (data.iconKey ?? "telegram") as string;
          const colors = getColorsByKey(iconKey);

          return {
            name: data.name,
            url: data.url,
            description: data.description,
            iconKey,
            color: colors.color,        // sempre cor fixa pela rede
            iconColor: colors.iconColor,
            order: data.order ?? 0,
            showOnHome: data.showOnHome,
          };
        });

        if (list.length) {
          // se tiver flag de visibilidade, respeita
          let filtered = list;
          if (list.some((l) => typeof l.showOnHome === "boolean")) {
            filtered = list.filter((l) => l.showOnHome !== false);
          }
          filtered.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setLinks(filtered);
        }
      } catch (err) {
        console.error("Erro ao carregar socialLinks:", err);
        // em erro, permanece com STATIC_SOCIAL_LINKS
      }
    }

    load();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      {links.map((social) => {
        const Icon = getIconByKey(social.iconKey);
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
                <div
                  className={`p-3 rounded-full shrink-0 ${social.color}`}
                >
                  <Icon className={`w-6 h-6 ${social.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-foreground truncate">
                    {social.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {social.description}
                  </p>
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
