import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { PROFESSION_LIST, type Profession } from "@/game/vocabularyData";
import { Gamepad2, Layers, Brain, PuzzleIcon, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { type translations } from "@/i18n/translations";

const PROF_DESC_KEYS: Record<Profession, keyof typeof translations.cs> = {
  obecné: "profDescObecne",
  automechanik: "profDescAutomechanik",
  zedník: "profDescZednik",
  gastro: "profDescGastro",
  sestřička: "profDescSestricka",
  pokladní: "profDescPokladni",
  truhlář: "profDescTruhlar",
  instalatér: "profDescInstalater",
  elektrikář: "profDescElektrikar",
  uklízečka: "profDescUklizecka",
  kancelář: "profDescKancelar",
  zahradník: "profDescZahradnik",
  učitel: "profDescUcitel",
  kadeřník: "profDescKadernik",
  systemy_pro_haseni: "profDescHaseni",
};

const professionSlugs: Record<Profession, string> = {
  obecné: "skladnik",
  automechanik: "automechanik",
  zedník: "stavba",
  gastro: "gastro",
  sestřička: "sestra",
  pokladní: "pokladni",
  truhlář: "truhlar",
  instalatér: "instalater",
  elektrikář: "elektrikar",
  uklízečka: "uklizecka",
  kancelář: "kancelar",
  zahradník: "zahradnik",
  učitel: "ucitel",
  kadeřník: "kadernik",
  systemy_pro_haseni: "haseni",
};

const NemcinaDoPrice = () => {
  const { t } = useLanguage();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Němčina do práce – přehled profesí",
    description: "Naučte se německá slovíčka a fráze pro vaši profesi. Skladník, automechanik, kuchař a další.",
    url: "https://germanllama.lovable.app/nemcina-do-prace",
  };

  return (
    <>
      <SEOHead
        title="Němčina do práce – slovíčka pro vaši profesi | GermanLlama"
        description="Naučte se německá slovíčka a fráze pro práci. Skladník, automechanik, kuchař, zdravotní sestra a další profese. Zdarma, hrou, bez registrace."
        canonical="/nemcina-do-prace"
        jsonLd={jsonLd}
      />

      <section className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="font-game text-2xl sm:text-3xl text-foreground mb-3">
          {t("nemcinaPageTitle")}
        </h1>
        <p className="font-body text-base text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          {t("nemcinaPageDesc")}
        </p>

        {/* Profession grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {PROFESSION_LIST.filter(p => p.id !== "obecné").map((prof) => {
            const slug = professionSlugs[prof.id] || prof.id;
            const href = `/nemcina-do-prace/${slug}`;
            return (
              <Link key={prof.id} to={href}>
                <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{prof.emoji}</span>
                    <h2 className="font-game text-base text-foreground">{prof.label}</h2>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1">
                    {t(PROF_DESC_KEYS[prof.id])}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-3 text-sm font-body text-primary font-semibold">
                    {t("showDetail")} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Games section */}
        <h2 className="font-game text-xl text-foreground mb-4">{t("howToLearn")}</h2>
        <p className="font-body text-sm text-muted-foreground mb-6 max-w-xl">
          {t("howToLearnDesc")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: "/", icon: <Gamepad2 className="w-6 h-6" />, label: "Llama Run", descKey: "llamaRunGameDesc" as const },
            { to: "/flashcards", icon: <Layers className="w-6 h-6" />, label: "Flash Cards", descKey: "flashCardsGameDesc" as const },
            { to: "/pexeso", icon: <Brain className="w-6 h-6" />, label: "Pexeso", descKey: "pexesoGameDesc" as const },
            { to: "/skladani-vet", icon: <PuzzleIcon className="w-6 h-6" />, label: t("sentenceBuilderName"), descKey: "sentenceBuilderGameDesc" as const },
          ].map((game) => (
            <Link
              key={game.to}
              to={game.to}
              className="bg-muted border border-border rounded-xl p-4 text-center hover:border-primary/50 transition-all"
            >
              <div className="text-primary mx-auto mb-2">{game.icon}</div>
              <span className="font-game text-sm text-foreground block">{game.label}</span>
              <span className="font-body text-xs text-muted-foreground">{t(game.descKey)}</span>
            </Link>
          ))}
        </div>

        {/* Internal linking text */}
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="font-game text-lg text-foreground mb-3">{t("nemcinaWhyTitle")}</h2>
          <div className="font-body text-sm text-muted-foreground space-y-3 leading-relaxed max-w-2xl">
            <p>{t("nemcinaWhyP1")}</p>
            <p>{t("nemcinaWhyP2")}</p>
            <p>
              {t("nemcinaWhyP3")}{" "}
              <Link to="/flashcards" className="text-primary underline">{t("flashcardsLink")}</Link>
              {" · "}
              <Link to="/" className="text-primary underline">{t("llamaRunLink")}</Link>
              {" · "}
              <Link to="/skladani-vet" className="text-primary underline">{t("sentenceBuilderLink")}</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default NemcinaDoPrice;
