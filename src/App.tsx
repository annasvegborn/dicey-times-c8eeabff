
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CharacterCreation from "./pages/CharacterCreation";
import CharacterSheet from "./pages/CharacterSheet";
import WorldMap from "./pages/WorldMap";
import QuestLog from "./pages/QuestLog";
import QuestDetail from "./pages/QuestDetail";
import StepTracker from "./pages/StepTracker";
import Inventory from "./pages/Inventory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/character-creation" element={<CharacterCreation />} />
          <Route path="/character-sheet" element={<CharacterSheet />} />
          <Route path="/world-map" element={<WorldMap />} />
          <Route path="/quests" element={<QuestLog />} />
          <Route path="/quest/:questId" element={<QuestDetail />} />
          <Route path="/step-tracker" element={<StepTracker />} />
          <Route path="/inventory" element={<Inventory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
