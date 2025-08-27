import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface AgeGateModalProps {
  open: boolean;
  onAccept: () => void;
}

export function AgeGateModal({ open, onAccept }: AgeGateModalProps) {
  const handleExit = () => {
    window.location.href = "https://google.com";
  };

  return (
    <Dialog open={open} modal>
      <DialogContent className="max-w-md mx-auto bg-card/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/20 rounded-full">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">
              Verificação de Idade
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Este site contém conteúdo adulto destinado exclusivamente a maiores de 18 anos. 
              Ao continuar, você declara ter lido e concordado com nossos Termos e Política de Privacidade.
            </p>
          </div>
          
          <div className="space-y-3 pt-4">
            <Button 
              onClick={onAccept}
              className="w-full premium-button text-lg py-4"
            >
              Sou maior de 18 anos
            </Button>
            
            <Button 
              onClick={handleExit}
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10"
            >
              Sair do site
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground/60 pt-2">
            Ao aceitar, você confirma que tem pelo menos 18 anos de idade
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}