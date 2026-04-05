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

      {/* SEO pillar content */}
      <section className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8 font-body text-muted-foreground text-sm sm:text-base leading-relaxed">
        <div>
          <h2 className="font-game text-lg sm:text-xl text-foreground mb-2">Němčina do práce pro Čechy v Německu (A2+)</h2>
          <p>Pracuješ v Německu nebo v pohraničí a potřebuješ se domluvit v práci? Pokud už máš základy němčiny (úroveň A2 a výš), ale v reálné práci často tápeš, jsi na správném místě. GermanLlama ti pomůže zlepšit němčinu prakticky – bez zbytečné teorie a složitostí.</p>
          <p className="mt-2">Zaměřujeme se na němčinu do práce, kterou skutečně využiješ každý den. Ať už pracuješ jako elektrikář, skladník, zedník, instalatér nebo v jiné řemeslné profesi, naučíš se slovíčka a věty, které potřebuješ při komunikaci s kolegy i zákazníky.</p>
        </div>

        <div>
          <h3 className="font-game text-base text-foreground mb-2">Proč se pracovní němčina liší od školní?</h3>
          <p>Možná už umíš základy – víš, co znamená „Haus" nebo „Auto". Jenže v práci potřebuješ něco jiného:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>rozumět pokynům („Přines kabel", „Vyměň pojistku")</li>
            <li>reagovat rychle</li>
            <li>používat odborná slovíčka z tvé profese</li>
            <li>zvládat jednoduché rozhovory v reálných situacích</li>
          </ul>
          <p className="mt-2">Právě na to se zaměřujeme. Učíš se němčinu tak, jak ji opravdu používají lidé v práci.</p>
        </div>

        <div>
          <h3 className="font-game text-base text-foreground mb-2">Německá slovíčka pro řemeslné profese</h3>
          <p>Na webu najdeš obsah rozdělený podle profesí. Můžeš si vybrat přesně to, co potřebuješ:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>němčina pro elektrikáře</li>
            <li>němčina pro skladníky</li>
            <li>němčina pro zedníky</li>
            <li>němčina pro instalatéry</li>
            <li>a další</li>
          </ul>
          <p className="mt-2">Každá kategorie obsahuje praktická slovíčka, fráze a věty z reálného pracovního prostředí.</p>
        </div>

        <div>
          <h3 className="font-game text-base text-foreground mb-2">Učení němčiny hrou – rychlejší výsledky</h3>
          <p>Zapomeň na nudné biflování. U nás se učíš pomocí jednoduchých her:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>kartičky (flash cards) pro rychlé zapamatování</li>
            <li>pexeso pro trénink paměti</li>
            <li>skládání vět pro praxi komunikace</li>
            <li>Llama Run pro procvičení členů der, die, das</li>
          </ul>
          <p className="mt-2">Díky tomu si slovíčka zapamatuješ přirozeně a bez stresu.</p>
        </div>

        <div>
          <h3 className="font-game text-base text-foreground mb-2">Pro koho je GermanLlama ideální?</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>pro Čechy pracující v Německu</li>
            <li>pro lidi žijící v pohraničí</li>
            <li>pro samouky na úrovni A2 a výš</li>
            <li>pro všechny, kdo chtějí mluvit německy v práci jistěji</li>
          </ul>
          <p className="mt-2">Pokud nechceš jen rozumět, ale opravdu mluvit, tohle je přesně pro tebe.</p>
        </div>

        <div>
          <h3 className="font-game text-base text-foreground mb-2">Začni se učit němčinu hned</h3>
          <p>Vyber si svou profesi a začni trénovat němčinu, kterou skutečně využiješ v práci. Stačí pár minut denně a uvidíš rychlé zlepšení.</p>
          <p className="mt-2 text-foreground font-semibold">👉 Vyzkoušej GermanLlama 🦙 a posuň svou němčinu na další úroveň.</p>
        </div>
      </section>
    </>
  );
};

export default Index;
