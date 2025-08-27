import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
}

export function VideoModal({ open, onClose, title, videoUrl }: VideoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-black/95 backdrop-blur-xl border border-white/10 p-0">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="aspect-video bg-black flex items-center justify-center">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full"
                autoPlay
              />
            ) : (
              <div className="text-center text-white">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">
                  Preview em breve... Acesse as plataformas premium para ver o conteúdo completo!
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}