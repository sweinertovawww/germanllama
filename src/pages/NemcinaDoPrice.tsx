import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { PROFESSION_LIST } from "@/game/vocabularyData";
import { Gamepad2, Layers, Brain, PuzzleIcon, ArrowRight } from "lucide-react";

const professionPages: Record<string, { slug: string; description: string }> = {
  automechanik: { slug: "automechanik", description: "Slovíčka a fráze pro práci v autoservisu a dílně." },
  zedník: { slug: "stavba", description: "Němčina na stavbě – materiály, nářadí, bezpečnost práce." },
  gastro: { slug: "gastro", description: "Objednávky, jídelní lístek, komunikace v kuchyni a restauraci." },
  sestřička: { slug: "sestra", description: "Komunikace s pacienty, lékaři a kolegy ve zdravotnictví." },
  pokladní: { slug: "pokladni", description: "Platby, reklamace a zákaznický servis německy." },
};

const NemcinaDoPrice = () => {
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
          Němčina do práce – vyberte si profesi
        </h1>
        <p className="font-body text-base text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          Pracujete v Německu, Rakousku nebo Švýcarsku? Vyberte si svou profesi a naučte se přesně ta slovíčka a fráze,
          která potřebujete v práci každý den. Stačí 10 minut denně.
        </p>

        {/* Profession grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {PROFESSION_LIST.filter(p => p.id !== "obecné").map((prof) => {
            const page = professionPages[prof.id];
            const content = (
              <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{prof.emoji}</span>
                  <h2 className="font-game text-base text-foreground">{prof.label}</h2>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {page?.description || `Německá slovíčka a fráze pro profesi ${prof.label.toLowerCase()}.`}
                </p>
                {page && (
                  <span className="inline-flex items-center gap-1 mt-3 text-sm font-body text-primary font-semibold">
                    Zobrazit detail <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            );

            if (page) {
              return (
                <Link key={prof.id} to={`/nemcina-do-prace/${page.slug}`}>
                  {content}
                </Link>
              );
            }
            return <div key={prof.id}>{content}</div>;
          })}
        </div>

        {/* Games section */}
        <h2 className="font-game text-xl text-foreground mb-4">Jak se učit?</h2>
        <p className="font-body text-sm text-muted-foreground mb-6 max-w-xl">
          Vyberte profesi a procvičujte slovíčka ve 4 různých hrách. Žádná registrace, žádné platby – jen vy a němčina.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: "/", icon: <Gamepad2 className="w-6 h-6" />, label: "Llama Run", desc: "Skákej a odpovídej" },
            { to: "/flashcards", icon: <Layers className="w-6 h-6" />, label: "Flash Cards", desc: "Kartičky na překlad" },
            { to: "/pexeso", icon: <Brain className="w-6 h-6" />, label: "Pexeso", desc: "Paměťová hra" },
            { to: "/skladani-vet", icon: <PuzzleIcon className="w-6 h-6" />, label: "Skládání vět", desc: "Přiřaď konce vět" },
          ].map((game) => (
            <Link
              key={game.to}
              to={game.to}
              className="bg-muted border border-border rounded-xl p-4 text-center hover:border-primary/50 transition-all"
            >
              <div className="text-primary mx-auto mb-2">{game.icon}</div>
              <span className="font-game text-sm text-foreground block">{game.label}</span>
              <span className="font-body text-xs text-muted-foreground">{game.desc}</span>
            </Link>
          ))}
        </div>

        {/* Internal linking text */}
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="font-game text-lg text-foreground mb-3">Proč se učit němčinu do práce?</h2>
          <div className="font-body text-sm text-muted-foreground space-y-3 leading-relaxed max-w-2xl">
            <p>
              Tisíce Čechů pracují v Německu a Rakousku v oborech jako skladnictví, stavebnictví, gastronomie nebo zdravotnictví.
              Základní komunikace s šéfem a kolegy je klíčová pro kariérní postup i každodenní pohodlí.
            </p>
            <p>
              Na GermanLlama se učíte přesně ta slovíčka, která uslyšíte v práci – ne abstraktní gramatiku z učebnic.
              Naše hry jsou navržené tak, aby vám stačilo 10 minut denně a výsledky se dostavily rychle.
            </p>
            <p>
              Začněte s <Link to="/flashcards" className="text-primary underline">kartičkami</Link> pro základní slovní zásobu,
              pak přejděte na <Link to="/" className="text-primary underline">Llama Run</Link> pro testování členů
              a <Link to="/skladani-vet" className="text-primary underline">skládání vět</Link> pro praktické fráze.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default NemcinaDoPrice;
