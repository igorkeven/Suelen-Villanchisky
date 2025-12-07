// src/services/contentService.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SiteSettings, Preview, SocialLink } from "@/types/content";

/** SETTINGS */

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const ref = doc(db, "settings", "main");
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as SiteSettings) : null;
}

export async function saveSiteSettings(data: SiteSettings) {
  const ref = doc(db, "settings", "main");
  await setDoc(ref, data, { merge: true });
}

/** PREVIEWS */

export async function fetchPreviews(): Promise<Preview[]> {
  const ref = collection(db, "previews");
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Preview, "id">),
  }));
}

export async function savePreview(preview: Preview) {
  const ref = doc(db, "previews", preview.id);
  const { id, ...data } = preview;
  await setDoc(ref, data, { merge: true });
}

/** SOCIAL LINKS */

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  const ref = collection(db, "socialLinks");
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<SocialLink, "id">),
  }));
}

export async function saveSocialLink(link: SocialLink) {
  const ref = doc(db, "socialLinks", link.id);
  const { id, ...data } = link;
  await setDoc(ref, data, { merge: true });
}
