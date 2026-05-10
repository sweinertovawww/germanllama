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
  h1En: string;
  h1Pl: string;
  h1Uk?: string;
  intro: string;
  introKo: string;
  introEn: string;
  introPl: string;
  introUk?: string;
  tips: string[];
  tipsKo: string[];
  tipsEn: string[];
  tipsPl: string[];
  tipsUk?: string[];
}

const PAGES: Record<string, ProfessionPageData> = {
  skladnik: {
    professionId: "obecné",
    title: "Skladník",
    metaTitle: "Němčina pro skladníky – slovíčka a fráze zdarma",
    metaDesc: "Nauč se německá slovíčka pro práci ve skladu. Regál, paleta, dodávka – vše hrou. Bez registrace, 10 minut denně.",
    h1: "Němčina pro skladníky",
    h1Ko: "창고 직원을 위한 독일어",
    h1En: "German for Warehouse Workers",
    h1Pl: "Niemiecki dla pracowników magazynu",
    intro: "Pracuješ ve skladu v Německu? Nauč se slovíčka, která uslyšíš každý den – od regálů a palet po pokyny šéfa. Vše hrou a zdarma.",
    introKo: "독일 창고에서 일하시나요? 매일 듣게 될 단어를 배우세요 – 선반과 팔레트부터 상사의 지시까지. 모두 게임으로 무료로.",
    introEn: "Working in a warehouse in Germany? Learn the words you'll hear every day – from shelves and pallets to the boss's instructions. All through games, for free.",
    introPl: "Pracujesz w magazynie w Niemczech? Naucz się słów, które usłyszysz każdego dnia – od regałów i palet po polecenia szefa. Wszystko przez gry i za darmo.",
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
    tipsEn: [
      "Start with flashcards and learn the basic warehouse vocabulary",
      "Try Llama Run and practise articles (der Gabelstapler, das Regal...)",
      "In sentence building you'll learn practical instructions from the boss",
    ],
    tipsPl: [
      "Zacznij od fiszek i naucz się podstawowych słówek z magazynu",
      "Przejdź do Llama Run i ćwicz rodzajniki (der Gabelstapler, das Regal...)",
      "W układaniu zdań nauczysz się praktycznych poleceń szefa",
    ],
    h1Uk: "Німецька для складських робітників",
    introUk: "Працюєш на складі в Німеччині? Вивчи слова, які почуєш щодня — від стелажів і палет до вказівок начальника. Все через ігри та безкоштовно.",
    tipsUk: [
      "Починай з карток і вивчи базову лексику для складу",
      "Спробуй Llama Run та відпрацюй артиклі (der Gabelstapler, das Regal...)",
      "У складанні речень навчишся практичним вказівкам начальника",
    ],
  },
  automechanik: {
    professionId: "automechanik",
    title: "Automechanik",
    metaTitle: "Němčina pro automechaniky – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro autoservis a dílnu. Motor, brzdy, výfuk – nauč se hrou. Bez registrace.",
    h1: "Němčina pro automechaniky",
    h1Ko: "자동차 정비사를 위한 독일어",
    h1En: "German for Car Mechanics",
    h1Pl: "Niemiecki dla mechaników samochodowych",
    intro: "Pracuješ v autoservisu v Německu nebo Rakousku? Nauč se názvy dílů, nářadí a fráze pro komunikaci se zákazníky i kolegy.",
    introKo: "독일이나 오스트리아 자동차 정비소에서 일하시나요? 부품명, 공구, 고객 및 동료와의 소통 표현을 배우세요.",
    introEn: "Working in a car workshop in Germany or Austria? Learn part names, tools, and phrases for communicating with customers and colleagues.",
    introPl: "Pracujesz w warsztacie samochodowym w Niemczech lub Austrii? Naucz się nazw części, narzędzi i zwrotów do komunikacji z klientami i kolegami.",
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
    tipsEn: [
      "Flashcards will help you with car part and tool names",
      "In Llama Run practise articles – der Motor, die Bremse, das Getriebe",
      "Sentence building will teach you to communicate with customers",
    ],
    tipsPl: [
      "Fiszki pomogą ci z nazwami części samochodowych i narzędzi",
      "W Llama Run ćwicz rodzajniki – der Motor, die Bremse, das Getriebe",
      "Układanie zdań nauczy cię komunikacji z klientami",
    ],
    h1Uk: "Німецька для автомеханіків",
    introUk: "Працюєш в автосервісі в Німеччині або Австрії? Вивчи назви деталей, інструментів і фрази для спілкування з клієнтами та колегами.",
    tipsUk: [
      "Картки допоможуть з назвами автодеталей та інструментів",
      "У Llama Run відпрацюй артиклі — der Motor, die Bremse, das Getriebe",
      "Складання речень навчить спілкуватися з клієнтами",
    ],
  },
  stavba: {
    professionId: "zedník",
    title: "Na stavbě",
    metaTitle: "Němčina na stavbě – slovíčka pro zedníky zdarma",
    metaDesc: "Německá slovíčka pro stavbu. Materiály, nářadí, bezpečnost práce – nauč se hrou. Bez registrace.",
    h1: "Němčina na stavbě",
    h1Ko: "건설 현장 독일어",
    h1En: "German on the Construction Site",
    h1Pl: "Niemiecki na budowie",
    intro: "Stavba v Německu? Nauč se slovíčka pro materiály, nářadí a bezpečnost práce. Komunikuj s parťákem i stavbyvedoucím.",
    introKo: "독일에서 건설? 재료, 공구, 안전 관련 단어를 배우세요. 동료와 현장 감독과 소통하세요.",
    introEn: "Working construction in Germany? Learn vocabulary for materials, tools, and workplace safety. Communicate with your crew and site manager.",
    introPl: "Budowa w Niemczech? Naucz się słówek dotyczących materiałów, narzędzi i bezpieczeństwa pracy. Komunikuj się z kolegami i kierownikiem budowy.",
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
    tipsEn: [
      "Start with flashcards for building materials and tools",
      "In the memory game you'll memorise German–English pairs",
      "Sentence building will prepare you for instructions on site",
    ],
    tipsPl: [
      "Zacznij od fiszek na materiały budowlane i narzędzia",
      "W grze memory zapamiętasz pary niemiecko-polskie",
      "Układanie zdań przygotuje cię na polecenia na budowie",
    ],
    h1Uk: "Німецька на будівельному майданчику",
    introUk: "Будівельні роботи в Німеччині? Вивчи лексику для матеріалів, інструментів та безпеки праці. Спілкуйся з бригадою та виконробом.",
    tipsUk: [
      "Починай з карток для будівельних матеріалів та інструментів",
      "У грі на пам'ять запам'ятаєш пари по-німецьки",
      "Складання речень підготує тебе до вказівок на майданчику",
    ],
  },
  gastro: {
    professionId: "gastro",
    title: "Gastro",
    metaTitle: "Němčina pro gastro – slovíčka pro kuchaře a číšníky",
    metaDesc: "Německá slovíčka pro restauraci a kuchyni. Objednávky, jídlo, nápoje – nauč se hrou. Zdarma.",
    h1: "Němčina pro gastro",
    h1Ko: "요식업을 위한 독일어",
    h1En: "German for Hospitality",
    h1Pl: "Niemiecki dla gastronomii",
    intro: "Pracuješ v restauraci, hotelu nebo kuchyni? Nauč se objednávky, jídelní lístek, komunikaci s hosty i kolegy v kuchyni.",
    introKo: "식당, 호텔 또는 주방에서 일하시나요? 주문, 메뉴, 손님과 주방 동료와의 소통 표현을 배우세요.",
    introEn: "Working in a restaurant, hotel, or kitchen? Learn orders, the menu, and how to communicate with guests and kitchen colleagues.",
    introPl: "Pracujesz w restauracji, hotelu lub kuchni? Naucz się zamówień, karty dań i komunikacji z gośćmi i kolegami z kuchni.",
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
    tipsEn: [
      "Flashcards for food, drinks, and kitchen equipment",
      "Llama Run helps with articles – der Teller, die Gabel, das Messer",
      "Sentence building simulates real guest orders",
    ],
    tipsPl: [
      "Fiszki na jedzenie, napoje i wyposażenie kuchni",
      "Llama Run pomoże z rodzajnikami – der Teller, die Gabel, das Messer",
      "Układanie zdań symuluje prawdziwe zamówienia gości",
    ],
    h1Uk: "Німецька для гастрономії",
    introUk: "Працюєш у ресторані, готелі або на кухні? Вивчи замовлення, меню та спілкування з гостями й колегами на кухні.",
    tipsUk: [
      "Картки на їжу, напої та кухонне обладнання",
      "Llama Run допоможе з артиклями — der Teller, die Gabel, das Messer",
      "Складання речень симулює реальні замовлення гостей",
    ],
  },
  sestra: {
    professionId: "sestřička",
    title: "Zdravotní sestra",
    metaTitle: "Němčina pro zdravotní sestry – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro zdravotnictví. Pacienti, léky, vyšetření – nauč se hrou. Bez registrace.",
    h1: "Němčina pro zdravotní sestry",
    h1Ko: "의료 직원을 위한 독일어",
    h1En: "German for Healthcare Workers",
    h1Pl: "Niemiecki dla pielęgniarek",
    intro: "Pracuješ ve zdravotnictví v Německu? Nauč se komunikovat s pacienty, lékaři a kolegy. Slovíčka pro péči, léky a vyšetření.",
    introKo: "독일 의료 분야에서 일하시나요? 환자, 의사, 동료와 소통하는 방법을 배우세요. 돌봄, 약물, 검사 관련 단어.",
    introEn: "Working in healthcare in Germany? Learn to communicate with patients, doctors, and colleagues. Vocabulary for care, medication, and examinations.",
    introPl: "Pracujesz w służbie zdrowia w Niemczech? Naucz się komunikować z pacjentami, lekarzami i kolegami. Słówka z opieki, leków i badań.",
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
    tipsEn: [
      "Start with flashcards for medical terms",
      "In Llama Run practise articles – der Patient, die Spritze, das Medikament",
      "Sentence building will teach you to talk with patients",
    ],
    tipsPl: [
      "Zacznij od fiszek na pojęcia medyczne",
      "W Llama Run ćwicz rodzajniki – der Patient, die Spritze, das Medikament",
      "Układanie zdań nauczy cię rozmawiać z pacjentami",
    ],
    h1Uk: "Німецька для медичних працівників",
    introUk: "Працюєш в охороні здоров'я в Німеччині? Навчись спілкуватися з пацієнтами, лікарями та колегами. Лексика для догляду, ліків та обстежень.",
    tipsUk: [
      "Починай з карток для медичних термінів",
      "У Llama Run відпрацюй артиклі — der Patient, die Spritze, das Medikament",
      "Складання речень навчить розмовляти з пацієнтами",
    ],
  },
  truhlar: {
    professionId: "truhlář",
    title: "Truhlář",
    metaTitle: "Němčina pro truhláře – slovíčka a fráze zdarma",
    metaDesc: "Německá slovíčka pro truhlářskou dílnu. Dřevo, nástroje, povrchy – nauč se hrou. Bez registrace.",
    h1: "Němčina pro truhláře",
    h1Ko: "목수를 위한 독일어",
    h1En: "German for Carpenters",
    h1Pl: "Niemiecki dla stolarzy",
    intro: "Pracuješ v truhlářské dílně v Německu? Nauč se názvy dřevin, nástrojů, spojovacího materiálu a fráze pro komunikaci se zákazníky.",
    introKo: "독일 목공 작업장에서 일하시나요? 목재, 공구, 연결 재료 이름과 고객 소통 표현을 배우세요.",
    introEn: "Working in a carpentry workshop in Germany? Learn wood species, tool names, fasteners, and phrases for customer communication.",
    introPl: "Pracujesz w stolarni w Niemczech? Naucz się gatunków drewna, nazw narzędzi, materiałów łączących i zwrotów do komunikacji z klientami.",
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
    tipsEn: [
      "Flashcards will teach you tool and material names",
      "In Llama Run practise articles – der Hobel, die Säge, das Brett",
      "Sentence building will prepare you for orders and communication",
    ],
    tipsPl: [
      "Fiszki nauczą cię nazw narzędzi i materiałów",
      "W Llama Run ćwicz rodzajniki – der Hobel, die Säge, das Brett",
      "Układanie zdań przygotuje cię na zamówienia i komunikację",
    ],
    h1Uk: "Німецька для теслярів",
    introUk: "Працюєш у столярній майстерні в Німеччині? Вивчи назви порід дерева, інструментів, кріплення і фрази для спілкування з клієнтами.",
    tipsUk: [
      "Картки навчать назвам інструментів та матеріалів",
      "У Llama Run відпрацюй артиклі — der Hobel, die Säge, das Brett",
      "Складання речень підготує до замовлень та спілкування",
    ],
  },
  instalater: {
    professionId: "instalatér",
    title: "Instalatér",
    metaTitle: "Němčina pro instalatéry – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro instalatéry. Potrubí, ventily, kotel – nauč se hrou. Bez registrace.",
    h1: "Němčina pro instalatéry",
    h1Ko: "배관공을 위한 독일어",
    h1En: "German for Plumbers",
    h1Pl: "Niemiecki dla hydraulików",
    intro: "Montáže v Německu? Nauč se slovíčka pro potrubí, armatury, topení a komunikaci se zákazníky i kolegy na stavbě.",
    introKo: "독일에서 설치 작업? 배관, 피팅, 난방 관련 단어와 고객 및 동료와의 소통 표현을 배우세요.",
    introEn: "Installations in Germany? Learn vocabulary for pipes, fittings, heating, and communicating with customers and site colleagues.",
    introPl: "Montaże w Niemczech? Naucz się słówek dotyczących rur, armatur, ogrzewania i komunikacji z klientami oraz kolegami na budowie.",
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
    tipsEn: [
      "Start with flashcards for plumbing terminology",
      "In Llama Run practise articles – der Hahn, die Leitung, das Ventil",
      "Sentence building will teach you to deal with customers",
    ],
    tipsPl: [
      "Zacznij od fiszek na terminologię hydrauliczną",
      "W Llama Run ćwicz rodzajniki – der Hahn, die Leitung, das Ventil",
      "Układanie zdań nauczy cię obsługi klientów",
    ],
    h1Uk: "Німецька для сантехніків",
    introUk: "Монтажні роботи в Німеччині? Вивчи лексику для труб, фітингів, опалення та спілкування з клієнтами й колегами.",
    tipsUk: [
      "Починай з карток для сантехнічної термінології",
      "У Llama Run відпрацюй артиклі — der Hahn, die Leitung, das Ventil",
      "Складання речень навчить роботи з клієнтами",
    ],
  },
  elektrikar: {
    professionId: "elektrikář",
    title: "Elektrikář",
    metaTitle: "Němčina pro elektrikáře – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro elektrikáře. Kabely, jističe, zásuvky – nauč se hrou. Bez registrace.",
    h1: "Němčina pro elektrikáře",
    h1Ko: "전기 기사를 위한 독일어",
    h1En: "German for Electricians",
    h1Pl: "Niemiecki dla elektryków",
    intro: "Pracuješ jako elektrikář v Německu? Nauč se názvy komponentů, nástrojů a fráze pro bezpečnost práce.",
    introKo: "독일에서 전기 기사로 일하시나요? 부품, 공구 이름과 안전 작업 표현을 배우세요.",
    introEn: "Working as an electrician in Germany? Learn component and tool names and phrases for workplace safety.",
    introPl: "Pracujesz jako elektryk w Niemczech? Naucz się nazw komponentów, narzędzi i zwrotów dotyczących bezpieczeństwa pracy.",
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
    tipsEn: [
      "Flashcards for electrical installation materials and tools",
      "In Llama Run practise articles – der Schalter, die Sicherung, das Kabel",
      "Sentence building will prepare you for communication on site",
    ],
    tipsPl: [
      "Fiszki na materiały elektroinstalacyjne i narzędzia",
      "W Llama Run ćwicz rodzajniki – der Schalter, die Sicherung, das Kabel",
      "Układanie zdań przygotuje cię do komunikacji na budowie",
    ],
    h1Uk: "Німецька для електриків",
    introUk: "Працюєш електриком у Німеччині? Вивчи назви компонентів, інструментів та фрази для безпеки праці.",
    tipsUk: [
      "Картки для електромонтажних матеріалів та інструментів",
      "У Llama Run відпрацюй артиклі — der Schalter, die Sicherung, das Kabel",
      "Складання речень підготує до спілкування на майданчику",
    ],
  },
  pokladni: {
    professionId: "pokladní",
    title: "Pokladní",
    metaTitle: "Němčina pro pokladní – slovíčka a fráze zdarma",
    metaDesc: "Německá slovíčka pro práci za pokladnou. Platby, reklamace, zákazníci – nauč se hrou. Zdarma.",
    h1: "Němčina pro pokladní",
    h1Ko: "계산원을 위한 독일어",
    h1En: "German for Cashiers",
    h1Pl: "Niemiecki dla kasjerów",
    intro: "Pracuješ za pokladnou v Německu? Nauč se fráze pro obsluhu zákazníků, reklamace, platby a každodenní komunikaci.",
    introKo: "독일에서 계산원으로 일하시나요? 고객 응대, 환불, 결제, 일상 소통 표현을 배우세요.",
    introEn: "Working at a checkout in Germany? Learn phrases for serving customers, handling returns, payments, and everyday communication.",
    introPl: "Pracujesz przy kasie w Niemczech? Naucz się zwrotów do obsługi klientów, reklamacji, płatności i codziennej komunikacji.",
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
    tipsEn: [
      "Flashcards will teach you basic phrases for customers",
      "In Llama Run practise articles – der Kassenbon, die Karte, das Wechselgeld",
      "Sentence building simulates real checkout situations",
    ],
    tipsPl: [
      "Fiszki nauczą cię podstawowych zwrotów dla klientów",
      "W Llama Run ćwicz rodzajniki – der Kassenbon, die Karte, das Wechselgeld",
      "Układanie zdań symuluje rzeczywiste sytuacje przy kasie",
    ],
    h1Uk: "Німецька для касирів",
    introUk: "Працюєш на касі в Німеччині? Вивчи фрази для обслуговування клієнтів, повернень, платежів та щоденного спілкування.",
    tipsUk: [
      "Картки навчать базових фраз для клієнтів",
      "У Llama Run відпрацюй артиклі — der Kassenbon, die Karte, das Wechselgeld",
      "Складання речень симулює реальні ситуації на касі",
    ],
  },
  uklizecka: {
    professionId: "uklízečka",
    title: "Uklízečka",
    metaTitle: "Němčina pro uklízečky – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro úklid. Čisticí prostředky, nástroje, pokyny – nauč se hrou. Bez registrace.",
    h1: "Němčina pro uklízečky",
    h1Ko: "청소부를 위한 독일어",
    h1En: "German for Cleaners",
    h1Pl: "Niemiecki dla pracowników sprzątających",
    intro: "Pracuješ v úklidu v Německu? Nauč se názvy čisticích prostředků, nástrojů a fráze pro komunikaci s nadřízenými.",
    introKo: "독일에서 청소 업무를 하시나요? 청소 용품, 도구 이름과 상사와의 소통 표현을 배우세요.",
    introEn: "Working in cleaning in Germany? Learn cleaning product and tool names, and phrases for communicating with supervisors.",
    introPl: "Pracujesz przy sprzątaniu w Niemczech? Naucz się nazw środków czyszczących, narzędzi i zwrotów do komunikacji z przełożonymi.",
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
    tipsEn: [
      "Start with flashcards for cleaning products and tools",
      "In Llama Run practise articles – der Besen, die Seife, das Putzmittel",
      "Sentence building will teach you to understand instructions",
    ],
    tipsPl: [
      "Zacznij od fiszek na środki czyszczące i narzędzia",
      "W Llama Run ćwicz rodzajniki – der Besen, die Seife, das Putzmittel",
      "Układanie zdań nauczy cię rozumieć polecenia",
    ],
    h1Uk: "Німецька для прибиральників",
    introUk: "Працюєш прибиральником/-цею в Німеччині? Вивчи назви засобів та інструментів для прибирання і фрази для спілкування з керівниками.",
    tipsUk: [
      "Починай з карток для засобів та інструментів прибирання",
      "У Llama Run відпрацюй артиклі — der Besen, die Seife, das Putzmittel",
      "Складання речень навчить розуміти вказівки",
    ],
  },
  kancelar: {
    professionId: "kancelář",
    title: "Kancelář",
    metaTitle: "Němčina v kanceláři – slovíčka a fráze zdarma",
    metaDesc: "Německá slovíčka pro kancelář. E-maily, schůzky, telefonáty – nauč se hrou. Bez registrace.",
    h1: "Němčina v kanceláři",
    h1Ko: "사무실 독일어",
    h1En: "German in the Office",
    h1Pl: "Niemiecki w biurze",
    intro: "Pracuješ v kanceláři v Německu? Nauč se fráze pro e-maily, schůzky, telefonáty a komunikaci s kolegy.",
    introKo: "독일 사무실에서 일하시나요? 이메일, 회의, 전화 통화와 동료와의 소통 표현을 배우세요.",
    introEn: "Working in an office in Germany? Learn phrases for emails, meetings, phone calls, and communicating with colleagues.",
    introPl: "Pracujesz w biurze w Niemczech? Naucz się zwrotów do e-maili, spotkań, rozmów telefonicznych i komunikacji z kolegami.",
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
    tipsEn: [
      "Flashcards for office vocabulary",
      "In Llama Run practise articles – der Drucker, die Besprechung, das Dokument",
      "Sentence building will teach you to write emails and conduct negotiations",
    ],
    tipsPl: [
      "Fiszki na słownictwo biurowe",
      "W Llama Run ćwicz rodzajniki – der Drucker, die Besprechung, das Dokument",
      "Układanie zdań nauczy cię pisać e-maile i prowadzić negocjacje",
    ],
    h1Uk: "Німецька в офісі",
    introUk: "Працюєш в офісі в Німеччині? Вивчи фрази для електронних листів, нарад, телефонних дзвінків та спілкування з колегами.",
    tipsUk: [
      "Картки для офісної лексики",
      "У Llama Run відпрацюй артиклі — der Drucker, die Besprechung, das Dokument",
      "Складання речень навчить писати листи та вести переговори",
    ],
  },
  zahradnik: {
    professionId: "zahradník",
    title: "Zahradník",
    metaTitle: "Němčina pro zahradníky – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro zahradnictví. Rostliny, nářadí, práce na zahradě – nauč se hrou. Zdarma.",
    h1: "Němčina pro zahradníky",
    h1Ko: "정원사를 위한 독일어",
    h1En: "German for Gardeners",
    h1Pl: "Niemiecki dla ogrodników",
    intro: "Pracuješ v zahradnictví v Německu? Nauč se názvy rostlin, nářadí a fráze pro komunikaci se zákazníky i kolegy.",
    introKo: "독일 원예 업계에서 일하시나요? 식물, 도구 이름과 고객 및 동료와의 소통 표현을 배우세요.",
    introEn: "Working in gardening in Germany? Learn plant and tool names, and phrases for communicating with customers and colleagues.",
    introPl: "Pracujesz w ogrodnictwie w Niemczech? Naucz się nazw roślin, narzędzi i zwrotów do komunikacji z klientami i kolegami.",
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
    tipsEn: [
      "Start with flashcards for plants and garden tools",
      "In Llama Run practise articles – der Rasen, die Pflanze, das Beet",
      "Sentence building will prepare you for customer orders",
    ],
    tipsPl: [
      "Zacznij od fiszek na rośliny i narzędzia ogrodnicze",
      "W Llama Run ćwicz rodzajniki – der Rasen, die Pflanze, das Beet",
      "Układanie zdań przygotuje cię na zlecenia klientów",
    ],
    h1Uk: "Німецька для садівників",
    introUk: "Працюєш у садівництві в Німеччині? Вивчи назви рослин, інструментів та фрази для спілкування з клієнтами й колегами.",
    tipsUk: [
      "Починай з карток для рослин та садових інструментів",
      "У Llama Run відпрацюй артиклі — der Rasen, die Pflanze, das Beet",
      "Складання речень підготує до замовлень клієнтів",
    ],
  },
  ucitel: {
    professionId: "učitel",
    title: "Učitel",
    metaTitle: "Němčina pro učitele – slovíčka a fráze zdarma",
    metaDesc: "Německá slovíčka pro učitele. Škola, třída, vyučování – nauč se hrou. Bez registrace.",
    h1: "Němčina pro učitele",
    h1Ko: "교사를 위한 독일어",
    h1En: "German for Teachers",
    h1Pl: "Niemiecki dla nauczycieli",
    intro: "Učíš v Německu nebo plánuješ? Nauč se slovíčka pro školu, vyučování a komunikaci s rodiči, žáky i kolegy.",
    introKo: "독일에서 가르치거나 계획 중이신가요? 학교, 수업, 부모님, 학생, 동료와의 소통 단어를 배우세요.",
    introEn: "Teaching in Germany or planning to? Learn vocabulary for school, lessons, and communicating with parents, students, and colleagues.",
    introPl: "Uczysz w Niemczech lub planujesz? Naucz się słówek dotyczących szkoły, lekcji i komunikacji z rodzicami, uczniami i kolegami.",
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
    tipsEn: [
      "Flashcards for school vocabulary",
      "In Llama Run practise articles – der Schüler, die Tafel, das Zeugnis",
      "Sentence building will teach you to communicate with parents",
    ],
    tipsPl: [
      "Fiszki na słownictwo szkolne",
      "W Llama Run ćwicz rodzajniki – der Schüler, die Tafel, das Zeugnis",
      "Układanie zdań nauczy cię komunikować się z rodzicami",
    ],
    h1Uk: "Німецька для вчителів",
    introUk: "Викладаєш у Німеччині або плануєш? Вивчи лексику для школи, уроків та спілкування з батьками, учнями й колегами.",
    tipsUk: [
      "Картки для шкільної лексики",
      "У Llama Run відпрацюй артиклі — der Schüler, die Tafel, das Zeugnis",
      "Складання речень навчить спілкуватися з батьками",
    ],
  },
  kadernik: {
    professionId: "kadeřník",
    title: "Kadeřník",
    metaTitle: "Němčina pro kadeřníky – slovíčka zdarma",
    metaDesc: "Německá slovíčka pro kadeřnictví. Střih, barvení, péče o vlasy – nauč se hrou. Bez registrace.",
    h1: "Němčina pro kadeřníky",
    h1Ko: "미용사를 위한 독일어",
    h1En: "German for Hairdressers",
    h1Pl: "Niemiecki dla fryzjerów",
    intro: "Pracuješ v kadeřnictví v Německu? Nauč se fráze pro komunikaci se zákazníky – od konzultace po placení.",
    introKo: "독일 미용실에서 일하시나요? 상담부터 결제까지 고객과 소통하는 표현을 배우세요.",
    introEn: "Working in a hair salon in Germany? Learn phrases for customer communication – from consultation to payment.",
    introPl: "Pracujesz w salonie fryzjerskim w Niemczech? Naucz się zwrotów do komunikacji z klientami – od konsultacji po płatność.",
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
    tipsEn: [
      "Flashcards will teach you treatment and tool names",
      "In Llama Run practise articles – der Föhn, die Schere, das Shampoo",
      "Sentence building simulates a conversation with a customer",
    ],
    tipsPl: [
      "Fiszki nauczą cię nazw zabiegów i narzędzi",
      "W Llama Run ćwicz rodzajniki – der Föhn, die Schere, das Shampoo",
      "Układanie zdań symuluje rozmowę z klientem",
    ],
    h1Uk: "Німецька для перукарів",
    introUk: "Працюєш у перукарні в Німеччині? Вивчи фрази для спілкування з клієнтами — від консультації до оплати.",
    tipsUk: [
      "Картки навчать назвам процедур та інструментів",
      "У Llama Run відпрацюй артиклі — der Föhn, die Schere, das Shampoo",
      "Складання речень симулює розмову з клієнтом",
    ],
  },
  haseni: {
    professionId: "systemy_pro_haseni",
    title: "Systémy pro hašení",
    metaTitle: "Němčina pro hasiče – slovíčka a fráze zdarma",
    metaDesc: "Německá slovíčka pro hasičské systémy. Hasicí přístroje, potrubí, bezpečnost – nauč se hrou.",
    h1: "Němčina pro systémy hašení",
    h1Ko: "소방 시스템 독일어",
    h1En: "German for Fire Suppression Systems",
    h1Pl: "Niemiecki dla systemów gaśniczych",
    intro: "Pracuješ s hasicími systémy v Německu? Nauč se odborné názvosloví pro instalaci, údržbu a bezpečnostní předpisy.",
    introKo: "독일에서 소방 시스템 업무를 하시나요? 설치, 유지 보수, 안전 규정을 위한 전문 용어를 배우세요.",
    introEn: "Working with fire suppression systems in Germany? Learn the technical terminology for installation, maintenance, and safety regulations.",
    introPl: "Pracujesz z systemami gaśniczymi w Niemczech? Naucz się specjalistycznej terminologii do instalacji, konserwacji i przepisów bezpieczeństwa.",
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
    tipsEn: [
      "Start with flashcards for fire-fighting equipment",
      "In Llama Run practise articles – der Feuerlöscher, die Sprinkleranlage, das Löschmittel",
      "Sentence building will prepare you for safety training",
    ],
    tipsPl: [
      "Zacznij od fiszek na sprzęt gaśniczy",
      "W Llama Run ćwicz rodzajniki – der Feuerlöscher, die Sprinkleranlage, das Löschmittel",
      "Układanie zdań przygotuje cię na szkolenia BHP",
    ],
    h1Uk: "Німецька для систем пожежогасіння",
    introUk: "Працюєш із системами пожежогасіння в Німеччині? Вивчи спеціальну термінологію для монтажу, обслуговування та правил безпеки.",
    tipsUk: [
      "Починай з карток для протипожежного обладнання",
      "У Llama Run відпрацюй артиклі — der Feuerlöscher, die Sprinkleranlage, das Löschmittel",
      "Складання речень підготує до інструктажів з безпеки",
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
  const sampleWords = profCards.slice(0, 10).map(v => ({ german: v.german, translation: lang === "ko" ? v.ko : lang === "pl" ? (v.pl ?? v.czech) : lang === "en" ? (v.en ?? v.czech) : lang === "uk" ? (v.uk ?? v.en ?? v.czech) : v.czech }));
  const totalVocab = profCards.length;

  const h1 = lang === "ko" ? page.h1Ko : lang === "en" ? page.h1En : lang === "pl" ? page.h1Pl : lang === "uk" ? (page.h1Uk ?? page.h1En) : page.h1;
  const intro = lang === "ko" ? page.introKo : lang === "en" ? page.introEn : lang === "pl" ? page.introPl : lang === "uk" ? (page.introUk ?? page.introEn) : page.intro;
  const tips = lang === "ko" ? page.tipsKo : lang === "en" ? page.tipsEn : lang === "pl" ? page.tipsPl : lang === "uk" ? (page.tipsUk ?? page.tipsEn) : page.tips;

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
