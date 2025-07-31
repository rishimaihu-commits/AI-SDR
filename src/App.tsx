import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AiSdrDashboard from "./pages/AiSdrDashboard";
import NewCampaign from "./pages/NewCampaign";
import CampaignLeads from "./pages/CampaignLeads";
import NotFound from "./pages/NotFound";
import AllProspects from "./pages/AllProspects";
import AllCompanies from "./pages/Allcompanies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ai-sdr-dashboard" element={<AiSdrDashboard />} />
          <Route path="/new-campaign" element={<NewCampaign />} />
          <Route path="/campaign-leads" element={<CampaignLeads />} />
          <Route path="/prospects" element={<AllProspects />} />
          <Route path="/companies" element={<AllCompanies />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
