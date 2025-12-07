// src/components/PreviewCard.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { useAdultConsent } from "@/hooks/useAdultConsent";

type Props = {
  title: string;
  duration: number;
  tags: string[];
  poster?: string;
  isSensitive?: boolean;
  onPlay?: () => void;

  // NOVO: se informado, a capa vira um <video> mutado/loop (preview)
  thumbVideoUrl?: string;
};

export function PreviewCard({
  title,
  duration,
  tags,
  poster,
  isSensitive,
  onPlay,
  thumbVideoUrl,
}: Props) {
  const { consented } = useAdultConsent();
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const hasPoster = Boolean(poster && poster.trim());

  const handleMouseEnter = () => {
    if (videoRef.current) {
      // só tenta tocar se estiver carregado
      videoRef.current.play().catch(() => {});
    }
  };
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // se não consentiu, sempre mostrar blur; se não houver poster, usamos o vídeo parado como thumb
  const showVideoThumb =
    (!!thumbVideoUrl && consented) || (!!thumbVideoUrl && !hasPoster);
  const fallbackGradient =
    "bg-gradient-to-br from-purple-700/60 via-slate-900/70 to-black/80";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md",
        "transition hover:border-white/20"
      )}
      onMouseEnter={showVideoThumb ? handleMouseEnter : undefined}
      onMouseLeave={showVideoThumb ? handleMouseLeave : undefined}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {showVideoThumb ? (
          <video
            ref={videoRef}
            muted
            playsInline
            loop
            preload="metadata"
            poster={poster}
            className={cn(
              "h-full w-full object-cover transition duration-300",
              isSensitive && !consented ? "blur-xl brightness-75" : ""
            )}
          >
            <source src={thumbVideoUrl} type="video/mp4" />
          </video>
        ) : hasPoster ? (
          <img
            src={poster}
            alt={title}
            className={cn(
              "h-full w-full object-cover transition duration-300",
              isSensitive && !consented ? "blur-xl brightness-75" : "group-hover:scale-[1.02]"
            )}
            loading="lazy"
          />
        ) : (
          <div
            className={cn(
              "h-full w-full grid place-items-center text-white/80",
              fallbackGradient
            )}
          >
            <Play className="w-8 h-8 opacity-70" />
          </div>
        )}

        <button
          onClick={onPlay}
          className={cn(
            "absolute inset-0 grid place-items-center bg-black/0 transition",
            "group-hover:bg-black/20 focus:bg-black/20"
          )}
          aria-label={`Assistir: ${title}`}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-black shadow">
            <Play className="h-4 w-4" />
            Assistir
          </span>
        </button>

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <Badge className="bg-black/70 text-white backdrop-blur px-2 py-0.5">
            {Math.max(0, Math.round(duration))}s
          </Badge>
          {isSensitive && (
            <Badge className="bg-red-600/80 text-white backdrop-blur px-2 py-0.5">
              18+
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground">
          {title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="bg-white/10 text-white/90"
            >
              {t}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
