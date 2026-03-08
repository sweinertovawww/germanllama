import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckCircle, Send } from "lucide-react";

const Kontakt = () => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError("");

    const { error: dbError } = await supabase
      .from("feedback")
      .insert({ message: message.trim(), email: email.trim() || null });

    if (dbError) {
      setError("Nepodařilo se odeslat zprávu. Zkus to prosím znovu.");
      setLoading(false);
      return;
    }

    // Send email notification (fire and forget)
    supabase.functions.invoke("send-feedback-email", {
      body: { message: message.trim(), email: email.trim() || null },
    }).catch(console.error);

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 sm:py-16">
      {submitted ? (
        <div className="text-center space-y-4 py-12">
          <CheckCircle className="w-16 h-16 text-primary mx-auto" />
          <h2 className="font-game text-xl sm:text-2xl text-foreground">
            Děkuji!
          </h2>
          <p className="font-body text-muted-foreground">
            Tvá zpráva byla úspěšně odeslána.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-game text-xl sm:text-2xl text-foreground">
              Pomozte vylepšit Germanllama.com
            </h1>
            <p className="font-body text-sm sm:text-base text-muted-foreground">
              Budeme moc rádi za tvůj feedback, nápady na nové věty/slovíčka,
              nebo hlášení chyb.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Tvoje zpráva..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[140px] font-body"
              required
            />
            <div className="space-y-1">
              <Input
                type="email"
                placeholder="Tvůj e-mail (nepovinné)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-body"
              />
              <p className="text-xs text-muted-foreground font-body">
                Vyplň, pokud chceš odpověď.
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive font-body">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full font-game"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? "Odesílám..." : "Odeslat"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Kontakt;
