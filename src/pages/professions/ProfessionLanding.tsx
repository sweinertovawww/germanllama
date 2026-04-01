import { Link, useParams, Navigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import GameSEOContent from "@/components/GameSEOContent";
import { PROFESSION_LIST, type Profession, QUESTIONS, FILL_QUESTIONS, getAllFlashCards } from "@/game/vocabularyData";
import { Gamepad2, Layers, Brain, PuzzleIcon } from "lucide-react";

interface ProfessionPageData {
  professionId: Profession;
  title: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
  tips: string[];
}

const PAGES: Record<string, ProfessionPageData> = {
  skladnik: {
    professionId: "obecné",
    title: "Skladník",
    metaTitle: "Němčina pro skladníky – slovíčka a fráze zdarma",
    metaDesc: "Nauč se německá slovíčka pro práci ve skladu. Regál, paleta, dodávka – vše hrou. Bez registrace, 10 minut denně.",
    h1: "Němčina pro skladníky",
    intro: "Pracuješ ve skladu v Německu? Nauč se slovíčka, která uslyšíš každý den – od regálů a palet po pokyny šéfa. Vše hrou a zdarma.",
    tips: [
      "Začni s kartičkami a nauč se základní slovíčka pro sklad",
      "Přejdi na Llama Run a procvič členy (der Gabelstapler, das Regal...)",
      "Ve skládání vět se naučíš praktické pokyny šéfa",
    ],
  },
  automechanik: {
    professionId: "automechanik",
    title: "Automechanik",
    metaTitle: "Němčina pro automechaniky – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro autoservis a dílnu. Motor, brzdy, výfuk – nauč se hrou. Bez registrace.",
    h1: "Němčina pro automechaniky",
    intro: "Pracuješ v autoservisu v Německu nebo Rakousku? Nauč se názvy dílů, nářadí a fráze pro komunikaci se zákazníky i kolegy.",
    tips: [
      "Kartičky ti pomohou s názvy autodílů a nářadí",
      "V Llama Run procvičíš členy – der Motor, die Bremse, das Getriebe",
      "Skládání vět tě naučí komunikovat se zákazníky",
    ],
  },
  stavba: {
    professionId: "zedník",
    title: "Na stavbě",
    metaTitle: "Němčina na stavbě – slovíčka pro zedníky zdarma",
    metaDesc: "Německá slovíčka pro stavbu. Materiály, nářadí, bezpečnost práce – nauč se hrou. Bez registrace.",
    h1: "Němčina na stavbě",
    intro: "Stavba v Německu? Nauč se slovíčka pro materiály, nářadí a bezpečnost práce. Komunikuj s parťákem i stavbyvedoucím.",
    tips: [
      "Začni s kartičkami na stavební materiály a nářadí",
      "V pexesu si zapamatuješ dvojice německy-česky",
      "Skládání vět tě připraví na pokyny na stavbě",
    ],
  },
  gastro: {
    professionId: "gastro",
    title: "Gastro",
    metaTitle: "Němčina pro gastro – slovíčka pro kuchaře a číšníky",
    metaDesc: "Německá slovíčka pro restauraci a kuchyni. Objednávky, jídlo, nápoje – nauč se hrou. Zdarma.",
    h1: "Němčina pro gastro",
    intro: "Pracuješ v restauraci, hotelu nebo kuchyni? Nauč se objednávky, jídelní lístek, komunikaci s hosty i kolegy v kuchyni.",
    tips: [
      "Kartičky na jídlo, nápoje a kuchyňské vybavení",
      "Llama Run ti pomůže s členy – der Teller, die Gabel, das Messer",
      "Skládání vět simuluje reálné objednávky hostů",
    ],
  },
  sestra: {
    professionId: "sestřička",
    title: "Zdravotní sestra",
    metaTitle: "Němčina pro zdravotní sestry – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro zdravotnictví. Pacienti, léky, vyšetření – nauč se hrou. Bez registrace.",
    h1: "Němčina pro zdravotní sestry",
    intro: "Pracuješ ve zdravotnictví v Německu? Nauč se komunikovat s pacienty, lékaři a kolegy. Slovíčka pro péči, léky a vyšetření.",
    tips: [
      "Začni s kartičkami na zdravotnické pojmy",
      "V Llama Run procvičíš členy – der Patient, die Spritze, das Medikament",
      "Skládání vět tě naučí mluvit s pacienty",
    ],
  },
};

const ProfessionLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? PAGES[slug] : undefined;

  if (!page) return <Navigate to="/nemcina-do-prace" replace />;

  const prof = PROFESSION_LIST.find(p => p.id === page.professionId);
  const allCards = getAllFlashCards();
  const profCards = allCards.filter(c => c.profession === page.professionId);
  const questionCount = QUESTIONS.filter(q => q.profession === page.professionId).length;
  const sentenceCount = FILL_QUESTIONS.filter(q => q.profession === page.professionId).length;
  const sampleWords = profCards.slice(0, 10).map(v => ({ german: v.german, czech: v.czech }));
  const totalVocab = profCards.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.metaTitle,
    description: page.metaDesc,
    url: `https://germanllama.lovable.app/nemcina-do-prace/${slug}`,
  };

  return (
    <>
      <SEOHead
        title={page.metaTitle}
        description={page.metaDesc}
        canonical={`/nemcina-do-prace/${slug}`}
        jsonLd={jsonLd}
      />

      <section className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <nav className="font-body text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Domů</Link>
          {" › "}
          <Link to="/nemcina-do-prace" className="hover:text-primary">Němčina do práce</Link>
          {" › "}
          <span className="text-foreground">{page.title}</span>
        </nav>

        <h1 className="font-game text-2xl sm:text-3xl text-foreground mb-3 flex items-center gap-3">
          {prof?.emoji && <span className="text-3xl">{prof.emoji}</span>}
          {page.h1}
        </h1>

        <p className="font-body text-base text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          {page.intro}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <span className="font-game text-xl text-primary block">{totalVocab}</span>
            <span className="font-body text-xs text-muted-foreground">Slovíček</span>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <span className="font-game text-xl text-primary block">{sentenceCount}</span>
            <span className="font-body text-xs text-muted-foreground">Vět</span>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <span className="font-game text-xl text-primary block">4</span>
            <span className="font-body text-xs text-muted-foreground">Hry</span>
          </div>
        </div>

        {/* Tips */}
        <h2 className="font-game text-lg text-foreground mb-3">Jak začít?</h2>
        <ol className="font-body text-sm text-muted-foreground space-y-2 mb-8 list-decimal list-inside">
          {page.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ol>

        {/* Game links */}
        <h2 className="font-game text-lg text-foreground mb-4">Vyzkoušej hry</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { to: "/", icon: <Gamepad2 className="w-6 h-6" />, label: "Llama Run" },
            { to: "/flashcards", icon: <Layers className="w-6 h-6" />, label: "Flash Cards" },
            { to: "/pexeso", icon: <Brain className="w-6 h-6" />, label: "Pexeso" },
            { to: "/skladani-vet", icon: <PuzzleIcon className="w-6 h-6" />, label: "Skládání vět" },
          ].map((game) => (
            <Link
              key={game.to}
              to={game.to}
              className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/50 transition-all"
            >
              <div className="text-primary mx-auto mb-2">{game.icon}</div>
              <span className="font-game text-sm text-foreground">{game.label}</span>
            </Link>
          ))}
        </div>

        {/* SEO content */}
        {sampleWords.length > 0 && (
          <GameSEOContent
            title={`Co se naučíš – ${page.title}`}
            intro={`Ukázka slovíček z kategorie ${page.title.toLowerCase()}, která najdeš ve všech hrách.`}
            sampleWords={sampleWords}
            faqs={[
              { q: "Potřebuji se registrovat?", a: "Ne, všechny hry jsou zdarma a bez registrace. Stačí vybrat profesi a začít hrát." },
              { q: "Kolik času denně potřebuji?", a: "Stačí 10 minut denně. Pravidelnost je důležitější než délka učení." },
              { q: `Kolik slovíček tu je pro profesi ${page.title.toLowerCase()}?`, a: `Aktuálně máme ${vocabItems.length || questionCount} slovíček a ${sentenceCount} vět pro tuto profesi.` },
            ]}
          />
        )}

        {/* Back link */}
        <div className="mt-8 pt-6 border-t border-border">
          <Link to="/nemcina-do-prace" className="font-body text-sm text-primary hover:underline">
            ← Zpět na přehled profesí
          </Link>
        </div>
      </section>
    </>
  );
};

export default ProfessionLanding;
