import { Button } from "@/components/ui/button";
import { ExternalLink, Crown, Star, Heart } from "lucide-react";
import { useAdultConsent } from "@/hooks/useAdultConsent";

const PLATFORMS = [
  {
    name: "Plataforma Premium 1",
    url: "{PLATAFORMA_1_URL}",
    icon: Crown,
    priority: true
  },
  {
    name: "Plataforma Premium 2", 
    url: "{PLATAFORMA_2_URL}",
    icon: Star,
    priority: true
  },
  {
    name: "Plataforma Premium 3",
    url: "{PLATAFORMA_3_URL}", 
    icon: Heart,
    priority: false
  }
];

export function MonetizationRibbon() {
  const { consented } = useAdultConsent();

  if (!consented) return null;

  return (
    <>
      {/* Desktop - Top Ribbon */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-sm text-muted-foreground">
              🔥 Conteúdo exclusivo nas plataformas:
            </span>
            <div className="flex space-x-3">
              {PLATFORMS.map((platform) => (
                <Button
                  key={platform.name}
                  asChild
                  className={platform.priority ? "premium-button text-sm py-2 px-4" : "secondary-button text-sm py-2 px-4"}
                >
                  <a href={platform.url} target="_blank" rel="noopener noreferrer">
                    <platform.icon className="w-4 h-4 mr-2" />
                    {platform.name}
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile - Bottom Dock */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-white/20">
        <div className="grid grid-cols-3 gap-1 p-2">
          {PLATFORMS.map((platform, index) => (
            <Button
              key={platform.name}
              asChild
              variant="ghost"
              className="flex flex-col items-center p-3 h-auto space-y-1 hover:bg-primary/20 rounded-2xl"
            >
              <a href={platform.url} target="_blank" rel="noopener noreferrer">
                <platform.icon className={`w-5 h-5 ${index < 2 ? 'text-primary' : 'text-secondary'}`} />
                <span className="text-xs font-medium text-foreground">
                  Premium {index + 1}
                </span>
              </a>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}