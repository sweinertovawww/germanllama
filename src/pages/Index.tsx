import { useState } from "react";
import LlamaGame from "@/game/LlamaGame";
import germanLlamaLogo from "@/assets/germanllama-logo.png";
import heroBackground from "@/assets/hero-background.jpg";
import sombreroIcon from "@/assets/sombrero-icon.png";

import {
  Gamepad2,
  ArrowUp,
  Trophy,
  SkullIcon,
  Instagram,
  Briefcase,
  Smile,
  RefreshCw,
  Users,
} from "lucide-react";

const Index = () => {
  const [showGame, setShowGame] = useState(false);

  const scrollToGame = () => {
    setShowGame(true);
    setTimeout(() => {
      document.getElementById("game-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Navigation */}
      <nav className="w-full bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={germanLlamaLogo}
              alt="GermanLlama logo"
              className="w-10 h-10 rounded-lg"
            />
            <span className="font-body font-bold text-lg text-foreground">
              Germanllama.com
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
      <header className="relative overflow-hidden bg-primary/10" style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
          <h1 className="font-game text-xl sm:text-3xl text-white mb-3 leading-tight drop-shadow-lg">
            Němčina do práce{" "}
            <span className="text-accent">hravě!</span>
          </h1>
          <p className="text-lg sm:text-2xl text-white font-body font-bold max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Platforma pro samouky němčiny
          </p>
        </div>
      </header>


      {/* How to play details */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-2xl px-6 sm:px-8 py-4 text-center">
            <h2 className="font-game text-xl sm:text-2xl font-bold">
              Pravidla Hry
            </h2>
          </div>
          <div className="bg-card rounded-b-2xl border border-t-0 border-border p-6 sm:p-8 shadow-sm">
            <div className="space-y-4">
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
                icon={<img src={sombreroIcon} alt="Sombréro" className="w-7 h-7" />}
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

      {/* Proč GermanLlama? */}
      <section className="bg-secondary/30 py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-body font-bold text-xl sm:text-2xl text-foreground mb-10">
            Proč Germanllama?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <WhyCard icon={<Briefcase className="w-7 h-7" />} label="Práce" />
            <WhyCard icon={<Smile className="w-7 h-7" />} label="Zábava" />
            <WhyCard icon={<RefreshCw className="w-7 h-7" />} label="Flexibilita" />
            <WhyCard icon={<Users className="w-7 h-7" />} label="Komunita" />
          </div>
        </div>
      </section>

      {/* Game Section */}
      <section id="game-section" className="flex-1 bg-background">
        {showGame ? (
          <div className="flex flex-col items-center justify-start py-4 sm:py-8 px-2">
            <LlamaGame />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
            <Gamepad2 className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground font-body text-base">
              Klikni na tlačítko výše a začni hrát!
            </p>
            <button
              onClick={() => setShowGame(true)}
              className="mt-4 text-primary font-body font-bold underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              Spustit hru
            </button>
          </div>
        )}
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
    <div className="flex items-start gap-4">
      <div className="mt-1 shrink-0">{icon}</div>
      <div>
        <h3 className="font-body font-bold text-foreground">{title}</h3>
        <p className="font-body text-muted-foreground text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function WhyCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-primary">{icon}</div>
      <span className="font-body font-bold text-foreground text-sm">{label}</span>
    </div>
  );
}

export default Index;
