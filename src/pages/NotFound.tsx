import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background lg:pt-16">
      <div className="text-center glass-card p-16 max-w-lg mx-4">
        <div className="space-y-6">
          <div className="text-8xl font-bold text-primary">404</div>
          
          <h1 className="text-3xl font-bold text-foreground">
            Página não encontrada
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Oops! A página que você está procurando não existe ou foi movida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/">
              <Button className="premium-button">
                <Home className="w-5 h-5 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Página Anterior
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground pt-4">
            Se você acredita que isso é um erro, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;