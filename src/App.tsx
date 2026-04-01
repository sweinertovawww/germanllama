import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import FlashCards from "./pages/FlashCards";
import Pexeso from "./pages/Pexeso";
import SentenceBuilder from "./pages/SentenceBuilder";
import Kontakt from "./pages/Kontakt";
import NotFound from "./pages/NotFound";
import NemcinaDoPrice from "./pages/NemcinaDoPrice";
import ProfessionLanding from "./pages/professions/ProfessionLanding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route
            path="/flashcards"
            element={
              <Layout>
                <FlashCards />
              </Layout>
            }
          />
          <Route
            path="/pexeso"
            element={
              <Layout>
                <Pexeso />
              </Layout>
            }
          />
          <Route
            path="/skladani-vet"
            element={
              <Layout>
                <SentenceBuilder />
              </Layout>
            }
          />
          <Route
            path="/nemcina-do-prace"
            element={
              <Layout>
                <NemcinaDoPrice />
              </Layout>
            }
          />
          <Route
            path="/nemcina-do-prace/:slug"
            element={
              <Layout>
                <ProfessionLanding />
              </Layout>
            }
          />
          <Route
            path="/kontakt"
            element={
              <Layout>
                <Kontakt />
              </Layout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
