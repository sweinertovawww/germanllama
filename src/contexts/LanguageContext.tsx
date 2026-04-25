import React, { createContext, useContext, useState } from "react";
import { translations, type Lang } from "@/i18n/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof translations.cs, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const urlLang = new URLSearchParams(window.location.search).get("lang") as Lang | null;
    const initial = urlLang || (localStorage.getItem("gl_lang") as Lang) || "cs";
    document.documentElement.lang = initial;
    return initial;
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("gl_lang", l);
    document.documentElement.lang = l;
    const params = new URLSearchParams(window.location.search);
    if (l === "cs") {
      params.delete("lang");
    } else {
      params.set("lang", l);
    }
    const query = params.toString();
    history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : ""));
  };

  const t = (key: keyof typeof translations.cs, params?: Record<string, string | number>): string => {
    let str = translations[lang][key] ?? translations.cs[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
