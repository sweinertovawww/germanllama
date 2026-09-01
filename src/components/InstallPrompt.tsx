import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const isIOSDevice = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !("MSStream" in window);

const isStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const InstallPrompt = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    if (isStandaloneMode() || localStorage.getItem("gl_install_dismissed") === "1") return;

    setIsIOS(isIOSDevice());
    setDismissed(false);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => setDismissed(true);

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("gl_install_dismissed", "1");
    setDismissed(true);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (choice.outcome === "accepted") setDismissed(true);
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (dismissed || (!deferredPrompt && !isIOS)) return null;

  return (
    <>
      <div className="bg-primary/10 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-3">
          <span className="text-xl shrink-0">📲</span>
          <span className="flex-1 font-body text-xs sm:text-sm text-foreground min-w-0">
            {t("pwaInstallText")}
          </span>
          <button
            onClick={handleInstallClick}
            className="shrink-0 flex items-center gap-1 font-game text-[10px] sm:text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            {isIOS && !deferredPrompt ? t("pwaInstallButtonIOS") : t("pwaInstallButton")}
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-game text-sm sm:text-base text-foreground">
              {t("pwaInstallModalTitle")}
            </DialogTitle>
          </DialogHeader>
          <ol className="font-body text-sm text-muted-foreground space-y-3 list-decimal list-inside pl-1">
            <li>{t("pwaInstallModalStep1")}</li>
            <li>{t("pwaInstallModalStep2")}</li>
            <li>{t("pwaInstallModalStep3")}</li>
          </ol>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstallPrompt;
