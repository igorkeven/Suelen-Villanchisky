// src/pages/Previews.tsx
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PreviewCard } from "@/components/PreviewCard";
import { VideoModal } from "@/components/VideoModal";
import { useAdultConsent } from "@/hooks/useAdultConsent";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowLeft } from "lucide-react";
import { STATIC_PREVIEWS, type StaticPreview } from "@/data/previews";
import { STATIC_PHOTOS } from "@/data/photos";

const ALL_TAGS = [
  "premium",
  "fotografia",
  "bastidores",
  "artístico",
  "glamour",
  "moda",
  "editorial",
  "fashion",
  "boudoir",
  "íntimo",
];

const Previews = () => {
  const { consented } = useAdultConsent();
  const [selectedVideo, setSelectedVideo] = useState<StaticPreview | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    const qs = searchTerm.trim().toLowerCase();
    return STATIC_PREVIEWS.filter((p) => {
      const matchesSearch = !qs || p.title.toLowerCase().includes(qs);
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((t) => p.tags.includes(t));
      return matchesSearch && matchesTags;
    });
  }, [searchTerm, selectedTags]);

  // Mostrar só 4 vídeos
  const fourVideos = filtered.slice(0, 4);

  const handlePlayVideo = (p: StaticPreview) => {
    if (consented) setSelectedVideo(p);
  };

  if (!consented) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center glass-card p-12 max-w-md mx-4">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Acesso Restrito
          </h1>
          <p className="text-muted-foreground mb-8">
            Esta seção contém conteúdo adulto. Confirme que você tem 18 anos ou
            mais para continuar.
          </p>
          <Link to="/">
            <Button className="premium-button">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Ajuste para ribbon desktop */}
      <div className="lg:pt-16 min-h-screen bg-background">
        {/* Header */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Link
                to="/"
                className="inline-flex items-center text-muted-foreground hover:text-primary mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao início
              </Link>

              <h1 className="text-5xl font-bold text-foreground mb-6">
                Galeria de Previews
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore nossa coleção exclusiva de conteúdo premium
              </p>

              {/* Search and Filters */}
              <div className="glass-card p-6 space-y-6">
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Buscar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card/50 border-white/20"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filtrar por categoria:</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {ALL_TAGS.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? "default" : "secondary"
                        }
                        className={`cursor-pointer transition-all ${
                          selectedTags.includes(tag)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/20 hover:bg-secondary/30"
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preview Grid (4 vídeos) */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <p className="text-muted-foreground">
                {fourVideos.length} {fourVideos.length === 1
                  ? "preview encontrado"
                  : "previews encontrados"}
              </p>
            </div>

            {fourVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {fourVideos.map((p) => (
                  <PreviewCard
                    key={p.id}
                    title={p.title}
                    duration={p.duration}
                    tags={p.tags}
                    poster={p.poster}
                    isSensitive={p.isSensitive}
                    onPlay={() => handlePlayVideo(p)}
                    thumbVideoUrl={p.videoUrl} // 👈 poster em vídeo (hover)
                  />
                ))}
              </div>
            ) : (
              <div className="text-center glass-card p-16 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Nenhum preview encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Tente ajustar os filtros ou termo de busca
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedTags([]);
                  }}
                  variant="outline"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Galeria de Fotos (5 fotos) */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
              Galeria
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {STATIC_PHOTOS.map((src, i) => (
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

        {/* CTA Footer */}
        <section className="py-16 bg-card/30 pb-32 lg:pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="glass-card p-12 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Gostou dos previews?
              </h2>
              <p className="text-muted-foreground mb-8">
                Acesse o conteúdo completo e exclusivo nas plataformas premium
              </p>
              <a
                href="https://topfans.me/srahot"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Assinar no TopFans"
                style={{ textDecoration: "none" }}
              >
                <Button className="premium-button text-lg px-8 py-4">
                  Acessar Conteúdo Completo
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Video Modal */}
      <VideoModal
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        title={selectedVideo?.title || ""}
        videoUrl={selectedVideo?.videoUrl}
        // posterUrl={selectedVideo?.poster}
      />
    </>
  );
};

export default Previews;
