import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckCircle, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Kontakt = () => {
  const { t } = useLanguage();
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
      setError(t("sendError"));
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
            {t("thankYou")}
          </h2>
          <p className="font-body text-muted-foreground">
            {t("messageSent")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-game text-xl sm:text-2xl text-foreground">
              {t("contactTitle")}
            </h1>
            <p className="font-body text-sm sm:text-base text-muted-foreground">
              {t("contactDesc")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder={t("messagePlaceholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[140px] font-body"
              required
            />
            <div className="space-y-1">
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-body"
              />
              <p className="text-xs text-muted-foreground font-body">
                {t("emailHint")}
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
              {loading ? t("sending") : t("send")}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Kontakt;
