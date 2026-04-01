import React from "react";
import LlamaGame from "@/game/LlamaGame";
import sombreroIcon from "@/assets/sombrero-icon.png";
import { ArrowUp, Trophy, SkullIcon } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import GameSEOContent from "@/components/GameSEOContent";

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
      <SEOHead
        title="Llama Run – němčina hrou | GermanLlama"
        description="Skákej s lamou a uč se německá slovíčka a členy. Zábavná hra pro úroveň A2+. Zdarma a bez registrace."
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "VideoGame",
          name: "Llama Run",
          description: "Skákací hra pro učení německých slovíček a členů",
          url: "https://germanllama.lovable.app/",
          inLanguage: "cs",
          genre: "Educational",
          playMode: "SinglePlayer",
        }}
      />
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

      <GameSEOContent
        title="Co se naučíš v Llama Run?"
        intro="Llama Run je skákací hra, ve které procvičuješ německé členy (der, die, das) a slovíčka z různých profesí. Skákej přes překážky, odpovídej na otázky a sbírej body. Ideální pro úroveň A2+."
        sampleWords={[
          { german: "der Tisch", czech: "stůl" },
          { german: "die Katze", czech: "kočka" },
          { german: "das Haus", czech: "dům" },
          { german: "der Hund", czech: "pes" },
          { german: "die Blume", czech: "květina" },
          { german: "das Buch", czech: "kniha" },
          { german: "der Stuhl", czech: "židle" },
          { german: "die Lampe", czech: "lampa" },
          { german: "das Auto", czech: "auto" },
          { german: "der Baum", czech: "strom" },
        ]}
        faqs={[
          { q: "Jak se hraje Llama Run?", a: "Skákej šipkou nahoru nebo mezerníkem. Odpovídej na otázky o německých členech a překladech. Za správné odpovědi získáváš body." },
          { q: "Pro koho je hra určena?", a: "Pro všechny, kdo se učí němčinu na úrovni A2 a výše. Ideální pro pracující v Německu a Rakousku." },
          { q: "Je hra zdarma?", a: "Ano, hra je kompletně zdarma a bez registrace. Stačí vybrat profesi a začít hrát." },
        ]}
      />
    </>
  );
};

export default Index;
