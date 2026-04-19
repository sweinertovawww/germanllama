import { Link, useParams, Navigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import GameSEOContent from "@/components/GameSEOContent";
import { PROFESSION_LIST, type Profession, FILL_QUESTIONS, getAllFlashCards } from "@/game/vocabularyData";
import { Gamepad2, Layers, Brain, PuzzleIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfessionPageData {
  professionId: Profession;
  title: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  h1Ko: string;
  intro: string;
  introKo: string;
  tips: string[];
  tipsKo: string[];
}

const PAGES: Record<string, ProfessionPageData> = {
  skladnik: {
    professionId: "obecné",
    title: "Skladník",
    metaTitle: "Němčina pro skladníky – slovíčka a fráze zdarma",
    metaDesc: "Nauč se německá slovíčka pro práci ve skladu. Regál, paleta, dodávka – vše hrou. Bez registrace, 10 minut denně.",
    h1: "Němčina pro skladníky",
    h1Ko: "창고 직원을 위한 독일어",
    intro: "Pracuješ ve skladu v Německu? Nauč se slovíčka, která uslyšíš každý den – od regálů a palet po pokyny šéfa. Vše hrou a zdarma.",
    introKo: "독일 창고에서 일하시나요? 매일 듣게 될 단어를 배우세요 – 선반과 팔레트부터 상사의 지시까지. 모두 게임으로 무료로.",
    tips: [
      "Začni s kartičkami a nauč se základní slovíčka pro sklad",
      "Přejdi na Llama Run a procvič členy (der Gabelstapler, das Regal...)",
      "Ve skládání vět se naučíš praktické pokyny šéfa",
    ],
    tipsKo: [
      "플래시 카드로 창고 기본 단어 배우기",
      "Llama Run으로 관사 연습하기 (der Gabelstapler, das Regal...)",
      "문장 조합으로 실용적인 상사 지시 배우기",
    ],
  },
  automechanik: {
    professionId: "automechanik",
    title: "Automechanik",
    metaTitle: "Němčina pro automechaniky – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro autoservis a dílnu. Motor, brzdy, výfuk – nauč se hrou. Bez registrace.",
    h1: "Němčina pro automechaniky",
    h1Ko: "자동차 정비사를 위한 독일어",
    intro: "Pracuješ v autoservisu v Německu nebo Rakousku? Nauč se názvy dílů, nářadí a fráze pro komunikaci se zákazníky i kolegy.",
    introKo: "독일이나 오스트리아 자동차 정비소에서 일하시나요? 부품명, 공구, 고객 및 동료와의 소통 표현을 배우세요.",
    tips: [
      "Kartičky ti pomohou s názvy autodílů a nářadí",
      "V Llama Run procvičíš členy – der Motor, die Bremse, das Getriebe",
      "Skládání vět tě naučí komunikovat se zákazníky",
    ],
    tipsKo: [
      "플래시 카드로 자동차 부품과 공구 이름 배우기",
      "Llama Run으로 관사 연습 – der Motor, die Bremse, das Getriebe",
      "문장 조합으로 고객과 소통하는 방법 배우기",
    ],
  },
  stavba: {
    professionId: "zedník",
    title: "Na stavbě",
    metaTitle: "Němčina na stavbě – slovíčka pro zedníky zdarma",
    metaDesc: "Německá slovíčka pro stavbu. Materiály, nářadí, bezpečnost práce – nauč se hrou. Bez registrace.",
    h1: "Němčina na stavbě",
    h1Ko: "건설 현장 독일어",
    intro: "Stavba v Německu? Nauč se slovíčka pro materiály, nářadí a bezpečnost práce. Komunikuj s parťákem i stavbyvedoucím.",
    introKo: "독일에서 건설? 재료, 공구, 안전 관련 단어를 배우세요. 동료와 현장 감독과 소통하세요.",
    tips: [
      "Začni s kartičkami na stavební materiály a nářadí",
      "V pexesu si zapamatuješ dvojice německy-česky",
      "Skládání vět tě připraví na pokyny na stavbě",
    ],
    tipsKo: [
      "플래시 카드로 건설 재료와 공구 배우기",
      "메모리 게임으로 독일어-한국어 쌍 기억하기",
      "문장 조합으로 건설 현장 지시 준비하기",
    ],
  },
  gastro: {
    professionId: "gastro",
    title: "Gastro",
    metaTitle: "Němčina pro gastro – slovíčka pro kuchaře a číšníky",
    metaDesc: "Německá slovíčka pro restauraci a kuchyni. Objednávky, jídlo, nápoje – nauč se hrou. Zdarma.",
    h1: "Němčina pro gastro",
    h1Ko: "요식업을 위한 독일어",
    intro: "Pracuješ v restauraci, hotelu nebo kuchyni? Nauč se objednávky, jídelní lístek, komunikaci s hosty i kolegy v kuchyni.",
    introKo: "식당, 호텔 또는 주방에서 일하시나요? 주문, 메뉴, 손님과 주방 동료와의 소통 표현을 배우세요.",
    tips: [
      "Kartičky na jídlo, nápoje a kuchyňské vybavení",
      "Llama Run ti pomůže s členy – der Teller, die Gabel, das Messer",
      "Skládání vět simuluje reálné objednávky hostů",
    ],
    tipsKo: [
      "음식, 음료, 주방 용품 플래시 카드",
      "Llama Run으로 관사 연습 – der Teller, die Gabel, das Messer",
      "문장 조합으로 실제 손님 주문 시뮬레이션",
    ],
  },
  sestra: {
    professionId: "sestřička",
    title: "Zdravotní sestra",
    metaTitle: "Němčina pro zdravotní sestry – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro zdravotnictví. Pacienti, léky, vyšetření – nauč se hrou. Bez registrace.",
    h1: "Němčina pro zdravotní sestry",
    h1Ko: "의료 직원을 위한 독일어",
    intro: "Pracuješ ve zdravotnictví v Německu? Nauč se komunikovat s pacienty, lékaři a kolegy. Slovíčka pro péči, léky a vyšetření.",
    introKo: "독일 의료 분야에서 일하시나요? 환자, 의사, 동료와 소통하는 방법을 배우세요. 돌봄, 약물, 검사 관련 단어.",
    tips: [
      "Začni s kartičkami na zdravotnické pojmy",
      "V Llama Run procvičíš členy – der Patient, die Spritze, das Medikament",
      "Skládání vět tě naučí mluvit s pacienty",
    ],
    tipsKo: [
      "플래시 카드로 의료 용어 배우기",
      "Llama Run으로 관사 연습 – der Patient, die Spritze, das Medikament",
      "문장 조합으로 환자와 대화하는 방법 배우기",
    ],
  },
  truhlar: {
    professionId: "truhlář",
    title: "Truhlář",
    metaTitle: "Němčina pro truhláře – slovíčka a fráze zdarma",
    metaDesc: "Německá slovíčka pro truhlářskou dílnu. Dřevo, nástroje, povrchy – nauč se hrou. Bez registrace.",
    h1: "Němčina pro truhláře",
    h1Ko: "목수를 위한 독일어",
    intro: "Pracuješ v truhlářské dílně v Německu? Nauč se názvy dřevin, nástrojů, spojovacího materiálu a fráze pro komunikaci se zákazníky.",
    introKo: "독일 목공 작업장에서 일하시나요? 목재, 공구, 연결 재료 이름과 고객 소통 표현을 배우세요.",
    tips: [
      "Kartičky tě naučí názvy nářadí a materiálů",
      "V Llama Run procvičíš členy – der Hobel, die Säge, das Brett",
      "Skládání vět tě připraví na zakázky a komunikaci",
    ],
    tipsKo: [
      "플래시 카드로 공구와 재료 이름 배우기",
      "Llama Run으로 관사 연습 – der Hobel, die Säge, das Brett",
      "문장 조합으로 작업 의뢰와 소통 준비하기",
    ],
  },
  instalater: {
    professionId: "instalatér",
    title: "Instalatér",
    metaTitle: "Němčina pro instalatéry – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro instalatéry. Potrubí, ventily, kotel – nauč se hrou. Bez registrace.",
    h1: "Němčina pro instalatéry",
    h1Ko: "배관공을 위한 독일어",
    intro: "Montáže v Německu? Nauč se slovíčka pro potrubí, armatury, topení a komunikaci se zákazníky i kolegy na stavbě.",
    introKo: "독일에서 설치 작업? 배관, 피팅, 난방 관련 단어와 고객 및 동료와의 소통 표현을 배우세요.",
    tips: [
      "Začni s kartičkami na instalatérské názvosloví",
      "V Llama Run procvičíš členy – der Hahn, die Leitung, das Ventil",
      "Skládání vět tě naučí jednat se zákazníky",
    ],
    tipsKo: [
      "플래시 카드로 배관 용어 배우기",
      "Llama Run으로 관사 연습 – der Hahn, die Leitung, das Ventil",
      "문장 조합으로 고객 응대 방법 배우기",
    ],
  },
  elektrikar: {
    professionId: "elektrikář",
    title: "Elektrikář",
    metaTitle: "Němčina pro elektrikáře – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro elektrikáře. Kabely, jističe, zásuvky – nauč se hrou. Bez registrace.",
    h1: "Němčina pro elektrikáře",
    h1Ko: "전기 기사를 위한 독일어",
    intro: "Pracuješ jako elektrikář v Německu? Nauč se názvy komponentů, nástrojů a fráze pro bezpečnost práce.",
    introKo: "독일에서 전기 기사로 일하시나요? 부품, 공구 이름과 안전 작업 표현을 배우세요.",
    tips: [
      "Kartičky na elektroinstalační materiál a nářadí",
      "V Llama Run procvičíš členy – der Schalter, die Sicherung, das Kabel",
      "Skládání vět tě připraví na komunikaci na stavbě",
    ],
    tipsKo: [
      "플래시 카드로 전기 재료와 공구 배우기",
      "Llama Run으로 관사 연습 – der Schalter, die Sicherung, das Kabel",
      "문장 조합으로 건설 현장 소통 준비하기",
    ],
  },
  pokladni: {
    professionId: "pokladní",
    title: "Pokladní",
    metaTitle: "Němčina pro pokladní – slovíčka a fráze zdarma",
    metaDesc: "Německá slovíčka pro práci za pokladnou. Platby, reklamace, zákazníci – nauč se hrou. Zdarma.",
    h1: "Němčina pro pokladní",
    h1Ko: "계산원을 위한 독일어",
    intro: "Pracuješ za pokladnou v Německu? Nauč se fráze pro obsluhu zákazníků, reklamace, platby a každodenní komunikaci.",
    introKo: "독일에서 계산원으로 일하시나요? 고객 응대, 환불, 결제, 일상 소통 표현을 배우세요.",
    tips: [
      "Kartičky tě naučí základní fráze pro zákazníky",
      "V Llama Run procvičíš členy – der Kassenbon, die Karte, das Wechselgeld",
      "Skládání vět simuluje reálné situace u pokladny",
    ],
    tipsKo: [
      "플래시 카드로 고객 응대 기본 표현 배우기",
      "Llama Run으로 관사 연습 – der Kassenbon, die Karte, das Wechselgeld",
      "문장 조합으로 계산대 실제 상황 시뮬레이션",
    ],
  },
  uklizecka: {
    professionId: "uklízečka",
    title: "Uklízečka",
    metaTitle: "Němčina pro uklízečky – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro úklid. Čisticí prostředky, nástroje, pokyny – nauč se hrou. Bez registrace.",
    h1: "Němčina pro uklízečky",
    h1Ko: "청소부를 위한 독일어",
    intro: "Pracuješ v úklidu v Německu? Nauč se názvy čisticích prostředků, nástrojů a fráze pro komunikaci s nadřízenými.",
    introKo: "독일에서 청소 업무를 하시나요? 청소 용품, 도구 이름과 상사와의 소통 표현을 배우세요.",
    tips: [
      "Začni s kartičkami na úklidové prostředky a nástroje",
      "V Llama Run procvičíš členy – der Besen, die Seife, das Putzmittel",
      "Skládání vět tě naučí rozumět pokynům",
    ],
    tipsKo: [
      "플래시 카드로 청소 용품과 도구 배우기",
      "Llama Run으로 관사 연습 – der Besen, die Seife, das Putzmittel",
      "문장 조합으로 지시 이해하는 방법 배우기",
    ],
  },
  kancelar: {
    professionId: "kancelář",
    title: "Kancelář",
    metaTitle: "Němčina v kanceláři – slovíčka a fráze zdarma",
    metaDesc: "Německá slovíčka pro kancelář. E-maily, schůzky, telefonáty – nauč se hrou. Bez registrace.",
    h1: "Němčina v kanceláři",
    h1Ko: "사무실 독일어",
    intro: "Pracuješ v kanceláři v Německu? Nauč se fráze pro e-maily, schůzky, telefonáty a komunikaci s kolegy.",
    introKo: "독일 사무실에서 일하시나요? 이메일, 회의, 전화 통화와 동료와의 소통 표현을 배우세요.",
    tips: [
      "Kartičky na kancelářskou slovní zásobu",
      "V Llama Run procvičíš členy – der Drucker, die Besprechung, das Dokument",
      "Skládání vět tě naučí psát e-maily a vést jednání",
    ],
    tipsKo: [
      "플래시 카드로 사무실 어휘 배우기",
      "Llama Run으로 관사 연습 – der Drucker, die Besprechung, das Dokument",
      "문장 조합으로 이메일 쓰기와 협상 배우기",
    ],
  },
  zahradnik: {
    professionId: "zahradník",
    title: "Zahradník",
    metaTitle: "Němčina pro zahradníky – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro zahradnictví. Rostliny, nářadí, práce na zahradě – nauč se hrou. Zdarma.",
    h1: "Němčina pro zahradníky",
    h1Ko: "정원사를 위한 독일어",
    intro: "Pracuješ v zahradnictví v Německu? Nauč se názvy rostlin, nářadí a fráze pro komunikaci se zákazníky i kolegy.",
    introKo: "독일 원예 업계에서 일하시나요? 식물, 도구 이름과 고객 및 동료와의 소통 표현을 배우세요.",
    tips: [
      "Začni s kartičkami na rostliny a zahradní nářadí",
      "V Llama Run procvičíš členy – der Rasen, die Pflanze, das Beet",
      "Skládání vět tě připraví na zakázky zákazníků",
    ],
    tipsKo: [
      "플래시 카드로 식물과 정원 도구 배우기",
      "Llama Run으로 관사 연습 – der Rasen, die Pflanze, das Beet",
      "문장 조합으로 고객 주문 준비하기",
    ],
  },
  ucitel: {
    professionId: "učitel",
    title: "Učitel",
    metaTitle: "Němčina pro učitele – slovíčka a fráze zdarma",
    metaDesc: "Německá slovíčka pro učitele. Škola, třída, vyučování – nauč se hrou. Bez registrace.",
    h1: "Němčina pro učitele",
    h1Ko: "교사를 위한 독일어",
    intro: "Učíš v Německu nebo plánuješ? Nauč se slovíčka pro školu, vyučování a komunikaci s rodiči, žáky i kolegy.",
    introKo: "독일에서 가르치거나 계획 중이신가요? 학교, 수업, 부모님, 학생, 동료와의 소통 단어를 배우세요.",
    tips: [
      "Kartičky na školní slovní zásobu",
      "V Llama Run procvičíš členy – der Schüler, die Tafel, das Zeugnis",
      "Skládání vět tě naučí komunikovat s rodiči",
    ],
    tipsKo: [
      "플래시 카드로 학교 어휘 배우기",
      "Llama Run으로 관사 연습 – der Schüler, die Tafel, das Zeugnis",
      "문장 조합으로 부모님과 소통하는 방법 배우기",
    ],
  },
  kadernik: {
    professionId: "kadeřník",
    title: "Kadeřník",
    metaTitle: "Němčina pro kadeřníky – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro kadeřnictví. Střih, barvení, péče o vlasy – nauč se hrou. Bez registrace.",
    h1: "Němčina pro kadeřníky",
    h1Ko: "미용사를 위한 독일어",
    intro: "Pracuješ v kadeřnictví v Německu? Nauč se fráze pro komunikaci se zákazníky – od konzultace po placení.",
    introKo: "독일 미용실에서 일하시나요? 상담부터 결제까지 고객과 소통하는 표현을 배우세요.",
    tips: [
      "Kartičky tě naučí názvy procedur a nástrojů",
      "V Llama Run procvičíš členy – der Föhn, die Schere, das Shampoo",
      "Skládání vět simuluje rozhovor se zákazníkem",
    ],
    tipsKo: [
      "플래시 카드로 시술과 도구 이름 배우기",
      "Llama Run으로 관사 연습 – der Föhn, die Schere, das Shampoo",
      "문장 조합으로 고객과의 대화 시뮬레이션",
    ],
  },
  haseni: {
    professionId: "systemy_pro_haseni",
    title: "Systémy pro hašení",
    metaTitle: "Němčina pro hasiče – slovíčka a fráze zdarma",
    metaDesc: "Německá slovíčka pro hasičské systémy. Hasicí přístroje, potrubí, bezpečnost – nauč se hrou.",
    h1: "Němčina pro systémy hašení",
    h1Ko: "소방 시스템 독일어",
    intro: "Pracuješ s hasicími systémy v Německu? Nauč se odborné názvosloví pro instalaci, údržbu a bezpečnostní předpisy.",
    introKo: "독일에서 소방 시스템 업무를 하시나요? 설치, 유지 보수, 안전 규정을 위한 전문 용어를 배우세요.",
    tips: [
      "Začni s kartičkami na hasicí techniku",
      "V Llama Run procvičíš členy – der Feuerlöscher, die Sprinkleranlage, das Löschmittel",
      "Skládání vět tě připraví na bezpečnostní školení",
    ],
    tipsKo: [
      "플래시 카드로 소방 장비 배우기",
      "Llama Run으로 관사 연습 – der Feuerlöscher, die Sprinkleranlage, das Löschmittel",
      "문장 조합으로 안전 교육 준비하기",
    ],
  },
};

const ProfessionLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const page = slug ? PAGES[slug] : undefined;

  if (!page) return <Navigate to="/nemcina-do-prace" replace />;

  const prof = PROFESSION_LIST.find(p => p.id === page.professionId);
  const allCards = getAllFlashCards();
  const profCards = allCards.filter(c => c.profession === page.professionId);
  const sentenceCount = FILL_QUESTIONS.filter(q => q.profession === page.professionId).length;
  const sampleWords = profCards.slice(0, 10).map(v => ({ german: v.german, czech: v.czech }));
  const totalVocab = profCards.length;

  const h1 = lang === "ko" ? page.h1Ko : page.h1;
  const intro = lang === "ko" ? page.introKo : page.intro;
  const tips = lang === "ko" ? page.tipsKo : page.tips;

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
          <Link to="/" className="hover:text-primary">{t("homeLabel")}</Link>
          {" › "}
          <Link to="/nemcina-do-prace" className="hover:text-primary">{t("nemcinaWork")}</Link>
          {" › "}
          <span className="text-foreground">{page.title}</span>
        </nav>

        <h1 className="font-game text-2xl sm:text-3xl text-foreground mb-3 flex items-center gap-3">
          {prof?.emoji && <span className="text-3xl">{prof.emoji}</span>}
          {h1}
        </h1>

        <p className="font-body text-base text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          {intro}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <span className="font-game text-xl text-primary block">{totalVocab}</span>
            <span className="font-body text-xs text-muted-foreground">{t("vocabularyLabel")}</span>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <span className="font-game text-xl text-primary block">{sentenceCount}</span>
            <span className="font-body text-xs text-muted-foreground">{t("sentencesLabel")}</span>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <span className="font-game text-xl text-primary block">4</span>
            <span className="font-body text-xs text-muted-foreground">{t("gamesLabel")}</span>
          </div>
        </div>

        {/* Tips */}
        <h2 className="font-game text-lg text-foreground mb-3">{t("howToStart")}</h2>
        <ol className="font-body text-sm text-muted-foreground space-y-2 mb-8 list-decimal list-inside">
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ol>

        {/* Game links */}
        <h2 className="font-game text-lg text-foreground mb-4">{t("tryGames")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { to: "/", icon: <Gamepad2 className="w-6 h-6" />, label: "Llama Run" },
            { to: "/flashcards", icon: <Layers className="w-6 h-6" />, label: "Flash Cards" },
            { to: "/pexeso", icon: <Brain className="w-6 h-6" />, label: lang === "ko" ? "메모리" : "Pexeso" },
            { to: "/skladani-vet", icon: <PuzzleIcon className="w-6 h-6" />, label: t("sentenceBuilderName") },
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
            title={t("profLandingVocabTitle", { title: page.title })}
            intro={t("profLandingVocabIntro", { title: page.title.toLowerCase() })}
            sampleWords={sampleWords}
            faqs={[
              { q: t("profLandingFaq1q"), a: t("profLandingFaq1a") },
              { q: t("profLandingFaq2q"), a: t("profLandingFaq2a") },
              {
                q: t("profLandingFaq3q", { title: page.title.toLowerCase() }),
                a: t("profLandingFaq3a", { vocab: String(totalVocab), sentences: String(sentenceCount) }),
              },
            ]}
          />
        )}

        {/* Back link */}
        <div className="mt-8 pt-6 border-t border-border">
          <Link to="/nemcina-do-prace" className="font-body text-sm text-primary hover:underline">
            {t("backToProfessions")}
          </Link>
        </div>
      </section>
    </>
  );
};

export default ProfessionLanding;
