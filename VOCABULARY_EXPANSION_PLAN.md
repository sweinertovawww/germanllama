# VOCABULARY_EXPANSION_PLAN.md
## Plán rozšíření slovní zásoby — germanllama.com

Vytvořeno: 2026-05-06  
Zdroj: audit vocabularyData.ts (celkem 1 673 záznamů, 397 QUESTIONS + 1 276 FILL_QUESTIONS)

---

## STRUKTURA DAT (pro referenci)

```typescript
// QUESTIONS — typ Question
{ text: "Jaký člen má [Slovo]?", options: ["der","die","das"], correct: 0|1|2,
  translation: "cs", translationKo: "ko", translationEn: "en", translationPl: "pl",
  profession: Profession }

// FILL_QUESTIONS — typ FillQuestion
{ sentence: "Ich ___ das Werkzeug.", answer: "nehme",
  translation: "cs věta", translationKo: "ko", translationEn: "en", translationPl: "pl",
  profession: Profession }
```

Každé nové slovíčko bude mít: 1 QUESTION (správný člen) + 2–3 FILL_QUESTIONS (věty).

---

## PROFESE — DETAILNÍ PLÁN

---

### 1. OBECNÉ
**Aktuální počet:** 218 (82 Q + 136 FQ)

**Aktuálně pokrytá témata:**
- Základní slovíčka (články, čísla, příkazy)
- Práce a směny (Schicht, Pause, Werkstatt)
- Bezpečnost obecně (Helm, Feuerlöscher, Schutzbrille)
- Kantýna, šatna, šatní skříňka
- Stroje a výroba (Maschine, Förderband, Montageband)
- Administrativa obecně (Projekt, Feedback, Kosten, Team, Deadline)
- Opravy, závady, kvalita

**Chybějící témata:**
- **BOZP detailně:** Sicherheitsunterweisung, Gefahrenzeichen, Notausgang, Brandschutz, GHS-symboly
- **Komunikace s nadřízeným:** Vorgesetzter, Anweisung, Rückmeldung geben, Frage stellen
- **Administrativa — dovolená/nemoc/přesčas:** Urlaubsantrag, Krankmeldung, Überstunden, Lohnabrechnung, Probezeit, Kündigung
- **Nástup do práce:** Einarbeitung, Probezeit, Arbeitsvertrag, Personalausweis, Sozialversicherung
- **Obecná pracovní komunikace:** Besprechung, Ansprechpartner, Vertretung, Übergabe

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `der Urlaubsantrag` — žádost o dovolenou (A2)
2. `die Krankmeldung` — nemocenská hláška (A2)
3. `die Überstunden` (pl.) — přesčasy (A2)
4. `der Notausgang` — nouzový východ (A2)
5. `die Einarbeitung` — zapracování, zaškolení (B1)

---

### 2. AUTOMECHANIK
**Aktuální počet:** 76 (13 Q + 63 FQ)

**Aktuálně pokrytá témata:**
- Části vozidla (Motor, Bremse, Reifen, Batterie, Öl)
- Základní údržba a opravy
- Palivo, tlak v pneumatikách
- Základní nářadí

**Chybějící témata:**
- **Nástroje:** Hebebühne (zvedák), Drehmomentschlüssel, Diagnosegerät, OBD-Scanner, Ratsche, Steckschlüssel
- **BOZP:** Schutzhandschuhe, Augenschutz, Hebebühne sichern, Ölwanne (záchytná vana), Brandgefahr
- **Materiály a náhradní díly:** Ersatzteil, Dichtung, Filter (Luftfilter, Ölfilter), Zündkerze, Keilriemen, Bremsbelag
- **Komunikace s nadřízeným/zákazníkem:** Kostenvoranschlag (cenová nabídka), Reparaturauftrag, Reklamation, Übergabeprotokoll
- **Pracovní postupy:** Inspektion, HU/TÜV, Fehlercode, Probefahrt, Reparaturbericht
- **Administrativa:** Schichtübergabe, Reparaturauftrag ausfüllen
- **Situace a problémy:** Fahrzeug läuft nicht an, Kühlwasser, Leck, Getriebe

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `die Hebebühne` — zvedací plošina (A2)
2. `der Ersatzteil` — náhradní díl (A2)
3. `die Zündkerze` — zapalovací svíčka (B1)
4. `der Kostenvoranschlag` — cenová nabídka (B1)
5. `der Bremsbelag` — brzdové obložení (B1)

---

### 3. ELEKTRIKÁŘ
**Aktuální počet:** 76 (6 Q + 70 FQ)

**Aktuálně pokrytá témata:**
- Základní komponenty (Sicherung, Steckdose, Lichtschalter, Verteiler, Erdung)
- Měření napětí
- Instalace a zapojení
- Elektrická bezpečnost — základy

**Chybějící témata:**
- **Nástroje:** Bohrmaschine, Schraubenzieher, Abisolierzange (odizolovací kleště), Multimeter, Kabelzieher, Wasserwaage
- **BOZP:** Spannungsfreiheit prüfen, 5 Sicherheitsregeln, Schutzkleidung, Gefahren durch Strom, Absicherung der Baustelle
- **Materiály:** Kabeltypen (NYM, H07RN-F), Klemmleiste, Lichtbogen, Sicherungskasten, Unterverteilung
- **Komunikace s kolegou/mistr:** Auftrag erhalten, Abnahme, Protokoll, Prüfbericht, Mängel melden
- **Pracovní postupy:** Leitungsverlegung, Schaltplan lesen, Abnahme durch Elektromeister
- **Administrativa:** Stundenzettel, Regiebericht, Materialliste

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `die Abisolierzange` — odizolovací kleště (A2)
2. `der Sicherungskasten` — rozvaděč/pojistkový box (A2)
3. `das Multimeter` — multimetr (B1)
4. `die Spannungsfreiheit` — beznápěťový stav (B1)
5. `der Schaltplan` — schéma zapojení (B1)

---

### 4. GASTRO
**Aktuální počet:** 124 (34 Q + 90 FQ)

**Aktuálně pokrytá témata:**
- Kuchyňské vybavení (Pfanne, Topf, Messer, Schneidbrett)
- Suroviny (maso, bylinky, zelenina)
- Servírování (talíře, sklenice, jídelní lístek)
- Obsluha zákazníků (menu, platba, spropitné)
- Alergie, nápoje

**Chybějící témata:**
- **BOZP v kuchyni:** Rutschgefahr (kluzká podlaha), Brandgefahr, Erste Hilfe, Verbrennungsgefahr, Messersicherheit, HACCP
- **Hygiena:** Küchenhygiene, Händewaschen, Desinfektion, MHD (datum spotřeby), Kühlkette
- **Sklad a zásobování:** Bestand, Lieferung, Nachbestellung, Inventur, Lagerhaltung, Kühlraum
- **Komunikace v kuchyni:** Bestellung weitergeben, Ausgabe, Schichtwechsel, Mise en place, Reklamation
- **Administrativa:** Schichtplan, Dienstplan, Überstunden, Urlaub
- **Situace a problémy:** Küche ist voll, Bestellung vergessen, Gast reklamiert

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `die Rutschgefahr` — nebezpečí uklouznutí (A2)
2. `die Nachbestellung` — doobjednávka (B1)
3. `das HACCP` — systém bezpečnosti potravin (B2)
4. `die Kühlkette` — chladový řetězec (B2)
5. `der Schichtplan` — plán směn (A2)

---

### 5. INSTALATÉR
**Aktuální počet:** 76 (6 Q + 70 FQ)

**Aktuálně pokrytá témata:**
- Potrubí a instalace (Siphon, Rohrschelle, Boiler)
- Vodní systémy, kohoutky
- Opravy a těsnění
- Základní postupy

**Chybějící témata:**
- **Nástroje:** Rohrschlüssel (klíč na trubky), Rohrzange, Lötkolben (pájecí hrot), Wasserwaage, Säge, Dichtungsband (teflonová páska)
- **BOZP:** Wasserschaden, Gasgefahr, Schutzhandschuhe, Atemschutz, Baustelle absichern
- **Materiály:** Kupferrohr, PVC-Rohr, Verbundrohr, Dichtung, Muffe, T-Stück, Kugelhahn (kulový ventil)
- **Komunikace:** Auftrag besprechen, Kostenvoranschlag, Wasserschaden melden, Reklamation
- **Pracovní postupy:** Druckprüfung (tlaková zkouška), Abnahme, Leitungsplan lesen, Einregulierung
- **Situace a problémy:** Rohrbruch, Leckage, Wasserverlust, Heizung fällt aus

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `der Rohrschlüssel` — klíč na trubky (A2)
2. `das Dichtungsband` — teflonová páska (A2)
3. `der Kugelhahn` — kulový ventil (B1)
4. `die Druckprüfung` — tlaková zkouška (B1)
5. `der Rohrbruch` — prasknutí potrubí (B1)

---

### 6. KADEŘNÍK
**Aktuální počet:** 88 (16 Q + 72 FQ)

**Aktuálně pokrytá témata:**
- Základní nářadí (Schere, Kamm, Föhn)
- Mytí vlasů, stříhání
- Základní komunikace se zákazníkem
- Fénování

**Chybějící témata:**
- **Barvení a ošetření:** Haarfarbe, Färben, Tönung, Balayage, Dauerwelle, Strähnen, Aufhellen (zesvětlení), Ansatz (odrost)
- **Produkty:** Shampoo, Spülung, Haarkur, Haargel, Haarspray, Pflegekur
- **BOZP:** Schutzhandschuhe beim Färben, Chemikalienallergie, Lüftung, Hautschutz
- **Komunikace:** Kundenwunsch verstehen, Termin vereinbaren, Beratungsgespräch, Reklamation
- **Pracovní postupy:** Einwirkzeit (působení barvy), Spülen, Nachpflege, Einschätzen der Haarstruktur
- **Administrativa:** Terminbuch, Rechnung, Kassieren, Überstunden

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `die Haarfarbe` — barva na vlasy (A2)
2. `die Dauerwelle` — trvalá ondulace (B1)
3. `der Ansatz` — odrost (B1)
4. `die Einwirkzeit` — doba působení (B1)
5. `die Spülung` — kondicionér (A2)

---

### 7. KANCELÁŘ
**Aktuální počet:** 111 (35 Q + 76 FQ)

**Aktuálně pokrytá témata:**
- Kancelářský nábytek a vybavení (Schreibtisch, Computer, Drucker, Monitor)
- Komunikace (Email, Telefon, Meeting)
- Dokumenty a administrativa (Formulare, Projekt, Status)
- Home office, kolegové

**Chybějící témata:**
- **BOZP/ergonomie:** Bildschirmarbeitsplatz, ergonomischer Stuhl, Pausen einhalten, Datenschutz
- **Komunikace — pokročilejší:** formální email framing, Gesprächsleitung, Protokoll führen, Tagesordnung
- **Administrativa — dovolená/nemoc:** Urlaubsantrag, Krankmeldung, Abwesenheitsnotiz, Elternzeit
- **Digitální nástroje:** Videokonferenz, Screensharing, Cloud, Passwort, IT-Support
- **Projekty a termíny:** Projektplan, Meilenstein, Bericht, Zusammenfassung, Priorität

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `die Abwesenheitsnotiz` — automatická odpověď při nepřítomnosti (B1)
2. `die Tagesordnung` — program jednání (B1)
3. `der Meilenstein` — milník projektu (B2)
4. `die Videokonferenz` — videokonference (A2)
5. `der Datenschutz` — ochrana dat (B1)

---

### 8. POKLADNÍ
**Aktuální počet:** 94 (24 Q + 70 FQ)

**Aktuálně pokrytá témata:**
- Pokladna, účtenky, zákaznická karta
- Platební metody, vydávání drobných
- Nákupní vozíky, zboží
- Slevy, datum spotřeby, čárový kód
- Sklad a inventář

**Chybějící témata:**
- **BOZP:** Ergonomie an der Kasse, Rutschgefahr, Überfallsituation (přepadení pokladny), Brandschutz
- **Komunikace — problémy se zákazníkem:** Reklamation, Umtausch, Beschwerde, falsch gescannt
- **Sklad a příjem zboží:** Warenannahme, Lieferschein, MHD-Kontrolle, Verfalldatum prüfen, Rückgabe
- **Schichtübergabe:** Kassensturz (přepočítání pokladny), Fehlbetrag, Übergabe an Kollegen
- **Administrativa:** Schichtplan, Dienstplan, krank melden, Urlaubsantrag

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `die Reklamation` — reklamace (A2)
2. `der Kassensturz` — přepočítání pokladny (B1)
3. `die Warenannahme` — příjem zboží (B1)
4. `der Fehlbetrag` — schodek v pokladně (B1)
5. `der Umtausch` — výměna zboží (A2)

---

### 9. SYSTÉMY PRO HAŠENÍ
**Aktuální počet:** 249 (176 Q + 73 FQ) — **NEJVĚTŠÍ PROFESE**

**Aktuálně pokrytá témata:**
- Hasicí systémy (Sprinkleranlage, Löschanlage, Brandmeldeanlage)
- Požární bezpečnost a pohotovost (Notdienst)
- Údržba a servis
- Poruchy a závady
- Technické specifikace
- Předpisy a normy

**Chybějící témata:**
- **Komunikace se zákazníkem:** Angebot, Abnahme, Einweisung des Kunden, Wartungsvertrag
- **Administrativa:** Wartungsprotokoll, Abnahmeprotokoll, Regiebericht, Stundenzettel
- **Situace a problémy:** Fehlalarm, Systemausfall, Druckabfall, Leckage am Sprinkler
- **Normen a certifikace:** DIN-Norm, VdS-Richtlinie, Abnahmebehörde

**Navrhovaný počet nových:** 30 (10 Q + 20 FQ) — profese je již velmi rozsáhlá, méně nových

**Příklady nových slovíček:**
1. `der Fehlalarm` — falešný poplach (B1)
2. `der Wartungsvertrag` — servisní smlouva (B1)
3. `das Abnahmeprotokoll` — předávací protokol (B2)
4. `der Druckabfall` — pokles tlaku (B1)
5. `die VdS-Richtlinie` — předpis VdS (B2)

---

### 10. SESTŘIČKA
**Aktuální počet:** 92 (16 Q + 76 FQ)

**Aktuálně pokrytá témata:**
- Pacienti, symptomy (Fieber, Schmerzen, Schwindel)
- Léky, odběr krve
- Lékaři, vizita

**Chybějící témata:**
- **BOZP:** Hygiene/Händedesinfektion, Nadelstichverletzung, Patientenlifter, Schutzkleidung (Handschuhe, Schürze, Maske)
- **Zdravotnické přístroje:** Blutdruckmessgerät, Puls, EKG, Infusion, Tropf, Katheter, Sauerstoffgerät
- **Komunikace:** Übergabegespräch, Arztanweisung, Patientenakte, Pflegebericht, Dienstübergabe
- **Pracovní postupy:** Vitalzeichen messen, Verbandwechsel, Mobilisierung, Lagerung
- **Administrativa:** Dienstplan, Schichtdienst, Nachtschicht, Urlaubsantrag, Überstunden
- **Situace a problémy:** Notfall, Sturz des Patienten, Schmerzeskalation, Allergische Reaktion

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `die Blutdruckmessgerät` — tlakoměr (A2)
2. `der Verbandwechsel` — převaz (B1)
3. `die Dienstübergabe` — předání služby (B1)
4. `die Nadelstichverletzung` — poranění jehlou (B1)
5. `die Mobilisierung` — mobilizace pacienta (B2)

---

### 11. TRUHLÁŘ
**Aktuální počet:** 86 (17 Q + 69 FQ)

**Aktuálně pokrytá témata:**
- Dřevo a jeho druhy (Holz, Eichenholz, Brett)
- Stav dřeva (feucht — vlhkost)
- Zpracování, hrany, broušení
- Základní nástroje (Säge, Leim)

**Chybějící témata:**
- **Nástroje — rozšíření:** Hobel (hoblík), Stechbeitel (dlátko), Schleifmaschine, Bohrmaschine, Oberfräse (frézka), Schraubzwinge (svěrka), Zollstock (skládací metr)
- **BOZP:** Schutzbrille, Gehörschutz, Staubmaske (P3), Schutzhandschuhe, Abschirmung bei Maschinen
- **Materiály:** MDF, Sperrholz (překližka), Dübel (hmoždinka/dřevěný kolík), Beschläge (kování), Schraube, Nagel, Klarlack, Beize (mořidlo)
- **Komunikace:** Maße aufnehmen, Zeichnung besprechen, Auftrag bestätigen, Reklamation
- **Pracovní postupy:** Holz vermessen, Zapfen (tenon), Nut und Feder, Verleimen, Oberflächenbehandlung
- **Administrativa:** Stundenzettel, Auftragsliste

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `der Hobel` — hoblík (A2)
2. `die Schraubzwinge` — svěrka (A2)
3. `das Sperrholz` — překližka (B1)
4. `die Oberfräse` — frézka (B1)
5. `die Beize` — mořidlo (B2)

---

### 12. UČITEL
**Aktuální počet:** 80 (7 Q + 73 FQ)

**Aktuálně pokrytá témata:**
- Škola, žáci, domácí úkoly
- Vysvědčení, základní role
- Velmi základní větné vzorce (er ist, wir sind)

**Chybějící témata:**
- **Vybavení třídy:** Tafel, Kreide, Beamer, Whiteboard, Lehrmaterial, Schulbuch, Heft, Stift
- **BOZP/bezpečnost:** Schulordnung, Notausgang, Aufsichtspflicht, Erste Hilfe in der Schule
- **Komunikace s žáky:** Aufmerksamkeit, Disziplin, Frage stellen, Antwort geben, Erklären, Wiederholen
- **Komunikace s rodiči/kolegy:** Elternsprechtag, Lehrerkonferenz, Elternbrief
- **Administrativa:** Lehrplan, Stundenplan, Konferenz, Klassenarbeit, Zeugnis schreiben, Urlaubsantrag
- **Situace ve třídě:** Unterrichtsstörung, Test korrigieren, Gruppenarbeit, Hausaufgaben kontrollieren

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `die Tafel` — tabule (A2)
2. `der Beamer` — dataprojektor (A2)
3. `der Elternsprechtag` — rodičovský den (B1)
4. `die Aufsichtspflicht` — povinnost dozoru (B2)
5. `die Lehrerkonferenz` — pedagogická konference (B1)

---

### 13. UKLÍZEČKA
**Aktuální počet:** 94 (24 Q + 70 FQ)

**Aktuálně pokrytá témata:**
- Vybavení (Staubsauger, Wischer, Eimer, Besen)
- Čisticí prostředky (Reinigungsmittel)
- Odpadky, budova/patra
- Základní úklid a postupy

**Chybějící témata:**
- **BOZP:** Nassschild (značka mokrá podlaha), GHS-Symbole, Atemschutz, Schutzhandschuhe, Chemikalienbeständigkeit, Lüftung
- **Chemické prostředky:** Desinfektionsmittel, Schimmelentferner (odstraňovač plísní), Entkalker (odvápňovač), Glasreiniger, Sanitärreiniger
- **Prostory a typy úklidu:** WC reinigen, Fenster putzen, Treppe wischen, Büroreinigung, Unterhaltsreinigung vs. Grundreinigung
- **Komunikace s vedoucím/klientem:** Reinigungsplan, Checkliste, Sonderwunsch, Schlüsselübergabe
- **Administrativa:** Stundenzettel, Vertretung, Urlaubsantrag, krank melden

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `das Nassschild` — cedule „mokrá podlaha" (A2)
2. `der Entkalker` — odvápňovač (A2)
3. `das Desinfektionsmittel` — dezinfekční prostředek (A2)
4. `die Grundreinigung` — generální úklid (B1)
5. `die Checkliste` — kontrolní seznam (A2)

---

### 14. ZAHRADNÍK
**Aktuální počet:** 83 (14 Q + 69 FQ)

**Aktuálně pokrytá témata:**
- Rostliny a květiny (Blume, Baum)
- Zalévání (Gießkanne)
- Sečení trávy (Rasenmäher)
- Zemina, nástroje (Schaufel)
- Plot, živý plot (Hecke)

**Chybějící témata:**
- **Nástroje:** Heckenschere (zahradní nůžky), Motorsäge (motorová pila), Häcksler (štěpkovač), Rechen (hrábě), Spaten (rýč), Schubkarre (kolečko), Drucksprüher (tlakový postřikovač)
- **BOZP:** Sonnenschutz, Maschinensicherheit, Schutzhandschuhe, Gehörschutz bei Motorsäge, PSA
- **Materiály:** Erde/Kompost, Dünger (hnojivo), Pflanzenschutzmittel (přípravek na ochranu rostlin), Mulch, Rindenmulch, Blumenerde
- **Komunikace s klientem:** Kundenwunsch, Angebot, Rechnung, Wartungsvertrag (zahradnická smlouva)
- **Pracovní postupy:** Pflanzzeiten, Schädlingsbekämpfung, Bewässerungsplan, Baumschnitt
- **Administrativa:** Auftragszettel, Stundennachweis, Urlaubsantrag

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `die Heckenschere` — zahradní nůžky na živý plot (A2)
2. `der Dünger` — hnojivo (A2)
3. `der Häcksler` — štěpkovač (B1)
4. `das Pflanzenschutzmittel` — přípravek na ochranu rostlin (B1)
5. `der Baumschnitt` — řez stromu (B1)

---

### 15. ZEDNÍK
**Aktuální počet:** 85 (16 Q + 69 FQ)

**Aktuálně pokrytá témata:**
- Materiály (Zement, Mörtel)
- Staveniště, lešení (Gerüst)
- Zdi/zdění
- Stavební plány
- Základní nástroje (Hammer, Helm)

**Chybějící témata:**
- **Nástroje:** Maurerkelle (zednická lžíce), Wasserwaage (vodováha), Richtscheit (stahovací lať), Glätter (hladítko), Mischmaschine (míchačka), Schnur (šňůra), Abstandshalter
- **BOZP:** Absturzsicherung (zajištění proti pádu), Sicherheitsgurt, Schutzgitter, Staubschutz, Gehörschutz, PSA
- **Materiály:** Ziegel (cihla), Putz (omítka), Isolierung (izolace), Estrich (potěr), Dämmung, Bewehrung (armování), Betonmischer
- **Komunikace s Polier/kolegou:** Polier (vedoucí čety), Einweisung, Tagesplan besprechen, Mängel melden, Auftrag verstehen
- **Pracovní postupy:** Mauern (zdění), Verputzen (omítání), Estrich verlegen, Abstand einhalten, Maße übertragen, Schalpläne lesen
- **Administrativa:** Stundenzettel, Bautagebuch, Sicherheitsunterweisung unterschreiben

**Navrhovaný počet nových:** 50 (15 Q + 35 FQ)

**Příklady nových slovíček:**
1. `die Maurerkelle` — zednická lžíce (A2)
2. `die Wasserwaage` — vodováha (A2)
3. `der Putz` — omítka (A2)
4. `die Absturzsicherung` — zajištění proti pádu (B1)
5. `der Polier` — vedoucí čety/mistr (B1)

---

## SOUHRN — ROZSAH ROZŠÍŘENÍ

| Profese | Aktuálně | Nových | Celkem po rozšíření |
|---|---:|---:|---:|
| Obecné | 218 | 50 | ~268 |
| Automechanik | 76 | 50 | ~126 |
| Elektrikář | 76 | 50 | ~126 |
| Gastro | 124 | 50 | ~174 |
| Instalatér | 76 | 50 | ~126 |
| Kadeřník | 88 | 50 | ~138 |
| Kancelář | 111 | 50 | ~161 |
| Pokladní | 94 | 50 | ~144 |
| Systémy pro hašení | 249 | 30 | ~279 |
| Sestřička | 92 | 50 | ~142 |
| Truhlář | 86 | 50 | ~136 |
| Učitel | 80 | 50 | ~130 |
| Uklízečka | 94 | 50 | ~144 |
| Zahradník | 83 | 50 | ~133 |
| Zedník | 85 | 50 | ~135 |
| **CELKEM** | **1 673** | **~680** | **~2 353** |

**Každé „nové slovíčko" = 1 QUESTION (člen) + 2–3 FILL_QUESTIONS (věty) → cca 680 nových záznamů**

---

## PŘÍSTUP K IMPLEMENTACI (navrhovaný pořadí)

Pořadí podle priority (nejmenší profese nebo nejvíce chybějících témat):

1. Učitel (80 záznamů — nejvíce základní věty, nejméně oborového obsahu)
2. Instalatér + Elektrikář (76, řemesla s málo QUESTIONS)
3. Automechanik (76, málo QUESTIONS)
4. Zahradník + Zedník (83–85)
5. Truhlář + Kadeřník + Sestřička (86–92)
6. Pokladní + Uklízečka (94)
7. Kancelář (111)
8. Gastro (124)
9. Obecné (218 — doplnění admin)
10. Systémy pro hašení (249 — jen 30 nových)

---

## OTÁZKY PRO SCHVÁLENÍ

Před tím, než začnu generovat slovíčka, potřebuji tvé odpovědi na tyto otázky:

### A) Jazyky překladu
1. Každé slovíčko má CS, KO, EN, PL překlad. Potvrďte, že všechny 4 jazyky jsou i nadále povinné pro nová slovíčka.

### B) Formát QUESTIONS
2. QUESTIONS jsou aktuálně výhradně ve formátu „Jaký člen má [Slovo]?" (procvičování členů der/die/das). Mám tento formát zachovat i pro nová slovíčka, nebo chceš přidat jiné typy otázek (např. překlad slova, výběr ze synonym)?

### C) Formát FILL_QUESTIONS
3. Fill questions mají vždy jedno doplňované slovo (jedno `___`). Mám zachovat tento formát, nebo mohu přidávat i věty se dvěma mezerami nebo výběrem z více slov?

### D) Délka a složitost vět
4. FILL_QUESTIONS jsou aktuálně převážně krátké věty (5–10 slov). Mám pro B2 úroveň psát delší nebo komplexnější věty, nebo raději kratší a přímé?

### E) Priorita profesí
5. Souhlasíš s navrhovaným pořadím implementace (začínám od nejmenších profesí), nebo máš preferenci — např. nejdřív řemesla, nebo konkrétní profese která tě nejvíc zajímá?

### F) Systémy pro hašení
6. Tato profese má 249 záznamů — výrazně více než ostatní. Navrhuju přidat jen 30 nových. Souhlasíš, nebo chceš rovněž 50?

### G) Administrativa (dovolená, nemoc, přesčas)
7. Administrativní slovíčka (Urlaubsantrag, Krankmeldung, Überstunden) by logicky patřila do „obecné" i do konkrétní profese. Mám je dávat výhradně do `obecné`, nebo je opakovat i u konkrétních profesí (kde je kontext jiný)?

### H) Správnost němčiny
8. Mám přistupovat k němčině jako nativní mluvčí (Standarddeutsch), nebo zohledňovat regionální variace (Österreichisch/Schweizerdeutsch)? Příklad: „Jänner" vs. „Januar".

### I) Batch vs. vše najednou
9. Chceš slovíčka generovat profesi po profesi (postupně, s tvou kontrolou po každé), nebo všechny najednou a pak projít celý výsledek?

### J) Scrabble/Wortpaare data
10. Soubor obsahuje i data pro Scrabble (`crosswordGenerator.ts`) a Wortpaare. Chceš nová slovíčka přidat i do těchto her, nebo pouze do QUESTIONS a FILL_QUESTIONS?
