import SEOHead from "@/components/SEOHead";
import ScrabbleGame from "@/game/scrabble/ScrabbleGame";

const Scrabble = () => {
  return (
    <>
      <SEOHead
        title="Scrabble – křížovka ze slovíček | GermanLlama"
        description="Skládej německá slovíčka do křížovky. Přetahuj písmena a procvičuj slovní zásobu hravě."
        canonical="/scrabble"
      />
      <section className="py-4 sm:py-6 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto text-center mb-4">
          <h1 className="font-game text-xl sm:text-2xl text-foreground">Scrabble</h1>
          <p className="font-body text-sm text-muted-foreground">Křížovka ze slovíček</p>
        </div>
        <ScrabbleGame />
      </section>
    </>
  );
};

export default Scrabble;
