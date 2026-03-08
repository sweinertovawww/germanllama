import { Layers } from "lucide-react";

const FlashCards = () => {
  return (
    <section className="py-8 sm:py-16 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 shadow-sm">
          <Layers className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
          <h2 className="font-game text-sm sm:text-lg text-foreground mb-2">Flash Cards</h2>
          <p className="font-body text-muted-foreground text-sm sm:text-base">
            Kartičky na překlad — již brzy! 🚧
          </p>
        </div>
      </div>
    </section>
  );
};

export default FlashCards;
