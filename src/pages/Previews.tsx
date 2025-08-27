import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PreviewCard } from "@/components/PreviewCard";
import { VideoModal } from "@/components/VideoModal";
import { useAdultConsent } from "@/hooks/useAdultConsent";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowLeft } from "lucide-react";
import preview1 from "@/assets/preview-1.jpg";
import preview2 from "@/assets/preview-2.jpg";
import preview3 from "@/assets/preview-3.jpg";

// Mock data expandida
const MOCK_PREVIEWS = [
  {
    id: 1,
    title: "Preview Elegante - Ensaio Fotográfico Premium",
    duration: 120,
    tags: ["fotografia", "elegante", "premium"],
    poster: preview1,
    isSensitive: true
  },
  {
    id: 2,
    title: "Bastidores Exclusivos - Making Of Completo",
    duration: 180,
    tags: ["bastidores", "making of", "exclusivo"],
    poster: preview2,
    isSensitive: true
  },
  {
    id: 3,
    title: "Ensaio Artístico - Luz Natural Premium",
    duration: 150,
    tags: ["artístico", "luz natural", "premium"],
    poster: preview3,
    isSensitive: true
  },
  {
    id: 4,
    title: "Sessão Glamour - Alta Costura",
    duration: 200,
    tags: ["glamour", "moda", "premium"],
    poster: preview1,
    isSensitive: true
  },
  {
    id: 5,
    title: "Editorial Fashion - Conceitual",
    duration: 165,
    tags: ["editorial", "fashion", "conceitual"],
    poster: preview2,
    isSensitive: true
  },
  {
    id: 6,
    title: "Ensaio Íntimo - Boudoir Premium", 
    duration: 190,
    tags: ["boudoir", "íntimo", "premium"],
    poster: preview3,
    isSensitive: true
  }
];

const ALL_TAGS = ["premium", "fotografia", "bastidores", "artístico", "glamour", "moda", "editorial", "fashion", "boudoir", "íntimo"];

const Previews = () => {
  const { consented } = useAdultConsent();
  const [selectedVideo, setSelectedVideo] = useState<typeof MOCK_PREVIEWS[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handlePlayVideo = (preview: typeof MOCK_PREVIEWS[0]) => {
    if (consented) {
      setSelectedVideo(preview);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredPreviews = MOCK_PREVIEWS.filter(preview => {
    const matchesSearch = preview.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => preview.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  if (!consented) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center glass-card p-12 max-w-md mx-4">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Acesso Restrito
          </h1>
          <p className="text-muted-foreground mb-8">
            Esta seção contém conteúdo adulto. Confirme que você tem 18 anos ou mais para continuar.
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
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Buscar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card/50 border-white/20"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filtrar por categoria:</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {ALL_TAGS.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "secondary"}
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

        {/* Preview Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <p className="text-muted-foreground">
                {filteredPreviews.length} {filteredPreviews.length === 1 ? 'preview encontrado' : 'previews encontrados'}
              </p>
            </div>
            
            {filteredPreviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPreviews.map((preview) => (
                  <PreviewCard
                    key={preview.id}
                    title={preview.title}
                    duration={preview.duration}
                    tags={preview.tags}
                    poster={preview.poster}
                    onPlay={() => handlePlayVideo(preview)}
                    isSensitive={preview.isSensitive}
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
              <Button className="premium-button text-lg px-8 py-4">
                Acessar Conteúdo Completo
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Video Modal */}
      <VideoModal
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        title={selectedVideo?.title || ""}
        videoUrl={undefined}
      />
    </>
  );
};

export default Previews;