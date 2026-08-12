import React from "react";
import SEOHead from "@/components/SEOHead";
import GameSEOContent from "@/components/GameSEOContent";
import WortpaareGame from "@/components/games/wortpaare/WortpaareGame";
import { ArrowLeftRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Wortpaare = () => {
  const { t, lang } = useLanguage();

  return (
    <>
      <SEOHead
        title="Slovní páry – synonyma a antonyma | GermanLlama"
        description="Procvičuj německá synonyma a antonyma zábavnou formou. Přiřazuj slovní páry a zlepši si slovní zásobu. Zdarma a bez registrace."
        canonical="/wortpaare"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "VideoGame",
          name: "Slovní páry",
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
              {t("wordPairsName")}
            </h2>
          </div>
          <div className="bg-muted rounded-b-2xl border border-t-0 border-border px-4 sm:px-8 py-3 sm:py-4 shadow-sm">
            <p className="font-body text-sm text-muted-foreground text-center">
              {t("wortpaareRuleText")}
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
        title={t("wortpaareSeoTitle")}
        intro={t("wortpaareSeoIntro")}
        sampleWords={[
          { german: "groß ↔ klein",         translation: lang === "de" ? "big ↔ small"    : lang === "ko" ? "크다 ↔ 작다"         : lang === "pl" ? "duży ↔ mały"              : lang === "en" ? "big ↔ small"       : lang === "uk" ? "великий ↔ малий"   : lang === "sk" ? "veľký ↔ malý"          : "velký ↔ malý" },
          { german: "sprechen = reden",      translation: lang === "de" ? "speak = talk"   : lang === "ko" ? "말하다 = 이야기하다" : lang === "pl" ? "mówić = rozmawiać"         : lang === "en" ? "speak = talk"      : lang === "uk" ? "говорити = балакати" : lang === "sk" ? "hovoriť = rozprávať"   : "mluvit = hovořit" },
          { german: "kaufen ↔ verkaufen",    translation: lang === "de" ? "buy ↔ sell"     : lang === "ko" ? "사다 ↔ 팔다"         : lang === "pl" ? "kupować ↔ sprzedawać"     : lang === "en" ? "buy ↔ sell"        : lang === "uk" ? "купувати ↔ продавати" : lang === "sk" ? "kupovať ↔ predávať"    : "kupovat ↔ prodávat" },
          { german: "Arbeit = Job",          translation: lang === "de" ? "work = job"     : lang === "ko" ? "일 = 직업"           : lang === "pl" ? "praca = zajęcie"          : lang === "en" ? "work = job"        : lang === "uk" ? "робота = праця"    : lang === "sk" ? "práca = zamestnanie"   : "práce = zaměstnání" },
          { german: "krank ↔ gesund",        translation: lang === "de" ? "sick ↔ healthy" : lang === "ko" ? "아프다 ↔ 건강하다"   : lang === "pl" ? "chory ↔ zdrowy"           : lang === "en" ? "sick ↔ healthy"    : lang === "uk" ? "хворий ↔ здоровий" : lang === "sk" ? "chorý ↔ zdravý"        : "nemocný ↔ zdravý" },
          { german: "helfen = unterstützen", translation: lang === "de" ? "help = support" : lang === "ko" ? "돕다 = 지원하다"     : lang === "pl" ? "pomagać = wspierać"       : lang === "en" ? "help = support"    : lang === "uk" ? "допомагати = підтримувати" : lang === "sk" ? "pomáhať = podporovať" : "pomáhat = podporovat" },
        ]}
        faqs={[
          { q: t("wortpaareFaq1q"), a: t("wortpaareFaq1a") },
          { q: t("wortpaareFaq2q"), a: t("wortpaareFaq2a") },
          { q: t("wortpaareFaq3q"), a: t("wortpaareFaq3a") },
        ]}
      />
    </>
  );
};

export default Wortpaare;
