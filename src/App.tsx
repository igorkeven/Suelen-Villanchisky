import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAdultConsent } from "@/hooks/useAdultConsent";
import { AgeGateModal } from "@/components/AgeGateModal";
import { MonetizationRibbon } from "@/components/MonetizationRibbon";
import Index from "./pages/Index";
import Previews from "./pages/Previews";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => {
  const { consented, accept } = useAdultConsent();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className={`min-h-screen ${!consented ? 'age-gate-blur' : ''}`}>
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <MonetizationRibbon />
            <div className={consented === false ? 'pointer-events-none' : ''}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/previews" element={<Previews />} />
                <Route path="/termos" element={<Termos />} />
                <Route path="/privacidade" element={<Privacidade />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
          
          <AgeGateModal 
            open={consented === false} 
            onAccept={accept}
          />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
