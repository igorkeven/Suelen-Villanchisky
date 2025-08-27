import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, MessageCircle } from "lucide-react";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/suelen.villanchisky?igsh=ZGNtNzUyaW4xNGox",
    icon: Instagram,
    isPaid: false,
    description: "Fotos e stories diários"
  },
  {
    name: "WhatsApp",
    url: "{EMAIL_COMERCIAL}",
    icon: MessageCircle,
    isPaid: false,
    description: "Contato comercial"
  }
];

export function SocialGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SOCIAL_LINKS.map((social) => (
        <Button
          key={social.name}
          asChild
          variant="outline"
          className="glass-card p-6 h-auto justify-start border-white/20 hover:border-primary/50 hover:bg-primary/10"
        >
          <a href={social.url} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <social.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">{social.name}</h3>
                <p className="text-sm text-muted-foreground">{social.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
            </div>
          </a>
        </Button>
      ))}
    </div>
  );
}