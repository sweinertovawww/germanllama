import React from "react";
import LlamaGame from "@/game/LlamaGame";
import sombreroIcon from "@/assets/sombrero-icon.png";
import { ArrowUp, Trophy, SkullIcon } from "lucide-react";

function RuleItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">{icon}</div>
      <div>
        <h3 className="font-body font-bold text-foreground text-sm sm:text-base">{title}</h3>
        <p className="font-body text-muted-foreground text-xs sm:text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <>
      {/* How to play details */}
      <section className="py-4 sm:py-8 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-2xl px-4 sm:px-8 py-2 sm:py-2.5 text-center">
            <h2 className="font-game text-base sm:text-xl font-bold">
              Pravidla Hry
            </h2>
          </div>
          <div className="bg-muted rounded-b-2xl border border-t-0 border-border px-4 sm:px-8 py-3 sm:py-4 shadow-sm">
            <div className="space-y-2 sm:space-y-2.5">
              <RuleItem
                icon={<ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                title="Skákej"
                text="Šipkou nahoru / mezerníkem / tlačítkem Skok na mobilu."
              />
              <RuleItem
                icon={<Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />}
                title="Odpovídej správně"
                text="Překládej slovíčka (použij diakritiku) a urči správný člen (der, die, das)."
              />
              <RuleItem
                icon={<img src={sombreroIcon} alt="Sombréro" className="w-8 h-8 sm:w-10 sm:h-10" />}
                title="Sbírej sombréra"
                text="Přidají ti body navíc"
              />
              <RuleItem
                icon={<SkullIcon className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />}
                title="Pozor na vlka!"
                text="Skoč na něj shora, jinak hra končí a ztrácíš body."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Game Section */}
      <section id="game-section" className="bg-background">
        <div className="flex flex-col items-center justify-start py-2 sm:py-4 px-1 sm:px-2">
          <LlamaGame />
        </div>
      </section>
    </>
  );
};

export default Index;
