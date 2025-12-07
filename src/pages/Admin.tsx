// src/pages/Admin.tsx
import { useEffect, useState } from "react";
import { db, storage, auth } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  FaTelegramPlane,
  FaInstagram,
  FaTwitter,
  FaLock,
  FaStar,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa";

/* =======================
   Tipos
   ======================= */

type SiteSettings = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBadge?: string;
  heroCtaLabel?: string;
  heroBackgroundUrl?: string;
  contactEmail?: string;
};

type Preview = {
  id: string;
  title: string;
  duration: number;
  tags: string[];
  poster?: string;
  videoUrl: string;
  isSensitive?: boolean;
  order?: number;
};

type SocialLink = {
  id: string;
  name: string;
  url: string;
  description: string;
  iconKey: string; // "telegram", "privacy", "topfans"...
  color: string;
  iconColor: string;
  order: number;
  showOnHome?: boolean;
  isPrivate?: boolean;
  showOnHero?: boolean;
  ctaLabel?: string;
  showOnNavbar?: boolean;
};

type GalleryImage = {
  id: string;
  url: string;
  alt?: string;
  order?: number;
  showOnHome?: boolean;
};

/* =======================
   Helpers ícone + cores
   ======================= */

function getIconByKey(key: string) {
  const k = (key || "").toLowerCase();

  if (k === "instagram" || k === "insta") return FaInstagram;
  if (k === "telegram" || k === "tg") return FaTelegramPlane;
  if (k === "whatsapp" || k === "wa") return FaWhatsapp;
  if (k === "x" || k === "twitter") return FaTwitter;
  if (k === "privacy" || k === "priv") return FaLock;
  if (k === "topfans" || k === "fans") return FaStar;
  if (k === "onlyfans") return FaStar; // placeholder
  if (k === "linktree" || k === "tree") return FaLink;

  return FaTelegramPlane;
}

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

  return {
    color: "bg-primary",
    iconColor: "text-white",
  };
}

// opções para o select de rede (pode colocar emojis se quiser)
const SOCIAL_PRESETS = [
  { value: "telegram", label: "Telegram" },
  { value: "instagram", label: "Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "x", label: "X (Twitter)" },
  { value: "privacy", label: "Privacy" },
  { value: "topfans", label: "TopFans" },
  { value: "onlyfans", label: "OnlyFans" },
  { value: "linktree", label: "Linktree" },
];

const MAX_NAVBAR_LINKS = 3;
const MAX_HERO_LINKS = 1;

/* =======================
   Upload helper
   ======================= */

async function uploadFile(
  file: File,
  path: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const percent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(percent));
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/* =======================
   Componente Admin
   ======================= */

const Admin = () => {
  const [tab, setTab] = useState("settings");

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  const [dataLoading, setDataLoading] = useState(true);

  const [uploadingVideoId, setUploadingVideoId] = useState<string | null>(
    null
  );
  const [videoProgress, setVideoProgress] = useState(0);

  const [uploadingHero, setUploadingHero] = useState(false);
  const [heroUploadProgress, setHeroUploadProgress] = useState(0);
  const [uploadingGalleryId, setUploadingGalleryId] = useState<string | null>(
    null
  );
  const [galleryUploadProgress, setGalleryUploadProgress] = useState(0);
  const [pendingGalleryFiles, setPendingGalleryFiles] = useState<
    Record<string, File | null>
  >({});
  const [pendingGalleryPreviews, setPendingGalleryPreviews] = useState<
    Record<string, string>
  >({});
  const [editingGalleryIds, setEditingGalleryIds] = useState<string[]>([]);
  const [pendingPreviewFiles, setPendingPreviewFiles] = useState<
    Record<string, File | null>
  >({});
  const [editingPreviewIds, setEditingPreviewIds] = useState<string[]>([]);

  const clearPendingGallery = (id: string) => {
    setPendingGalleryFiles((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setPendingGalleryPreviews((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // ====== Auth state ======
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // ouvir login/logout
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  // ================= CARREGAR DADOS (apenas após login) =================
  useEffect(() => {
    if (!user) return; // só carrega se estiver logado

    async function load() {
      try {
        setDataLoading(true);

        // settings/main
        const sSnap = await getDoc(doc(db, "settings", "main"));
        if (sSnap.exists()) {
          setSettings(sSnap.data() as SiteSettings);
        }

        // previews
        const pSnap = await getDocs(collection(db, "previews"));
        const pList: Preview[] = pSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        pList.sort((a, b) => {
          const ao = a.order ?? (Number(a.id) || 0);
          const bo = b.order ?? (Number(b.id) || 0);
          return ao - bo;
        });
        setPreviews(pList);

        // socials
        const sSocial = await getDocs(collection(db, "socialLinks"));
        const sList: SocialLink[] = sSocial.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        sList.sort((a, b) => a.order - b.order);
        setSocials(sList);

        // gallery
        const gSnap = await getDocs(collection(db, "gallery"));
        const gList: GalleryImage[] = gSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        gList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setGallery(gList);
      } catch (err) {
        console.error("Erro ao carregar admin:", err);
        alert("Erro ao carregar dados do painel. Veja o console.");
      } finally {
        setDataLoading(false);
      }
    }

    load();
  }, [user]);

  /* =======================
     Login / Logout
     ======================= */

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError(null);

    try {
      await signInWithEmailAndPassword(
        auth,
        loginEmail.trim(),
        loginPassword
      );
      // onAuthStateChanged vai atualizar o user
    } catch (err) {
      console.error("Erro ao entrar:", err);
      setLoginError("E-mail ou senha inválidos.");
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }

  /* =======================
     SALVAR SETTINGS
     ======================= */

  async function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: SiteSettings = {
      heroTitle: String(formData.get("heroTitle") || ""),
      heroSubtitle: String(formData.get("heroSubtitle") || ""),
      heroBadge: String(formData.get("heroBadge") || ""),
      contactEmail: String(formData.get("contactEmail") || ""),
    };

    try {
      await setDoc(doc(db, "settings", "main"), data, { merge: true });
      setSettings((prev) => ({ ...(prev || {}), ...data }));
      alert("Configurações salvas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar configurações.");
    }
  }

  /* =======================
     UPLOAD HERO IMAGE
     ======================= */

  async function handleHeroImageUpload(file: File) {
    try {
      setUploadingHero(true);
      setHeroUploadProgress(0);

      const path = `hero/cover-${file.name}`;
      const url = await uploadFile(file, path, (p) =>
        setHeroUploadProgress(p)
      );

      const newSettings: SiteSettings = {
        ...(settings || {}),
        heroBackgroundUrl: url,
      };

      await setDoc(doc(db, "settings", "main"), newSettings, {
        merge: true,
      });
      setSettings(newSettings);
      alert("Imagem de capa atualizada!");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar imagem de capa.");
    } finally {
      setUploadingHero(false);
      setHeroUploadProgress(0);
    }
  }

  /* =======================
     PREVIEWS
     ======================= */

  async function handleSavePreview(p: Preview) {
    try {
      const { id, ...rest } = p;
      await setDoc(
        doc(db, "previews", id),
        {
          ...rest,
          order: rest.order ?? (Number(id) || 0),
        },
        { merge: true }
      );
      setEditingPreviewIds((prev) => prev.filter((x) => x !== p.id));
      alert(`Preview #${id} salvo!`);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar preview.");
    }
  }

  async function handleDeletePreview(p: Preview) {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o preview #${p.id}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "previews", p.id));
      setPreviews((prev) => prev.filter((x) => x.id !== p.id));
      setPendingPreviewFiles((prev) => {
        const copy = { ...prev };
        delete copy[p.id];
        return copy;
      });
      setEditingPreviewIds((prev) => prev.filter((x) => x !== p.id));
    } catch (err) {
      console.error("Erro ao excluir preview:", err);
      alert("Não foi possível excluir o preview. Tente novamente.");
    }
  }

  async function handleCreatePreview() {
    try {
      const maxId =
        previews.length > 0
          ? Math.max(...previews.map((p) => Number(p.id) || 0))
          : 0;

      const newId = String(maxId + 1);

      const base: Preview = {
        id: newId,
        title: "",
        duration: 0,
        tags: [],
        poster: "",
        videoUrl: "",
        isSensitive: true,
        order: previews.length,
      };

      await setDoc(doc(db, "previews", newId), base);

      setPreviews((prev) => [...prev, base]);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar novo preview.");
    }
  }

  async function handleVideoUpload(preview: Preview, file: File) {
    try {
      if (file.size > 50 * 1024 * 1024) {
        alert("Vídeo muito grande. Limite: 50 MB para previews.");
        return;
      }

      setUploadingVideoId(preview.id);
      setVideoProgress(0);

      const path = `previews/${preview.id}/video-${file.name}`;
      const url = await uploadFile(file, path, (p) =>
        setVideoProgress(p)
      );

      const updated: Preview = { ...preview, videoUrl: url };
      await handleSavePreview(updated);

      setPreviews((prev) =>
        prev.map((x) => (x.id === preview.id ? updated : x))
      );
      setPendingPreviewFiles((prev) => {
        const copy = { ...prev };
        delete copy[preview.id];
        return copy;
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar vídeo.");
    } finally {
      setUploadingVideoId(null);
      setVideoProgress(0);
    }
  }

  /* =======================
     GALERIA
     ======================= */

  async function handleSaveGalleryImage(img: GalleryImage) {
    try {
      const { id, ...rest } = img;
      await setDoc(doc(db, "gallery", id), rest, { merge: true });
      alert("Imagem da galeria salva!");
      setGallery((prev) =>
        prev.map((g) => (g.id === img.id ? img : g))
      );
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar imagem da galeria.");
    }
  }

  async function handleDeleteGalleryImage(img: GalleryImage) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta imagem da galeria?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "gallery", img.id));
      setGallery((prev) => prev.filter((g) => g.id !== img.id));
      clearPendingGallery(img.id);
      setEditingGalleryIds((prev) => prev.filter((id) => id !== img.id));
    } catch (err) {
      console.error("Erro ao excluir imagem da galeria:", err);
      alert("Não foi possível excluir a imagem. Tente novamente.");
    }
  }

  async function handleCreateGallerySlot() {
    try {
      if (gallery.length >= 10) {
        alert("Limite de 10 imagens na galeria atingido.");
        return;
      }

      const docRef = await addDoc(collection(db, "gallery"), {
        url: "",
        alt: "",
        order: gallery.length,
        showOnHome: true,
      });

      const newImage: GalleryImage = {
        id: docRef.id,
        url: "",
        alt: "",
        order: gallery.length,
        showOnHome: true,
      };

      setGallery((prev) => [...prev, newImage]);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar slot de galeria.");
    }
  }

  async function handleGalleryUpload(img: GalleryImage, file: File) {
    try {
      if (file.size > 10 * 1024 * 1024) {
        alert("Imagem muito grande. Limite: 10 MB.");
        return;
      }

      setUploadingGalleryId(img.id);
      setGalleryUploadProgress(0);

      const path = `gallery/${img.id}/image-${file.name}`;
      const url = await uploadFile(file, path, (p) =>
        setGalleryUploadProgress(p)
      );

      const updated: GalleryImage = { ...img, url };
      await handleSaveGalleryImage(updated);

      setGallery((prev) =>
        prev.map((g) => (g.id === img.id ? updated : g))
      );
      clearPendingGallery(img.id);
    } catch (err) {
      console.error("Erro ao enviar imagem da galeria:", err);
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "";
      alert(
        `Erro ao enviar imagem da galeria.${msg ? ` Detalhe: ${msg}` : ""}`
      );
    } finally {
      setUploadingGalleryId(null);
      setGalleryUploadProgress(0);
    }
  }

  /* =======================
     REDES SOCIAIS
     ======================= */

  async function handleSaveSocial(s: SocialLink) {
    try {
      const { id, ...rest } = s;
      await setDoc(doc(db, "socialLinks", id), rest, { merge: true });
      alert(`Link ${id} salvo!`);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar link social.");
    }
  }

  async function handleSelectHeroSocial(newId: string) {
    setSocials((prev) =>
      prev.map((item) => ({
        ...item,
        showOnHero: item.id === newId,
      }))
    );

    const current = socials.find((s) => s.id === newId);
    const prevHero = socials.find(
      (s) => s.showOnHero && s.id !== newId
    );

    try {
      const ops: Promise<void>[] = [];

      if (prevHero) {
        const { id, ...rest } = { ...prevHero, showOnHero: false };
        ops.push(setDoc(doc(db, "socialLinks", id), rest, { merge: true }));
      }

      if (current) {
        const { id, ...rest } = { ...current, showOnHero: true };
        ops.push(setDoc(doc(db, "socialLinks", id), rest, { merge: true }));
      }

      await Promise.all(ops);
    } catch (err) {
      console.error("Erro ao atualizar rede principal:", err);
      alert(
        "Não foi possível atualizar a rede principal da hero. Tente novamente."
      );
    }
  }

  async function handleCreateSocialLink() {
    try {
      const base = {
        name: "",
        url: "",
        description: "",
        iconKey: "telegram",
        color: "bg-[#229ED9]",
        iconColor: "text-white",
        order: socials.length,
        showOnHome: true,
        showOnNavbar: true,
        isPrivate: false,
        showOnHero: false,
        ctaLabel: "",
      };

      const docRef = await addDoc(collection(db, "socialLinks"), base);

      setSocials((prev) => [{ ...base, id: docRef.id }, ...prev]);

      if (typeof document !== "undefined") {
        setTimeout(() => {
          document
            .getElementById(`social-${docRef.id}`)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar nova rede social.");
    }
  }

  /* =======================
     RENDER
     ======================= */

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-10">
        <p>Verificando sessão...</p>
      </div>
    );
  }

  // Se não estiver logado, mostra tela de login simples
  if (!user) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-10 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Acesso do Administrador</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && (
                <p className="text-sm text-red-500">{loginError}</p>
              )}
              <Button type="submit" className="w-full mt-2">
                Entrar
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              Dica: crie o usuário admin no Firebase Authentication (método
              e-mail/senha) e use aqui o mesmo e-mail e senha.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logado, mas carregando dados
  if (dataLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            Painel da Suelen (Admin)
          </h1>
          <div className="flex items-center gap-3 text-sm">
            <span>{user.email}</span>
            <Button size="sm" variant="secondary" asChild>
              <a href="/" target="_blank" rel="noreferrer">
                Ver site
              </a>
            </Button>
            <Button size="sm" variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
        <p>Carregando painel...</p>
      </div>
    );
  }

  // Logado e dados carregados
  return (
    <div className="container mx-auto px-4 pt-24 pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Painel da Suelen (Admin)</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{user.email}</span>
          <Button size="sm" variant="secondary" asChild>
            <a href="/" target="_blank" rel="noreferrer">
              Ver site
            </a>
          </Button>
          <Button size="sm" variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="previews">Previews</TabsTrigger>
          <TabsTrigger value="gallery">Galeria</TabsTrigger>
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
        </TabsList>

        {/* ============ CONFIGURAÇÕES ============ */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero, Capa & Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heroTitle">Título principal</Label>
                    <Input
                      id="heroTitle"
                      name="heroTitle"
                      defaultValue={settings?.heroTitle}
                    />
                  </div>

                  <div>
                    <Label htmlFor="heroBadge">Texto do selo</Label>
                    <Input
                      id="heroBadge"
                      name="heroBadge"
                      defaultValue={settings?.heroBadge}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="heroSubtitle">Subtítulo</Label>
                  <Textarea
                    id="heroSubtitle"
                    name="heroSubtitle"
                    defaultValue={settings?.heroSubtitle}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Imagem de capa (background)</Label>
                    {settings?.heroBackgroundUrl && (
                      <div className="mb-2">
                        <img
                          src={settings.heroBackgroundUrl}
                          alt="Capa atual"
                          className="w-full max-w-sm rounded-md border"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        await handleHeroImageUpload(file);
                        e.target.value = "";
                      }}
                    />
                    {uploadingHero && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Enviando capa... {heroUploadProgress}%
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Contato</Label>
                    <div className="grid gap-2">
                      <div>
                        <Label htmlFor="contactEmail">E-mail</Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          defaultValue={settings?.contactEmail}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="mt-4">
                  Salvar
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ PREVIEWS ============ */}
        <TabsContent value="previews" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Dica: use vídeos curtos (ex: até 30 segundos) para economizar
              storage. Limite de 50MB por arquivo aqui.
            </p>
            <Button size="sm" onClick={handleCreatePreview}>
              Adicionar preview
            </Button>
          </div>

          {previews.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum preview encontrado na coleção <code>previews</code>.
              Clique em &quot;Adicionar preview&quot; para criar o primeiro.
            </p>
          )}

          {([...previews].sort((a, b) => {
            const aEmpty = !a.videoUrl;
            const bEmpty = !b.videoUrl;
            if (aEmpty !== bEmpty) return aEmpty ? -1 : 1;
            return (a.order ?? 0) - (b.order ?? 0);
          })).map((prev) => {
            const p = prev;
            const pendingVideo = pendingPreviewFiles[p.id];
            const updatePreview = (partial: Partial<Preview>) =>
              setPreviews((old) =>
                old.map((item) =>
                  item.id === p.id ? { ...item, ...partial } : item
                )
              );

            const canSavePreview =
              (p.title || "").trim().length > 0 &&
              ((p.videoUrl || "").trim().length > 0 || !!pendingVideo);
            const isEditing =
              editingPreviewIds.includes(p.id) ||
              !p.videoUrl ||
              !!pendingVideo;

            return (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle>Preview #{p.id}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {p.videoUrl && !isEditing && (
                    <video
                      src={p.videoUrl}
                      controls
                      className="w-full max-h-56 rounded-lg border border-white/10 bg-black object-contain"
                    />
                  )}

                  {!isEditing ? (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Título: {p.title || "—"}</p>
                        <p>Ordem: {p.order ?? (Number(p.id) || 0)}</p>
                        <p>Sensível (18+): {p.isSensitive === false ? "Não" : "Sim"}</p>
                        <p>
                          Vídeo: {p.videoUrl ? (
                            <a
                              href={p.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline"
                            >
                              abrir
                            </a>
                          ) : (
                            "—"
                          )}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            setEditingPreviewIds((prev) => [...prev, p.id])
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePreview(p)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={p.title ?? ""}
                          onChange={(e) =>
                            updatePreview({ title: e.target.value })
                          }
                          placeholder="Título do preview"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Vídeo (URL atual)</Label>
                        <Input
                          value={p.videoUrl ?? ""}
                          onChange={(e) =>
                            updatePreview({ videoUrl: e.target.value })
                          }
                          placeholder="https://..."
                        />

                        <Label className="mt-2">
                          Enviar novo vídeo (pode demorar)
                        </Label>
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setPendingPreviewFiles((prevMap) => ({
                              ...prevMap,
                              [p.id]: file,
                            }));
                            e.target.value = "";
                          }}
                        />

                        {pendingVideo && (
                          <p className="text-xs text-muted-foreground">
                            Pronto para enviar: {pendingVideo.name}
                          </p>
                        )}

                        {uploadingVideoId === p.id && (
                          <p className="text-xs text-muted-foreground">
                            Enviando vídeo... {videoProgress}%
                          </p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-3">
                        <div>
                          <Label>Ordem</Label>
                          <Input
                            type="number"
                            value={p.order ?? (Number(p.id) || 0)}
                            onChange={(e) =>
                              updatePreview({ order: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                          <Label>É sensível (18+)?</Label>
                          <input
                            type="checkbox"
                            checked={p.isSensitive ?? true}
                            onChange={(e) =>
                              updatePreview({ isSensitive: e.target.checked })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          className="mt-2"
                          disabled={!canSavePreview}
                          onClick={async () => {
                            if (pendingVideo) {
                              await handleVideoUpload(p, pendingVideo);
                            } else {
                              await handleSavePreview(p);
                            }
                          }}
                        >
                          {canSavePreview ? "Salvar preview" : "Preencha título e vídeo"}
                        </Button>
                        {p.videoUrl && (
                          <Button
                            className="mt-2"
                            variant="outline"
                            onClick={() => {
                              setPendingPreviewFiles((prevMap) => {
                                const copy = { ...prevMap };
                                delete copy[p.id];
                                return copy;
                              });
                              setEditingPreviewIds((prev) =>
                                prev.filter((id) => id !== p.id)
                              );
                            }}
                          >
                            Cancelar
                          </Button>
                        )}
                        <Button
                          className="mt-2"
                          variant="destructive"
                          onClick={() => handleDeletePreview(p)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* ============ GALERIA ============ */}
        <TabsContent value="gallery" className="mt-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              Imagens que aparecem na seção de galeria da home. Limite
              recomendado: até 10 imagens.
            </p>
            <Button size="sm" onClick={handleCreateGallerySlot}>
              Adicionar imagem
            </Button>
          </div>

          {gallery.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma imagem de galeria ainda.
            </p>
          )}

          {([...gallery].sort((a, b) => {
            const aEmpty = !a.url;
            const bEmpty = !b.url;
            if (aEmpty !== bEmpty) return aEmpty ? -1 : 1;
            return (a.order ?? 0) - (b.order ?? 0);
          })).map((img) => {
            const g = { ...img };
            const pendingFile = pendingGalleryFiles[g.id];
            const pendingPreview = pendingGalleryPreviews[g.id];
            const displayUrl = pendingPreview || g.url;
            const isUploading = uploadingGalleryId === g.id;
            const isEditing =
              editingGalleryIds.includes(g.id) || !g.url || !!pendingFile;
            const canSave = !!(displayUrl || pendingFile) && !isUploading;

            return (
              <Card key={g.id}>
                <CardHeader>
                  <CardTitle>Imagem {g.id}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {displayUrl && (
                    <img
                      src={displayUrl}
                      alt={g.alt || "Imagem da galeria"}
                      className="w-full max-w-xs rounded-md border mb-2"
                    />
                  )}

                  {!isEditing ? (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <p>Alt: {g.alt || "—"}</p>
                        <p>Ordem: {g.order ?? 0}</p>
                        <p>Mostrar na home: {g.showOnHome === false ? "Não" : "Sim"}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            setEditingGalleryIds((prev) => [...prev, g.id])
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteGalleryImage(g)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <Label>Texto alternativo (alt)</Label>
                          <Input
                            defaultValue={g.alt}
                            onChange={(e) => (g.alt = e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Ordem</Label>
                          <Input
                            type="number"
                            defaultValue={g.order ?? 0}
                            onChange={(e) =>
                              (g.order = Number(e.target.value))
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={g.showOnHome ?? true}
                          onChange={(e) =>
                            (g.showOnHome = e.target.checked)
                          }
                        />
                        <Label>Mostrar na home</Label>
                      </div>

                      <div>
                        <Label>Enviar/alterar imagem</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setPendingGalleryFiles((prev) => ({
                              ...prev,
                              [g.id]: file,
                            }));
                            setPendingGalleryPreviews((prev) => ({
                              ...prev,
                              [g.id]: URL.createObjectURL(file),
                            }));
                            e.target.value = "";
                          }}
                        />
                        {isUploading && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Enviando imagem... {galleryUploadProgress}%
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          className="mt-2"
                          disabled={!canSave}
                          title={
                            canSave
                              ? "Salvar imagem"
                              : "Envie uma imagem antes de salvar"
                          }
                          onClick={async () => {
                            if (pendingFile) {
                              await handleGalleryUpload(g, pendingFile);
                            } else {
                              await handleSaveGalleryImage(g);
                            }
                            setEditingGalleryIds((prev) =>
                              prev.filter((id) => id !== g.id)
                            );
                          }}
                        >
                          {pendingFile ? "Enviar e salvar" : "Salvar imagem"}
                        </Button>

                        {g.url && (
                          <Button
                            className="mt-2"
                            variant="outline"
                            onClick={() => {
                              clearPendingGallery(g.id);
                              setEditingGalleryIds((prev) =>
                                prev.filter((id) => id !== g.id)
                              );
                            }}
                          >
                            Cancelar
                          </Button>
                        )}

                        <Button
                          className="mt-2"
                          variant="destructive"
                          onClick={() => handleDeleteGalleryImage(g)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* ============ SOCIAL ============ */}
        <TabsContent value="social" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Aqui você gerencia as redes (públicas e privadas). A rede
              marcada como &quot;Principal na hero&quot; pode ser
              escolhida nas configurações da capa.
            </p>
            <Button size="sm" onClick={handleCreateSocialLink}>
              Adicionar rede
            </Button>
          </div>

          {socials.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum link social na coleção <code>socialLinks</code>.
              Clique em &quot;Adicionar rede&quot; para criar a primeira.
            </p>
          )}

          {socials.map((soc) => {
            const { color, iconColor } = getColorsByKey(soc.iconKey || "");
            const IconPreview = getIconByKey(soc.iconKey || "");

            return (
              <Card key={soc.id} id={`social-${soc.id}`}>
                <CardHeader>
                  <CardTitle>{soc.name || `Social ${soc.id}`}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={soc.name}
                      onChange={(e) =>
                        setSocials((prev) =>
                          prev.map((item) =>
                            item.id === soc.id
                              ? { ...item, name: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>URL</Label>
                    <Input
                      value={soc.url}
                      onChange={(e) =>
                        setSocials((prev) =>
                          prev.map((item) =>
                            item.id === soc.id
                              ? { ...item, url: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Input
                      value={soc.description}
                      onChange={(e) =>
                        setSocials((prev) =>
                          prev.map((item) =>
                            item.id === soc.id
                              ? { ...item, description: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </div>

                  {/* Seleção da rede + cores automáticas */}
                  <div className="grid md:grid-cols-3 gap-3 mt-2">
                    <div>
                      <Label>Rede</Label>
                      <select
                        value={soc.iconKey || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const colors = getColorsByKey(val);
                          setSocials((prev) =>
                            prev.map((item) =>
                              item.id === soc.id
                                ? {
                                    ...item,
                                    iconKey: val,
                                    color: colors.color,
                                    iconColor: colors.iconColor,
                                  }
                                : item
                            )
                          );
                        }}
                        className="border rounded-md w-full px-3 py-2 bg-background"
                      >
                        <option value="">Selecione...</option>
                        {SOCIAL_PRESETS.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ao escolher, ícone e cores são definidos automaticamente.
                      </p>
                    </div>
  {/* Pré-visualização do botão como aparece na Home */}
                  <div className="mt-3">
                    <Label>Pré-visualização</Label>
                    <div className="mt-1 inline-flex items-center gap-3 px-4 py-2 rounded-2xl border border-white/20 bg-card">
                      <div className={`p-3 rounded-full ${color}`}>
                        <IconPreview className={`w-5 h-5 ${iconColor}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {soc.name || "Nome da rede"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[220px]">
                          {soc.description || "Descrição / chamada da rede"}
                        </span>
                      </div>
                    </div>
                  </div>
                    
                  </div>

                

                  {/* Ordem, flags, texto hero */}
                  <div className="grid md:grid-cols-3 gap-3 mt-4">
                    <div>
                      <Label>Ordem</Label>
                      <Input
                        type="number"
                        value={soc.order ?? 0}
                        onChange={(e) =>
                          setSocials((prev) =>
                            prev.map((item) =>
                              item.id === soc.id
                                ? {
                                    ...item,
                                    order: Number(e.target.value),
                                  }
                                : item
                            )
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-7">
                      <input
                        type="checkbox"
                        checked={soc.showOnHome ?? true}
                        onChange={(e) =>
                          setSocials((prev) =>
                            prev.map((item) =>
                              item.id === soc.id
                                ? { ...item, showOnHome: e.target.checked }
                                : item
                            )
                          )
                        }
                      />
                      <Label>Mostrar na home</Label>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-7">
                      <input
                        type="checkbox"
                        checked={soc.isPrivate ?? false}
                        onChange={(e) =>
                          setSocials((prev) =>
                            prev.map((item) =>
                              item.id === soc.id
                                ? { ...item, isPrivate: e.target.checked }
                                : item
                            )
                          )
                        }
                      />
                      <Label>Rede privada</Label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={soc.showOnNavbar ?? true}
                      onChange={(e) => {
                        const next = e.target.checked;
                        setSocials((prev) => {
                          const nextCount = prev.reduce((acc, item) => {
                            const willShow =
                              item.id === soc.id
                                ? next
                                : item.showOnNavbar !== false;
                            return acc + (willShow ? 1 : 0);
                          }, 0);

                          if (next && nextCount > MAX_NAVBAR_LINKS) {
                            alert(
                              `Máximo de ${MAX_NAVBAR_LINKS} redes no navbar. Desmarque outra antes de adicionar.`
                            );
                            return prev;
                          }

                          return prev.map((item) =>
                            item.id === soc.id
                              ? { ...item, showOnNavbar: next }
                              : item
                          );
                        });
                      }}
                    />
                    <Label>
                      Mostrar no navbar (topo/rodapé) — máx. {MAX_NAVBAR_LINKS}
                    </Label>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={soc.showOnHero ?? false}
                      onChange={async (e) => {
                        const next = e.target.checked;
                        if (!next) {
                          setSocials((prev) =>
                            prev.map((item) =>
                              item.id === soc.id
                                ? { ...item, showOnHero: false }
                                : item
                            )
                          );
                          await handleSelectHeroSocial("");
                          return;
                        }

                        const already = socials.find(
                          (item) => item.showOnHero && item.id !== soc.id
                        );
                        if (already) {
                          alert(
                            `Apenas ${MAX_HERO_LINKS} botão principal da hero. Substituindo: ${
                              already.name || already.id
                            }.`
                          );
                        }

                        await handleSelectHeroSocial(soc.id);
                      }}
                    />
                    <Label>Principal na hero</Label>
                  </div>

                  <div className="mt-2">
                    <Label>Texto do botão da hero (opcional)</Label>
                    <Input
                      value={soc.ctaLabel ?? ""}
                      onChange={(e) =>
                        setSocials((prev) =>
                          prev.map((item) =>
                            item.id === soc.id
                              ? { ...item, ctaLabel: e.target.value }
                              : item
                          )
                        )
                      }
                      placeholder="Se vazio, usa o texto geral da hero"
                    />
                  </div>

                  <Button
                    className="mt-3"
                    onClick={() => handleSaveSocial(soc)}
                  >
                    Salvar link
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
