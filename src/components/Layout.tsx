import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import germanLlamaLogo from "@/assets/germanllama-logo.png";
import heroBackground from "@/assets/hero-background.jpg";
import { Gamepad2, Layers, Brain, Instagram, Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname === "/flashcards" ? "flash-cards" : location.pathname === "/pexeso" ? "pexeso" : "llama-run";

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Navigation */}
      <nav className="w-full bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-6 flex items-center justify-between relative">
          <div className="flex items-center gap-2 sm:gap-4">
            <img
              src={germanLlamaLogo}
              alt="GermanLlama logo"
              className="w-12 h-12 sm:w-20 sm:h-20 rounded-lg"
            />
            <span className="font-body font-bold text-base sm:text-2xl text-foreground">
              Germanllama.com
            </span>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center">
            <span className="font-game text-base lg:text-xl text-foreground leading-tight">
              Němčina do práce hravě!
            </span>
            <span className="font-body text-sm text-foreground">
              Platforma pro samouky němčiny
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => navigate("/kontakt")}
              className="font-body font-semibold text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              Kontakt
            </button>
          </div>
          <button
            className="sm:hidden p-2 text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="sm:hidden border-t border-border bg-card px-4 py-4 space-y-3">
            <div className="flex flex-col items-center text-center">
              <span className="font-game text-sm text-foreground leading-tight">
                Němčina do práce hravě!
              </span>
              <span className="font-body text-xs text-foreground">
                Platforma pro samouky němčiny
              </span>
            </div>
            <a
              href="https://www.instagram.com/playgermanllama/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center font-body font-semibold text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              Kontakt
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-primary/10" style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center 40%' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-20 sm:pt-48 sm:pb-52 text-center">
        </div>
      </header>

      {/* Tab Navigation */}
      <section className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
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
          </div>
        </div>
      </section>

      {/* Dynamic Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-foreground text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs text-primary-foreground/60 text-center">
              © 2026 Germanllama.com · Všechna práva vyhrazena.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs sm:text-sm text-primary-foreground/60 font-body">
                Sledujte nás:
              </span>
              <a
                href="https://www.instagram.com/playgermanllama/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-accent transition-colors font-body font-semibold"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
