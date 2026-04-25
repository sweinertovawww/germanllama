import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

interface GameSEOContentProps {
  title: string;
  intro: string;
  sampleWords?: { german: string; translation: string }[];
  faqs: { q: string; a: string }[];
}

const GameSEOContent = ({ title, intro, sampleWords, faqs }: GameSEOContentProps) => {
  const { t } = useLanguage();

  return (
    <section className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Intro */}
      <div>
        <h2 className="font-game text-lg sm:text-xl text-foreground mb-2">{title}</h2>
        <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">{intro}</p>
      </div>

      {/* Sample vocabulary */}
      {sampleWords && sampleWords.length > 0 && (
        <div>
          <h3 className="font-game text-base text-foreground mb-3">{t("sampleVocab")}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {sampleWords.map((w, i) => (
              <div key={i} className="bg-muted rounded-lg px-3 py-2 text-center border border-border">
                <span className="font-body text-sm font-semibold text-foreground block">{w.german}</span>
                <span className="font-body text-xs text-muted-foreground">{w.translation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div>
        <h3 className="font-game text-base text-foreground mb-3">{t("faqTitle")}</h3>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="font-body text-sm text-foreground text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default GameSEOContent;
