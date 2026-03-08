import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import germanLlamaLogo from "@/assets/germanllama-logo.png";
import heroBackground from "@/assets/hero-background.jpg";
import { Gamepad2, Layers, Brain, PuzzleIcon, Instagram, Users, Spotify } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [visitDate, setVisitDate] = useState<string>("");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname === "/flashcards" ? "flash-cards" : location.pathname === "/pexeso" ? "pexeso" : location.pathname === "/skladani-vet" ? "sentence-builder" : "llama-run";

  useEffect(() => {
    const trackVisit = async () => {
      // 1. Get or create visitor_id from cookie (30-day expiry)
      let visitorId = document.cookie.match(/(?:^|; )gl_visitor_id=([^;]*)/)?.[1];
      if (!visitorId) {
        // Migrate from old localStorage key if present
        visitorId = localStorage.getItem("gl_visitor_id") || crypto.randomUUID();
        localStorage.removeItem("gl_visitor_id");
      }
      // Set/refresh cookie for 30 days
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `gl_visitor_id=${visitorId}; expires=${expires}; path=/; SameSite=Lax`;

      // 2. Client-side dedup: skip API call if already tracked today
      const today = new Date().toISOString().slice(0, 10);
      const lastTracked = localStorage.getItem("gl_visit_date");
      if (lastTracked === today) {
        // Still fetch the count without inserting
        try {
          const { data, error } = await supabase.functions.invoke("track-visit", {
            body: { visitor_id: visitorId },
          });
          if (!error && data) {
            setVisitorCount(data.count);
            const d = new Date(data.date + "T00:00:00");
            setVisitDate(d.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" }));
          }
        } catch (e) {
          console.error("Visit tracking error:", e);
        }
        return;
      }

      // 3. First visit today — track it
      try {
        const { data, error } = await supabase.functions.invoke("track-visit", {
          body: { visitor_id: visitorId },
        });
        if (!error && data) {
          setVisitorCount(data.count);
          const d = new Date(data.date + "T00:00:00");
          setVisitDate(d.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" }));
          localStorage.setItem("gl_visit_date", today);
        }
      } catch (e) {
        console.error("Visit tracking error:", e);
      }
    };
    trackVisit();
  }, []);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Navigation */}
      <nav className="w-full bg-card border-b border-border fixed top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-2 sm:py-6 flex items-center justify-between relative">
            <Link to="/" className="flex items-center gap-2 sm:gap-4 cursor-pointer hover:opacity-80 transition-opacity">
              <img
                src={germanLlamaLogo}
                alt="GermanLlama logo"
                className="w-10 h-10 sm:w-20 sm:h-20 rounded-lg"
              />
              <span className="font-body font-bold text-sm sm:text-2xl text-foreground">
                Germanllama.com
              </span>
            </Link>
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center">
            <span className="font-game text-base lg:text-xl text-foreground leading-tight">
              Němčina do práce hravě!
            </span>
            <span className="font-body text-sm text-foreground">
              Platforma pro samouky němčiny
            </span>
            {visitorCount !== null && (
              <span className="flex items-center gap-1.5 font-body text-xs text-muted-foreground mt-1">
                <Users className="w-3.5 h-3.5" />
                Počet samouků na webu dnes ({visitDate}): {visitorCount}
              </span>
            )}
          </div>
          {/* Desktop: Kontakt */}
          <div className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => navigate("/kontakt")}
              className="font-body font-semibold text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              Kontakt
            </button>
          </div>
          {/* Mobile: Kontakt button */}
          <button
            onClick={() => navigate("/kontakt")}
            className="sm:hidden font-body font-semibold text-xs text-foreground/70 hover:text-primary transition-colors px-2 py-1"
          >
            Kontakt
          </button>
        </div>
        {/* Mobile: slogan + counter strip */}
        <div className="md:hidden border-t border-border bg-card px-4 py-1.5 text-center">
          <span className="font-game text-[9px] text-foreground leading-tight block">
            Němčina do práce hravě!
          </span>
          <span className="font-body text-[9px] text-muted-foreground block">
            Platforma pro samouky němčiny
          </span>
          {visitorCount !== null && (
            <span className="flex items-center justify-center gap-1 font-body text-[8px] text-muted-foreground mt-0.5">
              <Users className="w-2.5 h-2.5" />
              Počet samouků na webu dnes ({visitDate}): {visitorCount}
            </span>
          )}
        </div>
      </nav>
      {/* Spacer for fixed nav */}
      <div className="h-[88px] sm:h-[120px] md:h-[100px]" />

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-primary/10" style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center 40%' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-20 sm:pt-48 sm:pb-52 text-center">
        </div>
      </header>

      {/* Tab Navigation */}
      <section className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/")}
              className={`group relative flex items-center gap-3 sm:gap-4 rounded-xl px-4 sm:px-6 py-3 sm:py-4 transition-all duration-200 border-2 ${
                activeTab === "llama-run"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                  : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:bg-muted/80"
              }`}
            >
              <Gamepad2 className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 ${activeTab === "llama-run" ? "text-primary-foreground" : "text-primary"}`} />
              <div className="text-left">
                <span className={`font-game text-xs sm:text-sm block leading-tight ${activeTab === "llama-run" ? "text-primary-foreground" : "text-foreground"}`}>
                  Llama Run
                </span>
                <span className={`font-body text-[10px] sm:text-xs mt-0.5 block ${activeTab === "llama-run" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  Vyskákej si lepší němčinu
                </span>
              </div>
            </button>
            <button
              onClick={() => navigate("/flashcards")}
              className={`group relative flex items-center gap-3 sm:gap-4 rounded-xl px-4 sm:px-6 py-3 sm:py-4 transition-all duration-200 border-2 ${
                activeTab === "flash-cards"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                  : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:bg-muted/80"
              }`}
            >
              <Layers className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 ${activeTab === "flash-cards" ? "text-primary-foreground" : "text-primary"}`} />
              <div className="text-left">
                <span className={`font-game text-xs sm:text-sm block leading-tight ${activeTab === "flash-cards" ? "text-primary-foreground" : "text-foreground"}`}>
                  Flash Cards
                </span>
                <span className={`font-body text-[10px] sm:text-xs mt-0.5 block ${activeTab === "flash-cards" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  Kartičky na překlad
                </span>
              </div>
            </button>
            <button
              onClick={() => navigate("/pexeso")}
              className={`group relative flex items-center gap-3 sm:gap-4 rounded-xl px-4 sm:px-6 py-3 sm:py-4 transition-all duration-200 border-2 ${
                activeTab === "pexeso"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                  : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:bg-muted/80"
              }`}
            >
              <Brain className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 ${activeTab === "pexeso" ? "text-primary-foreground" : "text-primary"}`} />
              <div className="text-left">
                <span className={`font-game text-xs sm:text-sm block leading-tight ${activeTab === "pexeso" ? "text-primary-foreground" : "text-foreground"}`}>
                  Pexeso
                </span>
                <span className={`font-body text-[10px] sm:text-xs mt-0.5 block ${activeTab === "pexeso" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  Paměťová hra
                </span>
              </div>
            </button>
            <button
              onClick={() => navigate("/skladani-vet")}
              className={`group relative flex items-center gap-3 sm:gap-4 rounded-xl px-4 sm:px-6 py-3 sm:py-4 transition-all duration-200 border-2 ${
                activeTab === "sentence-builder"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                  : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:bg-muted/80"
              }`}
            >
              <PuzzleIcon className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 ${activeTab === "sentence-builder" ? "text-primary-foreground" : "text-primary"}`} />
              <div className="text-left">
                <span className={`font-game text-xs sm:text-sm block leading-tight ${activeTab === "sentence-builder" ? "text-primary-foreground" : "text-foreground"}`}>
                  Skládání vět
                </span>
                <span className={`font-body text-[10px] sm:text-xs mt-0.5 block ${activeTab === "sentence-builder" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  Přiřaď konce vět
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Privacy Modal */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-game text-sm sm:text-base text-foreground">
              🦙 Ochrana soukromí u Germanllama
            </DialogTitle>
          </DialogHeader>
          <div className="font-body text-sm text-muted-foreground space-y-3">
            <p>Vaše soukromí je pro nás důležité. Neukládáme žádné citlivé údaje ani e-maily.</p>
            <p className="font-semibold text-foreground">Ukládáme pouze:</p>
            <ol className="list-decimal list-inside space-y-1.5 pl-1">
              <li>Vaše herní jméno (pro tabulku výsledků)</li>
              <li>Vybranou profesi (pro vaše pohodlí)</li>
              <li>Anonymní ID návštěvníka (abychom věděli, kolik lidí se s námi učí)</li>
            </ol>
            <p>Žádná data nepředáváme třetím stranám.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border bg-foreground text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          {/* Privacy strip */}
          <div className="text-center mb-4 pb-4 border-b border-primary-foreground/10">
            <p className="font-body text-sm text-primary-foreground/80 mb-1">
              🦙 Moje lama nejí sušenky (cookies), jen je používá k tomu, aby si pamatovala tvé jméno a skóre!
            </p>
            <p className="font-body text-[11px] text-primary-foreground/40">
              Tento web používá pouze nezbytné technické cookies a místní úložiště pro správné fungování her a anonymní statistiky návštěvnosti.
              {" "}
              <button
                onClick={() => setPrivacyOpen(true)}
                className="underline underline-offset-2 text-primary-foreground/60 hover:text-accent transition-colors"
              >
                soukromí
              </button>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <p className="text-xs text-primary-foreground/60 text-center sm:text-left">
                © 2026 Germanllama.com · Všechna práva vyhrazena.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs sm:text-sm text-primary-foreground/60 font-body">
                Sledujte nás:
              </span>
              <a
                href="https://www.instagram.com/playgermanllama/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-foreground/80 hover:text-accent hover:scale-110 transition-all duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61586284749463"
                target="_blank"
                rel="noopener noreferrer"
                title="Otevřít Facebook"
                className="inline-flex items-center text-primary-foreground/80 hover:text-accent hover:scale-110 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a
                href="https://open.spotify.com/show/3hoxYnDeM1UMlXz2YfhCiD?si=89c40afb384e49d4"
                target="_blank"
                rel="noopener noreferrer"
                title="Otevřít Spotify"
                className="inline-flex items-center text-primary-foreground/80 hover:text-accent hover:scale-110 transition-all duration-200"
              >
                <Music className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
