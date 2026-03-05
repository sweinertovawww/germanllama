import { useState } from "react";
import LlamaGame from "@/game/LlamaGame";
import germanLlamaLogo from "@/assets/germanllama-logo.png";
import { Gamepad2, ArrowUp, Space, Trophy, SkullIcon, ShieldCheck, Instagram } from "lucide-react";

const Index = () => {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 sm:pt-16 sm:pb-12 text-center">
          <img
            src={germanLlamaLogo}
            alt="GermanLlama logo – pixel art lama s německou šálou"
            className="w-40 h-40 sm:w-52 sm:h-52 mx-auto mb-6 drop-shadow-lg rounded-2xl"
          />
          <h1 className="font-game text-2xl sm:text-4xl text-primary mb-4 leading-tight">
            GermanLlama
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 font-body max-w-xl mx-auto leading-relaxed font-bold">
            Němčina do práce hravě!
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Pro úroveň A2–B1 · Ideální pro práci v Německu
          </p>
          <button
            onClick={() => {
              setShowGame(true);
              setTimeout(() => {
                document.getElementById("game-section")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground font-body font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-primary/90 transition-colors active:scale-95"
          >
            <Gamepad2 className="w-5 h-5" />
            Hrát Llama Run
          </button>
        </div>
      </header>

      {/* How to play */}
      <section className="bg-card border-y border-border">
        <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
          <h2 className="font-game text-base sm:text-lg text-center text-foreground mb-8">
            Jak se hraje?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RuleCard
              icon={<ArrowUp className="w-5 h-5 text-secondary" />}
              title="Skákej"
              text="Šipka nahoru, mezerník nebo tlačítko SKOK na mobilu."
            />
            <RuleCard
              icon={<Trophy className="w-5 h-5 text-accent" />}
              title="Odpovídej správně"
              text="Překládej slovíčka a urči správný člen (der, die, das)."
            />
            <RuleCard
              icon={<span className="text-xl">🎩</span>}
              title="Sbírej sombréra"
              text="Sombréro ti přidá body k dobru – nech si je na horší chvíle."
            />
            <RuleCard
              icon={<SkullIcon className="w-5 h-5 text-destructive" />}
              title="Pozor na vlka!"
              text="Na vlka musíš skočit shora. Jinak hra končí a ztrácíš body."
            />
          </div>
        </div>
      </section>

      {/* Game Section */}
      <section id="game-section" className="flex-1">
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
      <footer className="border-t border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            @2026 Germanllama.com – All rights reserved
          </p>
          <a
            href="https://www.instagram.com/playgermanllama/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors font-body font-semibold"
          >
            <Instagram className="w-4 h-4" />
            @playgermanllama
          </a>
        </div>
      </footer>
    </div>
  );
};

function RuleCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3 bg-background rounded-lg border border-border p-4">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <h3 className="font-body font-bold text-foreground text-sm mb-1">{title}</h3>
        <p className="font-body text-muted-foreground text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default Index;
