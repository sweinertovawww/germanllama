# MISSING TRANSLATIONS — audit 2026-09-06

## vocabularyData.ts

### QUESTIONS (861 položek) a FILL_QUESTIONS (2052 položek)
Ověřeno přímo v kódu (ne odhadem): každá z 2913 položek (QUESTIONS + FILL_QUESTIONS)
má vyplněné všech 6 jazykových polí:
- `translation` (CS): ✅ 2913/2913
- `translationKo`: ✅ 2913/2913
- `translationEn`: ✅ 2913/2913
- `translationPl`: ✅ 2913/2913
- `translationUk`: ✅ 2913/2913
- `translationSk`: ✅ 2913/2913

**Závěr: Žádné chybějící překlady v QUESTIONS/FILL_QUESTIONS.**

## Supabase `word_pairs` tabulka (Wortpaare)

Ověřeno přes REST API (anon klíč, RLS povoluje SELECT), 62 řádků celkem.

- `translation_a` / `translation_b` (CS): ✅ 62/62
- `translation_a_en` / `translation_b_en`: ✅ 62/62
- `translation_a_pl` / `translation_b_pl`: ✅ 62/62
- `translation_a_uk` / `translation_b_uk`: ✅ 62/62
- `translation_a_sk` / `translation_b_sk`: ✅ 62/62
- `translation_a_ko` / `translation_b_ko`: ❌ **chybí u 38/62 párů**

### Chybějící korejské překlady (38 párů)

| word_a | word_b | typ |
|---|---|---|
| gehen | laufen | synonym |
| kaufen | erwerben | synonym |
| denken | nachdenken | synonym |
| anfangen | beginnen | synonym |
| schauen | sehen | synonym |
| arbeiten | jobben | synonym |
| fragen | nachfragen | synonym |
| sagen | mitteilen | synonym |
| sprechen | schweigen | antonym |
| kommen | gehen | antonym |
| lieben | hassen | antonym |
| gewinnen | verlieren | antonym |
| anfangen | aufhören | antonym |
| hell | dunkel | antonym |
| testen | freigeben | antonym |
| analysieren | zusammenfassen | synonym |
| entwickeln | zerstören | antonym |
| optimieren | verschlechtern | antonym |
| automatisieren | manuell machen | antonym |
| hochladen | herunterladen | antonym |
| einloggen | ausloggen | antonym |
| starten | stoppen | antonym |
| senden | empfangen | antonym |
| installieren | einrichten | synonym |
| löschen | entfernen | synonym |
| speichern | sichern | synonym |
| aktualisieren | updaten | synonym |
| verbinden | trennen | antonym |
| planen | improvisieren | antonym |
| organisieren | chaotisieren | antonym |
| verstehen | missverstehen | antonym |
| vereinbaren | absagen | antonym |
| prüfen | ignorieren | antonym |
| antworten | reagieren | synonym |
| beraten | informieren | synonym |
| beschweren | loben | antonym |
| klären | verwirren | antonym |
| bestellen | stornieren | antonym |

**Poznámka:** Jde převážně o novější přírůstky (IT/admin slovní zásoba) — vypadá to,
že korejština nebyla doplněna v tom samém kole jako EN/PL/UK/SK.

## Závěr

Jediná reálná mezera je **korejština ve Wortpaare** (38 párů). Vše ostatní
(QUESTIONS, FILL_QUESTIONS, zbylé jazyky ve Wortpaare) je kompletní.
