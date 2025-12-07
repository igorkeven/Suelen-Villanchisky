// src/hooks/useSiteContent.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchPreviews,
  fetchSiteSettings,
  fetchSocialLinks,
} from "@/services/contentService";
import { STATIC_PREVIEWS } from "@/data/previews"; // fallback
import { defaultSocialLinks } from "@/data/socialLinks";


export function useSiteSettings() {
  return useQuery({
    queryKey: ["siteSettings"],
    queryFn: fetchSiteSettings,
  });
}

export function usePreviews() {
  return useQuery({
    queryKey: ["previews"],
    queryFn: fetchPreviews,
    // fallback pros estáticos se Firestore ainda não tiver nada
    select: (data) => (data.length ? data : STATIC_PREVIEWS),
  });
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["socialLinks"],
    queryFn: fetchSocialLinks,
    select: (data) => (data.length ? data : defaultSocialLinks),
  });
}
