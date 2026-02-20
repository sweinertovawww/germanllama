import LlamaGame from "@/game/LlamaGame";

const Index = () => {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <div className="flex flex-1 items-start sm:items-center justify-center p-2 sm:p-4 pt-4 sm:pt-4">
        <LlamaGame />
      </div>
      <footer className="text-center text-xs text-muted-foreground py-3">
        @2026 Germanllama.com - All rights reserved
      </footer>
    </div>
  );
};

export default Index;
