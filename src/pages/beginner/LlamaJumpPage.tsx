import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUp, Star, Heart } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { getStory, getStoryTitle } from "@/data/beginnerStories";
import { useLanguage } from "@/contexts/LanguageContext";
import LlamaJump from "@/game/LlamaJump";
import sombreroIcon from "@/assets/sombrero-icon.png";

function RuleItem({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
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

const LlamaJumpPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const story = storyId ? getStory(storyId) : undefined;
  const { t, lang } = useLanguage();

  return (
    <>
      <SEOHead
        title={`Llama Jump — ${story ? getStoryTitle(story, lang) : "Vocabulary"} | GermanLlama`}
        description={t("llamaJumpSeoDesc")}
        canonical={`/start-from-beginning/sentence-structure/${storyId}/llama-jump`}
      />
      <section className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Link
          to={storyId ? `/start-from-beginning/sentence-structure/${storyId}` : "/start-from-beginning/sentence-structure"}
          className="inline-flex items-center gap-1.5 font-body text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t("backToStory")}
        </Link>
        <h1 className="font-game text-sm sm:text-lg text-foreground mb-3">🦙 Llama Jump</h1>

        <div className="mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-2xl px-4 sm:px-8 py-2 sm:py-2.5 text-center">
            <h2 className="font-game text-base sm:text-xl font-bold">{t("gameRules")}</h2>
          </div>
          <div className="bg-muted rounded-b-2xl border border-t-0 border-border px-4 sm:px-8 py-3 sm:py-4 shadow-sm">
            <div className="space-y-2 sm:space-y-2.5">
              <RuleItem
                icon={<ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                title={t("ruleJumpTitle")}
                text={t("ruleJumpText")}
              />
              <RuleItem
                icon={<img src={sombreroIcon} alt="Sombréro" className="w-8 h-8 sm:w-10 sm:h-10" />}
                title={t("ruleSombreroTitle")}
                text={t("ruleSombreroText")}
              />
              <RuleItem
                icon={<Star className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />}
                title={t("ruleStarTitle")}
                text={t("ruleStarText")}
              />
              <RuleItem
                icon={<Heart className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />}
                title={t("ruleLivesTitle")}
                text={t("ruleLivesText")}
              />
            </div>
          </div>
        </div>

        {storyId ? <LlamaJump storyId={storyId} /> : <p className="text-muted-foreground text-sm">{t("storyNotFound")}</p>}
      </section>
    </>
  );
};

export default LlamaJumpPage;
