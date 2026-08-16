import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { getStory } from "@/data/beginnerStories";
import LlamaJump from "@/game/LlamaJump";

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
        {storyId ? <LlamaJump storyId={storyId} /> : <p className="text-muted-foreground text-sm">Story not found.</p>}
      </section>
    </>
  );
};

export default LlamaJumpPage;
