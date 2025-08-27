import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaTelegramPlane } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PreviewCard } from "@/components/PreviewCard";
import { SocialGrid } from "@/components/SocialGrid";
import { VideoModal } from "@/components/VideoModal";
import { useAdultConsent } from "@/hooks/useAdultConsent";
import { Link } from "react-router-dom";
import { Play, Star, Heart, Sparkles, Clock, Users, Crown } from "lucide-react";
import heroImage from "@/assets/hero-image.jpeg";
import preview1 from "@/assets/preview-1.jpg";
import preview2 from "@/assets/preview-2.jpg";
import preview3 from "@/assets/preview-3.jpg";

// Mock data - Em produção seria do Sanity
const MOCK_PREVIEWS = [
  {
    id: 1,
    title: "Preview Elegante - Ensaio Fotográfico",
    duration: 120,
    tags: ["fotografia", "elegante", "premium"],
    poster: preview1,
    isSensitive: true
  },
  {
    id: 2, 
    title: "Bastidores - Making Of Premium",
    duration: 180,
    tags: ["bastidores", "making of", "exclusivo"],
    poster: preview2,
    isSensitive: true
  },
  {
    id: 3,
    title: "Ensaio Artístico - Luz Natural",
    duration: 150,
    tags: ["artístico", "luz natural", "premium"],
    poster: preview3,
    isSensitive: true
  }
];

const FAQ_ITEMS = [
  {
    question: "Como funciona o acesso ao conteúdo premium?",
    answer: "Todo o conteúdo exclusivo está disponível nas plataformas parceiras. Clique nos botões de acesso para ser redirecionado e escolher seu plano preferido."
  },
  {
    question: "Com que frequência há atualizações?",
    answer: "Publico conteúdo novo regularmente, incluindo fotos em alta resolução, vídeos exclusivos e bastidores. Siga nas redes sociais para não perder nenhuma novidade."
  },
  {
    question: "O conteúdo é seguro e privado?",
    answer: "Sim, todas as plataformas parceiras possuem sistemas de segurança avançados e políticas rígidas de privacidade. Seu acesso e informações estão protegidos."
  },
  {
    question: "Como entro em contato comercial?",
    answer: "Para parcerias, colaborações ou questões comerciais, entre em contato através do email disponível na seção de redes sociais."
  }
];

const Index = () => {
  const { consented } = useAdultConsent();
  const [selectedVideo, setSelectedVideo] = useState<typeof MOCK_PREVIEWS[0] | null>(null);

  const handlePlayVideo = (preview: typeof MOCK_PREVIEWS[0]) => {
    if (consented) {
      setSelectedVideo(preview);
    }
  };

  return (
    <>
      {/* Ajuste para ribbon desktop */}
      <div className="lg:pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={heroImage} 
              alt="Hero background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-lg px-6 py-2">
                <Crown className="w-5 h-5 mr-2" />
                Conteúdo Premium Adulto
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                {"Suelen Villanchisky"}
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Conteúdo adulto premium, exclusivo e de alta qualidade. 
                <br />
                <span className="text-primary font-semibold">Apenas para maiores de 18 anos.</span>
              </p>
              
              {consented && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
   <Button
  asChild
  className="text-lg px-8 py-6 bg-[#229ED9] hover:bg-[#1F8DC3] text-white shadow-md rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#229ED9]/40"
>
  <a
    href="https://t.me/SEU_CANAL_TELEGRAM?start=site"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Entrar no Telegram (conteúdo grátis)"
  >
    <FaTelegramPlane className="w-5 h-5 mr-2" />
    Entrar no Telegram (Grátis)
  </a>
</Button>

                  
                  <Link to="/previews">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6">
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

        {/* Preview Grid Section */}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_PREVIEWS.map((preview) => (
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

        {/* About Section */}
        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Sobre Mim
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Criadora de conteúdo adulto premium focada em qualidade, elegância e exclusividade. 
                  Cada produção é cuidadosamente planejada para oferecer uma experiência única e sofisticada.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Conteúdo em resolução 4K</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Atualizações semanais</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Interação personalizada</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Comunidade exclusiva</span>
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

        {/* Stats & CTA Section */}
        {consented && (
          <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="container mx-auto px-4 text-center">
              <Card className="glass-card max-w-4xl mx-auto p-12">
                <CardContent>
                  <h2 className="text-4xl font-bold text-foreground mb-6">
                    Junte-se à Experiência Premium
                  </h2>
                  <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Milhares de pessoas já fazem parte da nossa comunidade exclusiva. 
                    Venha descobrir o que te espera!
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">500+</div>
                      <div className="text-muted-foreground">Conteúdos Exclusivos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-secondary mb-2">10k+</div>
                      <div className="text-muted-foreground">Seguidores Ativos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">5★</div>
                      <div className="text-muted-foreground">Avaliação Média</div>
                    </div>
                  </div>
                  
                  <Button className="premium-button text-xl px-12 py-6">
                    <Crown className="w-6 h-6 mr-3" />
                    Assinar Agora
                  </Button>
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
                  <AccordionItem key={index} value={`item-${index}`} className="glass-card px-6 border-white/10">
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
                  {"Suelen Villanchisky"}
                </h3>
                <p className="text-muted-foreground">
                  Conteúdo adulto premium e exclusivo para maiores de 18 anos.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Links Úteis</h4>
                <div className="space-y-2">
                  <Link to="/previews" className="block text-muted-foreground hover:text-primary">
                    Ver Previews
                  </Link>
                  <Link to="/termos" className="block text-muted-foreground hover:text-primary">
                    Termos de Uso
                  </Link>
                  <Link to="/privacidade" className="block text-muted-foreground hover:text-primary">
                    Política de Privacidade
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Contato</h4>
                <p className="text-muted-foreground">
                  Email: {"{EMAIL_COMERCIAL}"}
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 text-center text-muted-foreground">
              <p>© 2024 {"Suelen Villanchisky"}. Todos os direitos reservados.</p>
              <p className="text-sm mt-2">Este site é destinado exclusivamente a maiores de 18 anos.</p>
                <p>
            Desenvolvido por{' '}
            <a 
              href="https://keventech.netlify.app/" 
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
        videoUrl={undefined} // Em produção seria a URL do Mux
      />
    </>
  );
};

export default Index;