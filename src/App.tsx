import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import LanguageSelector from "@/components/LanguageSelector";
import Index from "./pages/Index";
import FlashCards from "./pages/FlashCards";
import Pexeso from "./pages/Pexeso";
import SentenceBuilder from "./pages/SentenceBuilder";
import Kontakt from "./pages/Kontakt";
import NotFound from "./pages/NotFound";
import NemcinaDoPrice from "./pages/NemcinaDoPrice";
import Wortpaare from "./pages/Wortpaare";
import Scrabble from "./pages/Scrabble";
import Challenge from "./pages/Challenge";
import ChallengeA1 from "./pages/ChallengeA1";
import ProfessionLanding from "./pages/professions/ProfessionLanding";

const queryClient = new QueryClient();

function AppRoutes() {
  const isNewUser = !localStorage.getItem("gl_onboarding_done") && !localStorage.getItem("gl_lang");
  const [showOnboarding, setShowOnboarding] = useState(isNewUser);

  return (
    <>
      {showOnboarding && (
        <LanguageSelector mode="onboarding" onClose={() => setShowOnboarding(false)} />
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/flashcards" element={<Layout><FlashCards /></Layout>} />
          <Route path="/pexeso" element={<Layout><Pexeso /></Layout>} />
          <Route path="/skladani-vet" element={<Layout><SentenceBuilder /></Layout>} />
          <Route path="/nemcina-do-prace" element={<Layout><NemcinaDoPrice /></Layout>} />
          <Route path="/nemcina-do-prace/:slug" element={<Layout><ProfessionLanding /></Layout>} />
          <Route path="/wortpaare" element={<Layout><Wortpaare /></Layout>} />
          <Route path="/scrabble" element={<Layout><Scrabble /></Layout>} />
          <Route path="/challenge" element={<Layout><Challenge /></Layout>} />
          <Route path="/challenge-a1" element={<Layout><ChallengeA1 /></Layout>} />
          <Route path="/kontakt" element={<Layout><Kontakt /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
