import { next } from "@vercel/functions";

export const config = {
  matcher: ["/((?!index\\.html|assets/|og/|favicon\\.ico|robots\\.txt|sitemap\\.xml|slovicka\\.csv|.*\\..*).*)"],
};

interface LangMeta {
  title: string;
  description: string;
  locale: string;
}

const LANG_META: Record<string, LangMeta> = {
  en: {
    title: "Learn German for Work – the Fun Way! – GermanLlama",
    description: "Self-study platform for German learners.",
    locale: "en_US",
  },
  pl: {
    title: "Język niemiecki do pracy – z głową i zabawą! – GermanLlama",
    description: "Platforma do samodzielnej nauki języka niemieckiego.",
    locale: "pl_PL",
  },
  sk: {
    title: "Nemčina do práce hravo! – GermanLlama",
    description: "Platforma pre samoukov nemčiny.",
    locale: "sk_SK",
  },
  uk: {
    title: "Вивчай німецьку для роботи — граючись! – GermanLlama",
    description: "Платформа для самостійного вивчення мови.",
    locale: "uk_UA",
  },
  ko: {
    title: "즐겁게 직업 독일어! – GermanLlama",
    description: "독일어 자기 학습 플랫폼.",
    locale: "ko_KR",
  },
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang");
  const meta = lang ? LANG_META[lang] : undefined;

  if (!meta) {
    return next();
  }

  const origin = await fetch(new URL("/index.html", url), { cache: "no-store" });
  if (!origin.ok) {
    return next();
  }

  let html = await origin.text();
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const image = `https://www.germanllama.com/og/og-image-${lang}.jpg`;

  html = html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${image}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${meta.locale}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${image}$2`)
    .replace(/(<html lang=")[^"]*(")/, `$1${lang}$2`);

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Vercel's CDN keys its cache by pathname only by default, which would otherwise
      // serve the same cached HTML for every ?lang= value on a given path.
      "cache-control": "no-store, must-revalidate",
    },
  });
}
