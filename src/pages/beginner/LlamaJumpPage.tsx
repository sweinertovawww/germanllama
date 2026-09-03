import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUp, Star, Heart } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { getStory } from "@/data/beginnerStories";
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

  return (
    <>
      <SEOHead
        title={`Llama Jump — ${story?.title ?? "Vocabulary"} | GermanLlama`}
        description="Jump onto the correct German word to practice vocabulary from the story."
        canonical={`/start-from-beginning/sentence-structure/${storyId}/llama-jump`}
      />
      <section className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Link
          to={storyId ? `/start-from-beginning/sentence-structure/${storyId}` : "/start-from-beginning/sentence-structure"}
          className="inline-flex items-center gap-1.5 font-body text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Story
        </Link>
        <h1 className="font-game text-sm sm:text-lg text-foreground mb-3">🦙 Llama Jump</h1>

        <div className="mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-2xl px-4 sm:px-8 py-2 sm:py-2.5 text-center">
            <h2 className="font-game text-base sm:text-xl font-bold">Game Rules</h2>
          </div>
          <div className="bg-muted rounded-b-2xl border border-t-0 border-border px-4 sm:px-8 py-3 sm:py-4 shadow-sm">
            <div className="space-y-2 sm:space-y-2.5">
              <RuleItem
                icon={<ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                title="Jump"
                text="Press ↑ / Space, or tap JUMP, to hop from one platform to the next. Don't fall in the gaps!"
              />
              <RuleItem
                icon={<img src={sombreroIcon} alt="Sombréro" className="w-8 h-8 sm:w-10 sm:h-10" />}
                title="Collect sombreros"
                text="Land on one to fill in a short A1 German phrase for bonus points."
              />
              <RuleItem
                icon={<Star className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />}
                title="Collect stars"
                text="Grab one mid-jump to answer a der/die/das article quiz for bonus points."
              />
              <RuleItem
                icon={<Heart className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />}
                title="3 lives"
                text="Missing a platform costs a life — unless a rare trampoline happens to bounce you back up!"
              />
            </div>
          </div>
        </div>

        {storyId ? <LlamaJump storyId={storyId} /> : <p className="text-muted-foreground text-sm">Story not found.</p>}
      </section>
    </>
  );
};

export default LlamaJumpPage;
