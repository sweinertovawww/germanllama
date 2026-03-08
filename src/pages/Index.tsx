import React from "react";
import LlamaGame from "@/game/LlamaGame";
import germanLlamaLogo from "@/assets/germanllama-logo.png";
import heroBackground from "@/assets/hero-background.jpg";
import sombreroIcon from "@/assets/sombrero-icon.png";

import {
  ArrowUp,
  Trophy,
  SkullIcon,
  Instagram,
} from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Navigation */}
      <nav className="w-full bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <img
              src={germanLlamaLogo}
              alt="GermanLlama logo"
              className="w-20 h-20 rounded-lg"
            />
            <span className="font-body font-bold text-2xl text-foreground">
              Germanllama.com
            </span>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center">
            <span className="font-game text-base sm:text-xl text-foreground leading-tight">
              Němčina do práce hravě!
            </span>
            <span className="font-body text-sm text-foreground">
              Platforma pro samouky němčiny
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <a
              href="https://www.instagram.com/playgermanllama/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body font-semibold text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              Kontakt
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-primary/10" style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center 40%' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-32 pb-36 sm:pt-48 sm:pb-52 text-center">
        </div>
      </header>


      {/* How to play details */}
      <section className="py-6 sm:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-2xl px-6 sm:px-8 py-2.5 text-center">
            <h2 className="font-game text-lg sm:text-xl font-bold">
              Pravidla Hry
            </h2>
          </div>
          <div className="bg-muted rounded-b-2xl border border-t-0 border-border px-6 sm:px-8 py-4 shadow-sm">
            <div className="space-y-2.5">
              <RuleItem
                icon={<ArrowUp className="w-6 h-6 text-primary" />}
                title="Skákej"
                text="Šipkou nahoru / mezerníkem / tlačítkem Skok na mobilu."
              />
              <RuleItem
                icon={<Trophy className="w-6 h-6 text-accent" />}
                title="Odpovídej správně"
                text="Překládej slovíčka (použij diakritiku) a urči správný člen (der, die, das)."
              />
              <RuleItem
                icon={<img src={sombreroIcon} alt="Sombréro" className="w-10 h-10" />}
                title="Sbírej sombréra"
                text="Přidají ti body navíc"
              />
              <RuleItem
                icon={<SkullIcon className="w-6 h-6 text-destructive" />}
                title="Pozor na vlka!"
                text="Skoč na něj shora, jinak hra končí a ztrácíš body."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Game Section */}
      <section id="game-section" className="flex-1 bg-background">
        <div className="flex flex-col items-center justify-start py-4 sm:py-8 px-2">
          <LlamaGame />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-foreground text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-primary-foreground/60">
              © 2026 Germanllama.com · Všechna práva vyhrazena.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-primary-foreground/60 font-body">
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

function RuleItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0 w-10 h-10 flex items-center justify-center">{icon}</div>
      <div>
        <h3 className="font-body font-bold text-foreground">{title}</h3>
        <p className="font-body text-muted-foreground text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}


export default Index;
