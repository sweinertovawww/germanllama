import React from "react";
import LlamaGame from "@/game/LlamaGame";
import sombreroIcon from "@/assets/sombrero-icon.png";
import { ArrowUp, Trophy, SkullIcon } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import GameSEOContent from "@/components/GameSEOContent";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t, lang } = useLanguage();

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
              {t("gameRules")}
            </h2>
          </div>
          <div className="bg-muted rounded-b-2xl border border-t-0 border-border px-4 sm:px-8 py-3 sm:py-4 shadow-sm">
            <div className="space-y-2 sm:space-y-2.5">
              <RuleItem
                icon={<ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                title={t("jumpTitle")}
                text={t("jumpText")}
              />
              <RuleItem
                icon={<Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />}
                title={t("answerTitle")}
                text={t("answerText")}
              />
              <RuleItem
                icon={<img src={sombreroIcon} alt="Sombréro" className="w-8 h-8 sm:w-10 sm:h-10" />}
                title={t("sombreroTitle")}
                text={t("sombreroText")}
              />
              <RuleItem
                icon={<SkullIcon className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />}
                title={t("wolfTitle")}
                text={t("wolfText")}
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
        title={t("indexGameSeoTitle")}
        intro={t("indexGameSeoIntro")}
        sampleWords={[
          { german: "der Tisch", translation: lang === "ko" ? "테이블" : "stůl" },
          { german: "die Katze", translation: lang === "ko" ? "고양이" : "kočka" },
          { german: "das Haus", translation: lang === "ko" ? "집" : "dům" },
          { german: "der Hund", translation: lang === "ko" ? "개" : "pes" },
          { german: "die Blume", translation: lang === "ko" ? "꽃" : "květina" },
          { german: "das Buch", translation: lang === "ko" ? "책" : "kniha" },
          { german: "der Stuhl", translation: lang === "ko" ? "의자" : "židle" },
          { german: "die Lampe", translation: lang === "ko" ? "램프" : "lampa" },
          { german: "das Auto", translation: lang === "ko" ? "자동차" : "auto" },
          { german: "der Baum", translation: lang === "ko" ? "나무" : "strom" },
        ]}
        faqs={[
          { q: t("indexFaq1q"), a: t("indexFaq1a") },
          { q: t("indexFaq2q"), a: t("indexFaq2a") },
          { q: t("indexFaq3q"), a: t("indexFaq3a") },
        ]}
      />

      {/* SEO pillar content */}
      <section className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8 font-body text-muted-foreground text-sm sm:text-base leading-relaxed">
        <div>
          <h2 className="font-game text-lg sm:text-xl text-foreground mb-2">{t("indexSeoTitle1")}</h2>
          <p>{t("indexSeoP1a")}</p>
          <p className="mt-2">{t("indexSeoP1b")}</p>
        </div>

        <div>
          <h3 className="font-game text-base text-foreground mb-2">{t("indexSeoTitle2")}</h3>
          <p>{t("indexSeoP2")}</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>{t("indexSeoLi2a")}</li>
            <li>{t("indexSeoLi2b")}</li>
            <li>{t("indexSeoLi2c")}</li>
            <li>{t("indexSeoLi2d")}</li>
          </ul>
          <p className="mt-2">{t("indexSeoP2b")}</p>
        </div>

        <div>
          <h3 className="font-game text-base text-foreground mb-2">{t("indexSeoTitle3")}</h3>
          <p>{t("indexSeoP3")}</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>{t("indexSeoLi3a")}</li>
            <li>{t("indexSeoLi3b")}</li>
            <li>{t("indexSeoLi3c")}</li>
            <li>{t("indexSeoLi3d")}</li>
            <li>{t("indexSeoLi3e")}</li>
          </ul>
          <p className="mt-2">{t("indexSeoP3b")}</p>
        </div>

        <div>
          <h3 className="font-game text-base text-foreground mb-2">{t("indexSeoTitle4")}</h3>
          <p>{t("indexSeoP4")}</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>{t("indexSeoLi4a")}</li>
            <li>{t("indexSeoLi4b")}</li>
            <li>{t("indexSeoLi4c")}</li>
            <li>{t("indexSeoLi4d")}</li>
          </ul>
          <p className="mt-2">{t("indexSeoP4b")}</p>
        </div>

        <div>
          <h3 className="font-game text-base text-foreground mb-2">{t("indexSeoTitle5")}</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>{t("indexSeoLi5a")}</li>
            <li>{t("indexSeoLi5b")}</li>
            <li>{t("indexSeoLi5c")}</li>
            <li>{t("indexSeoLi5d")}</li>
          </ul>
          <p className="mt-2">{t("indexSeoP5")}</p>
        </div>

        <div>
          <h3 className="font-game text-base text-foreground mb-2">{t("indexSeoTitle6")}</h3>
          <p>{t("indexSeoP6a")}</p>
          <p className="mt-2 text-foreground font-semibold">{t("indexSeoP6b")}</p>
        </div>
      </section>
    </>
  );
};

export default Index;
