import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Lang } from "@/i18n/translations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Current page URL with an explicit `?lang=` param (Czech, the default, has none —
 * matching LanguageContext's own convention), so shared links carry the active language
 * regardless of whether in-app navigation preserved it in the address bar.
 */
export function currentShareUrl(lang: Lang): string {
  const base = window.location.origin + window.location.pathname;
  return lang === "cs" ? base : `${base}?lang=${lang}`;
}
