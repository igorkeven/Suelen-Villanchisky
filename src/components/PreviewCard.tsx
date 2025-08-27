import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, ShieldCheck } from "lucide-react";
import { useAdultConsent } from "@/hooks/useAdultConsent";

interface PreviewCardProps {
  title: string;
  duration: number;
  tags: string[];
  poster: string;
  onPlay?: () => void;
  isSensitive?: boolean;
}

export function PreviewCard({ 
  title, 
  duration, 
  tags, 
  poster, 
  onPlay, 
  isSensitive = true 
}: PreviewCardProps) {
  const { consented } = useAdultConsent();
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shouldBlur = isSensitive && !consented;

  return (
    <Card className="glass-card group cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <img
            src={poster}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-300 ${
              shouldBlur ? 'blur-sm' : ''
            }`}
          />
          
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Duration badge */}
          <Badge className="absolute top-3 right-3 bg-black/60 text-white border-0">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(duration)}
          </Badge>
          
          {/* 18+ Badge se sem consentimento */}
          {shouldBlur && (
            <div className="absolute top-3 left-3">
              <Badge variant="destructive" className="bg-primary">
                <ShieldCheck className="w-3 h-3 mr-1" />
                18+
              </Badge>
            </div>
          )}
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="icon"
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 group-hover:scale-110 transition-all duration-300"
              onClick={onPlay}
            >
              <Play className="w-6 h-6 text-white fill-current ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-3 line-clamp-2">
            {title}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs bg-secondary/20 text-secondary-foreground border-secondary/30"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}