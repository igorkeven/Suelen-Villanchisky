// src/pages/Index.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FaTelegramPlane,
  FaLock,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaStar,
  FaLink,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PreviewCard } from "@/components/PreviewCard";
import { SocialGrid } from "@/components/SocialGrid";
import { VideoModal } from "@/components/VideoModal";
import { useAdultConsent } from "@/hooks/useAdultConsent";
import { Link } from "react-router-dom";
import { Play, Star, Heart, Clock, Users, Crown } from "lucide-react";

import { STATIC_PREVIEWS, type StaticPreview } from "@/data/previews";
import { STATIC_PHOTOS } from "@/data/photos";
import heroImage from "@/assets/hero-image.jpeg";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";

type SiteSettings = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBadge?: string;
  heroPrimarySocialId?: string;
  heroBackgroundUrl?: string;
};

type HeroSocial = {
  id: string;
  name: string;
  url: string;
  iconKey?: string;
  ctaLabel?: string;
  color?: string;
  iconColor?: string;
};

// FAQ original
const FAQ_ITEMS = [
  {
    question: "Como funciona o acesso ao conteúdo premium?",
    answer:
      "Todo o conteúdo exclusivo está disponível nas plataformas parceiras. Clique nos botões de acesso para ser redirecionado e escolher seu plano preferido.",
  },
  {
    question: "Com que frequência há atualizações?",
    answer:
      "Publico conteúdo novo regularmente, incluindo fotos em alta resolução, vídeos exclusivos e bastidores. Siga nas redes sociais para não perder nenhuma novidade.",
  },
  {
    question: "O conteúdo é seguro e privado?",
    answer:
      "Sim, todas as plataformas parceiras possuem sistemas de segurança avançados e políticas rígidas de privacidade. Seu acesso e informações estão protegidos.",
  },
  {
    question: "Como entro em contato comercial?",
    answer:
      "Para parcerias, colaborações ou questões comerciais, entre em contato através do email disponível na seção de redes sociais.",
  },
];

const Index = () => {
  const { consented } = useAdultConsent();

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [heroSocial, setHeroSocial] = useState<HeroSocial | null>(null);

  const [previews, setPreviews] = useState<StaticPreview[]>(STATIC_PREVIEWS);
  const [gallery, setGallery] = useState<string[]>(STATIC_PHOTOS);

  const [selectedVideo, setSelectedVideo] = useState<StaticPreview | null>(
    null
  );

  useEffect(() => {
    async function load() {
      try {
        // settings
        const sSnap = await getDoc(doc(db, "settings", "main"));
        let s: SiteSettings | null = null;
        if (sSnap.exists()) {
          s = sSnap.data() as SiteSettings;
          setSettings(s);
        }

        // socials (para hero e futura navegação)
        const socialSnap = await getDocs(collection(db, "socialLinks"));
        const socialList = socialSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        socialList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        // prioriza quem está marcado como "Principal na hero", senão usa o selecionado nas settings
        const heroFromFlag = socialList.find((s) => s.showOnHero);
        const heroPrimaryId = s?.heroPrimarySocialId;
        const heroFromSettings = socialList.find(
          (s) => s.id === heroPrimaryId
        );

        let chosenHero =
          heroFromFlag || heroFromSettings || socialList[0] || null;

        // fallback extra: caso tenha id salvo nas settings mas não veio na lista (excluído/oculto)
        if (!chosenHero && heroPrimaryId) {
          const hSnap = await getDoc(doc(db, "socialLinks", heroPrimaryId));
          if (hSnap.exists()) {
            chosenHero = { id: hSnap.id, ...(hSnap.data() as any) };
          }
        }

        if (chosenHero) {
          setHeroSocial({
            id: chosenHero.id,
            name: chosenHero.name,
            url: chosenHero.url,
            iconKey: chosenHero.iconKey,
            ctaLabel: chosenHero.ctaLabel,
            color: chosenHero.color,
            iconColor: chosenHero.iconColor,
          });
        }

        // previews
        const pSnap = await getDocs(query(collection(db, "previews")));
        const pList = pSnap.docs.map(
          (d) => d.data() as StaticPreview
        );
        if (pList.length) {
          pList.sort((a, b) => a.id - b.id);
          setPreviews(pList);
        }

        // gallery
        const gSnap = await getDocs(collection(db, "gallery"));
        const gList = gSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        gList.sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        );
        const urls = gList
          .filter((g) => g.showOnHome !== false && g.url)
          .map((g) => g.url as string);
        if (urls.length) {
          setGallery(urls);
        }
      } catch (err) {
        console.error("Erro ao carregar conteúdo da home:", err);
        // fallback: já estamos com STATIC_PREVIEWS e STATIC_PHOTOS
      }
    }

    load();
  }, []);

  const HOMEPAGE_PREVIEWS = previews.slice(0, 4);

  const handlePlayVideo = (preview: StaticPreview) => {
    if (consented) setSelectedVideo(preview);
  };

  const heroCtaLabel =
    heroSocial?.ctaLabel?.trim() ||
    heroSocial?.name ||
    "Entrar no Telegram (Grátis)";

  const heroCtaUrl =
    heroSocial?.url ?? "https://t.me/+jQIdptSosr02NzIx";

  const heroIconKey = (heroSocial?.iconKey || "").toLowerCase() || "telegram";

  const heroIconColor = heroSocial?.iconColor || "text-white";
  const heroBgClass = heroSocial?.color || "bg-[#229ED9]";
  const heroTextClass = heroSocial?.iconColor || "text-white";

  const renderHeroIcon = () => {
    switch (heroIconKey) {
      case "privacy":
      case "priv":
        return <FaLock className={`w-5 h-5 mr-2 ${heroIconColor}`} />;
      case "instagram":
      case "insta":
        return <FaInstagram className={`w-5 h-5 mr-2 ${heroIconColor}`} />;
      case "telegram":
      case "tg":
        return <FaTelegramPlane className={`w-5 h-5 mr-2 ${heroIconColor}`} />;
      case "x":
      case "twitter":
        return <FaTwitter className={`w-5 h-5 mr-2 ${heroIconColor}`} />;
      case "whatsapp":
      case "wa":
        return <FaWhatsapp className={`w-5 h-5 mr-2 ${heroIconColor}`} />;
      case "topfans":
      case "fans":
      case "onlyfans":
        return <FaStar className={`w-5 h-5 mr-2 ${heroIconColor}`} />;
      case "linktree":
      case "tree":
        return <FaLink className={`w-5 h-5 mr-2 ${heroIconColor}`} />;
      default:
        return <FaTelegramPlane className={`w-5 h-5 mr-2 ${heroIconColor}`} />;
    }
  };

  return (
    <>
      {/* Ajuste para compensar a ribbon fixa em desktop */}
      <div className="lg:pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={settings?.heroBackgroundUrl || heroImage}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-lg px-6 py-2">
                <Crown className="w-5 h-5 mr-2" />
                {settings?.heroBadge ?? "Conteúdo Premium Adulto"}
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                {settings?.heroTitle ?? "Suelen Villanchisky"}
              </h1>

              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                {settings?.heroSubtitle ??
                  "Conteúdo adulto premium, exclusivo e de alta qualidade."}{" "}
                <br />
                <span className="text-primary font-semibold">
                  Apenas para maiores de 18 anos.
                </span>
              </p>

              {consented && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                  <Button
                    asChild
                    className={`text-lg px-8 py-6 ${heroBgClass} ${heroTextClass} shadow-md rounded-xl hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition`}
                  >
                    <a
                      href={heroCtaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={heroCtaLabel}
                    >
                      {renderHeroIcon()}
                      {heroCtaLabel}
                    </a>
                  </Button>

                  <Link to="/previews">
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Ver Previews
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
            <div className="text-sm mb-2">Deslize para explorar</div>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
            </div>
          </div>
        </section>

        {/* Preview Grid Section (só depois do 18+) */}
        {consented && (
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Previews Exclusivos
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Conheça um pouco do que te espera nas plataformas premium
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {HOMEPAGE_PREVIEWS.map((preview) => (
                  <PreviewCard
                    key={preview.id}
                    title={preview.title}
                    duration={preview.duration}
                    tags={preview.tags}
                    poster={preview.poster}
                    isSensitive={preview.isSensitive}
                    onPlay={() => handlePlayVideo(preview)}
                    thumbVideoUrl={preview.videoUrl}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/previews">
                  <Button className="secondary-button">
                    Ver Todos os Previews
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Galeria (5 fotos) */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
              Galeria
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {gallery.slice(0, 5).map((src, i) => (
                <div
                  key={src}
                  className="overflow-hidden rounded-xl border border-white/10"
                >
                  <img
                    src={src}
                    alt={`Foto ${i + 1}`}
                    className="h-full w-full object-cover hover:scale-[1.02] transition"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Sobre Mim
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Oi amor!! Seja bem-vindo ao meu perfil. Sou uma loira
                  natural, gostosa e que adora duas coisas; sexo e me cuidar!
                  Aqui o assinante vai ser feliz! Pois vai encontrar o melhor
                  da putaria! Eu transando gostoso com meu marido, com meu
                  marido e outro amigo, com assinantes, adoro uma boa
                  putaria. Bem isso que você leu,você vai encontrar uma casada
                  que não nega sexo. Vai ter também os melhores conteúdos
                  sozinha e também eventualmente acompanhada com outra ou
                  outras meninas. Como falei; limite quem tem é município, não
                  eu e muito menos o meu prazer que é também o prazer do meu
                  assinante. Criadora de conteúdo adulto premium focado em
                  qualidade e exclusividade. Cada produção é cuidadosamente
                  planejada para oferecer uma experiência única e sofisticada.
                  Vem! Assine já e goze muuuuito!
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-primary" />
                    <span className="text-foreground">
                      Conteúdo em resolução 4K
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-foreground">
                      Atualizações semanais
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-primary" />
                    <span className="text-foreground">
                      Interação personalizada
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-foreground">
                      Comunidade exclusiva
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  Redes Sociais
                </h3>
                <SocialGrid />
              </div>
            </div>
          </div>
        </section>

        {/* Stats & CTA Section (só depois do 18+) */}
        {consented && (
          <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="container mx-auto px-4 text-center">
              <Card className="glass-card max-w-4xl mx-auto p-12">
                <CardContent>
                  <h2 className="text-4xl font-bold text-foreground mb-6">
                    Junte-se à Experiência Premium
                  </h2>
                  <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Milhares de pessoas já fazem parte da nossa comunidade
                    exclusiva. Venha descobrir o que te espera!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        500+
                      </div>
                      <div className="text-muted-foreground">
                        Conteúdos Exclusivos
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-secondary mb-2">
                        10k+
                      </div>
                      <div className="text-muted-foreground">
                        Seguidores Ativos
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        5★
                      </div>
                      <div className="text-muted-foreground">
                        Avaliação Média
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://topfans.me/srahot"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Assinar no TopFans"
                    style={{ textDecoration: "none" }}
                  >
                    <Button className="premium-button text-xl px-12 py-6">
                      <Crown className="w-6 h-6 mr-3" />
                      Assinar Agora
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Perguntas Frequentes
                </h2>
                <p className="text-xl text-muted-foreground">
                  Tire suas dúvidas sobre o conteúdo e plataformas
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {FAQ_ITEMS.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="glass-card px-6 border-white/10"
                  >
                    <AccordionTrigger className="text-left text-foreground hover:text-primary">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card/50 border-t border-white/10 py-12 pb-24 lg:pb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Suelen Villanchisky
                </h3>
                <p className="text-muted-foreground">
                  Conteúdo adulto premium e exclusivo para maiores de 18
                  anos.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  Links Úteis
                </h4>
                <div className="space-y-2">
                  <Link
                    to="/previews"
                    className="block text-muted-foreground hover:text-primary"
                  >
                    Ver Previews
                  </Link>
                  <Link
                    to="/termos"
                    className="block text-muted-foreground hover:text-primary"
                  >
                    Termos de Uso
                  </Link>
                  <Link
                    to="/privacidade"
                    className="block text-muted-foreground hover:text-primary"
                  >
                    Política de Privacidade
                  </Link>
                  <Link
                    to="/admin"
                    className="block text-xs text-muted-foreground hover:text-primary"
                  >
                    Área do administrador
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  Contato
                </h4>
                <p className="text-muted-foreground">
                  Email: {"Casal_hot_047@outlook.com"}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-center text-muted-foreground">
              <p>© 2024 Suelen Villanchisky. Todos os direitos reservados.</p>
              <p className="text-sm mt-2">
                Este site é destinado exclusivamente a maiores de 18 anos.
              </p>
              <p>
                Desenvolvido por{" "}
                  <a
                    href="https://keventech.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    Keven Tech
                  </a>
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Video Modal */}
      <VideoModal
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        title={selectedVideo?.title || ""}
        videoUrl={selectedVideo?.videoUrl}
      />
    </>
  );
};

export default Index;
