import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/i18n/translations";
import germanLlamaLogo from "@/assets/germanllama-logo.png";

interface LangOption {
  code: Lang;
  flag: string;
  nameKey: "langNameCs" | "langNameDe" | "langNameEn" | "langNamePl" | "langNameKo" | "langNameUk" | "langNameSk";
}

const LANG_OPTIONS: LangOption[] = [
  { code: "cs", flag: "🇨🇿", nameKey: "langNameCs" },
  { code: "en", flag: "🇬🇧", nameKey: "langNameEn" },
  { code: "pl", flag: "🇵🇱", nameKey: "langNamePl" },
  { code: "ko", flag: "🇰🇷", nameKey: "langNameKo" },
  { code: "uk", flag: "🇺🇦", nameKey: "langNameUk" },
  { code: "sk", flag: "🇸🇰", nameKey: "langNameSk" },
];

interface LanguageSelectorProps {
  mode: "onboarding" | "modal";
  onClose?: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ mode, onClose }) => {
  const { lang, setLang, t } = useLanguage();

  const [nativeLang, setNativeLang] = useState<Lang>(lang);

  const handleConfirm = () => {
    setLang(nativeLang);
    localStorage.setItem("gl_onboarding_done", "1");
    onClose?.();
  };

  const content = (
    <div className="bg-card rounded-2xl shadow-2xl border border-border p-6 sm:p-8 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-1 mb-6">
        <img src={germanLlamaLogo} alt="GermanLlama" className="w-14 h-14 rounded-xl mb-1" />
        <h2 className="font-game text-lg sm:text-xl text-foreground text-center">
          {t("onboardingTitle")}
        </h2>
      </div>

      {/* Native language */}
      <div className="mb-6">
        <p className="font-body font-semibold text-sm text-muted-foreground mb-2 text-center uppercase tracking-wide">
          {t("onboardingNativeLang")}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => setNativeLang(opt.code)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border-2 transition-all font-body text-xs font-semibold ${
                nativeLang === opt.code
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span className="text-xl">{opt.flag}</span>
              <span>{t(opt.nameKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Confirm */}
      <button
        onClick={handleConfirm}
        className="w-full font-game text-sm sm:text-base py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-md"
      >
        {t("onboardingStart")}
      </button>

      {mode === "modal" && onClose && (
        <button
          onClick={onClose}
          className="mt-3 w-full font-body text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          ✕ {t("previous")}
        </button>
      )}
    </div>
  );

  if (mode === "onboarding") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
};

export default LanguageSelector;
