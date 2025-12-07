// src/types/content.ts
export type SiteSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  telegramUrl: string;
  telegramCta: string;
  contactEmail?: string;
  contactInstagram?: string;
  contactTelegram?: string;
};

export type Preview = {
  id: string;      // id do doc
  title: string;
  duration: number;
  tags: string[];
  poster?: string;  // caminho da thumb (ex: "/thumbs/1.jpeg" ou URL completa)
  videoUrl: string;
  isSensitive?: boolean;
  order: number;
};

export type SocialLink = {
  id: string;
  name: string;
  url: string;
  description: string;
  iconKey: string;
  color: string;
  iconColor: string;
  order: number;
  showOnHome?: boolean;
  showOnHero?: boolean;
  isPrivate?: boolean;
  ctaLabel?: string;
  showOnNavbar?: boolean;
};
