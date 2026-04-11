import React from "react";
import SEOHead from "@/components/SEOHead";
import GameSEOContent from "@/components/GameSEOContent";
import WortpaareGame from "@/components/games/wortpaare/WortpaareGame";
import { ArrowLeftRight } from "lucide-react";

const Wortpaare = () => {
  return (
    <>
      <SEOHead
        title="Wortpaare – synonyma a antonyma | GermanLlama"
        description="Procvičuj německá synonyma a antonyma zábavnou formou. Přiřazuj slovní páry a zlepši si slovní zásobu. Zdarma a bez registrace."
        canonical="/wortpaare"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "VideoGame",
          name: "Wortpaare",
          description: "Hra na přiřazování německých synonym a antonym",
          url: "https://germanllama.lovable.app/wortpaare",
          inLanguage: "cs",
          genre: "Educational",
          playMode: "SinglePlayer",
        }}
      />

      <section className="py-4 sm:py-8 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Rule box matching existing game style */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-2xl px-4 sm:px-8 py-2 sm:py-2.5 text-center">
            <h2 className="font-game text-base sm:text-xl font-bold flex items-center justify-center gap-2">
              <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6" />
              Wortpaare
            </h2>
          </div>
          <div className="bg-muted rounded-b-2xl border border-t-0 border-border px-4 sm:px-8 py-3 sm:py-4 shadow-sm">
            <p className="font-body text-sm text-muted-foreground text-center">
              Přiřaď ke každému německému slovu jeho synonymum (podobný význam) nebo antonymum (opačný význam).
            </p>
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <WortpaareGame />
        </div>
      </section>

      <GameSEOContent
        title="Co se naučíš ve hře Wortpaare?"
        intro="Wortpaare je hra na přiřazování slovních párů – synonym a antonym v němčině. Rozšíříš si slovní zásobu a naučíš se rozlišovat slova s podobným i opačným významem."
        sampleWords={[
          { german: "groß ↔ klein", czech: "velký ↔ malý" },
          { german: "sprechen = reden", czech: "mluvit = hovořit" },
          { german: "kaufen ↔ verkaufen", czech: "kupovat ↔ prodávat" },
          { german: "Arbeit = Job", czech: "práce = zaměstnání" },
          { german: "krank ↔ gesund", czech: "nemocný ↔ zdravý" },
          { german: "helfen = unterstützen", czech: "pomáhat = podporovat" },
        ]}
        faqs={[
          { q: "Jak se hraje Wortpaare?", a: "Klikni na německé slovo a pak na jeho synonymum nebo antonymum. Po správném přiřazení se pár zobrazí s českým překladem." },
          { q: "Co jsou synonyma a antonyma?", a: "Synonyma jsou slova s podobným významem (např. sprechen = reden). Antonyma mají opačný význam (např. groß ↔ klein)." },
          { q: "Je hra zdarma?", a: "Ano, hra je kompletně zdarma a bez registrace." },
        ]}
      />
    </>
  );
};

export default Wortpaare;
