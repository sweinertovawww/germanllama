import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { STORIES, getStoryTitle } from "@/data/beginnerStories";
import { useLanguage } from "@/contexts/LanguageContext";

const SentenceStructureList = () => {
  const { t, lang } = useLanguage();

  return (
    <>
      <SEOHead
        title={`${t("categorySentenceStructure")} | ${t("beginnerName")} | GermanLlama`}
        description={t("sentenceStructureListDesc")}
        canonical="/start-from-beginning/sentence-structure"
      />
      <section className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <Link
          to="/start-from-beginning"
          className="inline-flex items-center gap-1.5 font-body text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t("back")}
        </Link>

        <h1 className="font-game text-lg sm:text-xl text-foreground mb-2">{t("categorySentenceStructure")}</h1>
        <p className="font-body text-muted-foreground text-xs sm:text-sm mb-5">{t("sentenceStructureListDesc")}</p>

        <div className="space-y-3">
          {STORIES.map((story) => (
            <Link
              key={story.id}
              to={`/start-from-beginning/sentence-structure/${story.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-accent/30 bg-gradient-to-r from-accent/5 to-accent/10 hover:border-accent/60 hover:bg-accent/10 transition-all"
            >
              <span className="text-2xl shrink-0">🦙</span>
              <div className="flex-1 min-w-0">
                <span className="font-game text-xs sm:text-sm text-foreground block">{getStoryTitle(story, lang)}</span>
                <span className="font-body text-[10px] sm:text-xs text-muted-foreground">
                  {t("sentencesCountLabel", { count: story.sentences.length })}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-accent/60" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default SentenceStructureList;
