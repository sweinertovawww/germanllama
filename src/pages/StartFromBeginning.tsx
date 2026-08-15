import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const CATEGORIES = [
  {
    id: "sentence-structure",
    title: "Sentence Structure",
    desc: "Learn German word order through short bilingual stories.",
    path: "/start-from-beginning/sentence-structure",
    available: true,
  },
  {
    id: "verbs",
    title: "Verbs",
    desc: "Coming soon.",
    path: null,
    available: false,
  },
  {
    id: "articles",
    title: "Articles",
    desc: "Coming soon.",
    path: null,
    available: false,
  },
];

const StartFromBeginning = () => {
  return (
    <>
      <SEOHead
        title="Start German From the Beginning | GermanLlama"
        description="Learn German from zero, step by step, with GermanLlama."
        canonical="/start-from-beginning"
      />
      <section className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-16 text-center">
        <span className="text-4xl">🦙</span>
        <h1 className="font-game text-xl sm:text-2xl text-foreground mt-4 mb-2">
          Start German From the Beginning
        </h1>
        <p className="font-body text-muted-foreground text-sm sm:text-base mb-8">
          Pick what you want to practice — everyday German for life and work in Germany.
        </p>

        <div className="space-y-3 text-left">
          {CATEGORIES.map((cat) =>
            cat.available && cat.path ? (
              <Link
                key={cat.id}
                to={cat.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-accent/30 bg-gradient-to-r from-accent/5 to-accent/10 hover:border-accent/60 hover:bg-accent/10 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-game text-xs sm:text-sm text-foreground block">{cat.title}</span>
                  <span className="font-body text-[10px] sm:text-xs text-muted-foreground">{cat.desc}</span>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-accent/60" />
              </Link>
            ) : (
              <div
                key={cat.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-border bg-muted/30 opacity-60"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-game text-xs sm:text-sm text-foreground block">{cat.title}</span>
                  <span className="font-body text-[10px] sm:text-xs text-muted-foreground">{cat.desc}</span>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
};

export default StartFromBeginning;
