# GermanLlama — Cartoon Animation Style Guide
# Pro generování animovaných scén a krátkých videí přes Google AI Studio (Veo / Imagen)
# Aktualizováno: květen 2026

---

## 1. Identita stylu

Tento styl se používá pro animované scény a krátká videa — primárně pro podcast vizuály a YouTube.
Je to **odlišný styl od pixel art loga**, ale stále součást značky GermanLlama.

- **Styl:** 2D flat cartoon, raná 2000s evropská animace — jednoduchý, světlý, plošší
- **NENÍ:** Disney, Pixar, Shrek, moderní 3D animace, anime
- **Mood:** Přátelský, lehký humor, každodenní situace
- **Použití:** Podcast thumbnail, YouTube intro/outro, krátké animované clipy

---

## 2. Vizuální styl — NIKDY NEMĚNIT

### Styl kresby
- **2D flat cartoon** — hladké křivky, tenké čisté obrysy (lineart)
- Světlá pastelová barevná paleta — nic přesyceného, nic tmavého
- Minimální stínování — ne ploché jako ikona, ale ne realistické stíny
- Estetika klasické evropské animace z počátku 2000s
- Žádné pixely, žádný 3D render, žádná fotografie, žádné anime

### Barvy
- Světlé, jemné pastelové tóny — béžová, světle modrá, teplá bílá, měkká zelená
- Minimální kontrast — nic křiklavého
- Čisté jednoduché pozadí scény — ne přeplácané

### Co se NESMÍ měnit
- 2D flat styl
- Pastelová paleta
- Tenké čisté obrysy
- Early 2000s estetika

---

## 3. Hlavní postava — "Lara"

Lara je hlavní lidská postava. Musí být **konzistentní ve všech obrázcích a videích**.

### Vzhled — NEMĚNIT
- **Pohlaví:** Žena
- **Věk:** 20–30 let, mladá dospělá
- **Vlasy:** Tmavě hnědé, středně dlouhé, lehce rozcuchané, sepnuté nahoru
- **Oblečení:** Casual — svetr, džíny (mění se podle scény, vždy casual)
- **Výraz:** Sebejistý úsměv — "zvládnu to"
- **Charakter:** Obyčejná dívka v běžných situacích — ne učitelka, ne expertka

### Co se NESMÍ měnit
- Tmavě hnědé vlasy sepnuté nahoru
- 2D flat cartoon proporce
- Casual oblečení
- Přátelský sebejistý výraz

---

## 4. Vedlejší postavy

### Kočka
- Roztomilá kreslená kočka, stejný 2D flat styl
- Výraz: zvědavý, trochu líný, komický
- Konzistentní barva v rámci jedné série epizod

### Ostatní postavy
- Stejný 2D flat cartoon styl jako Lara
- Různé typy podle scény (kolegové, zákazníci, spolužáci...)

---

## 5. Typy scén

| Typ scény | Popis | Příklad použití |
|---|---|---|
| **Intro scéna** | Lara v prostředí relevantním k tématu epizody | Epizoda o autě → Lara u auta |
| **Situační scéna** | Lara v akci — dělá něco, reaguje | Lara v práci, v obchodě, doma |
| **Dialogová scéna** | Lara mluví s jinou postavou | Rozhovor s kolegou v němčině |
| **Kočičí moment** | Kočka dělá něco komického | Kočka sedí na klávesnici |
| **Thumbnail hero** | Lara v popředí, pozadí scény za ní | Hlavní obrázek epizody |

---

## 6. Prompt šablona pro Google AI Studio — VIDEO (Veo)

### ✅ Základní prompt (vždy použít, doplň [POPIS SCÉNY]):
```
2D flat cartoon animation, simple clean lineart style, light pastel color palette, minimal shading, thin clean outlines, early 2000s cartoon aesthetic similar to classic European animation, NOT Disney, NOT Pixar, NOT 3D render. Young woman in her 20s with dark brown medium-length slightly messy hair tied up, casual sweater, confident smile. [POPIS SCÉNY]. Soft sunny day atmosphere. Smooth simple animation, no music, no sound effects, silent video, 8 seconds.
```

### Příklady [POPIS SCÉNY]:
- `She is standing outside a university building holding a diploma and a coffee mug, looking proud but slightly overwhelmed. Other students walking in background.`
- `She is sitting in a car at a factory parking lot, looking at a map on her phone, slightly confused but calm.`
- `She is walking through a warehouse with shelves, holding a clipboard, looking around curiously.`
- `She is at home on a couch, laptop open, cat sitting next to her, studying German words on screen.`
- `She is at a construction site wearing a casual jacket, talking to a colleague, gesturing with hands.`

### ❌ Negative prompt — vždy přidat:
```
no 3D render, no Pixar style, no Disney style, no Shrek style, no realistic textures, no heavy shading, no dramatic lighting, no bright saturated colors, no music, no audio
```

---

## 7. Prompt šablona pro Google AI Studio — OBRÁZEK (Imagen)

Nejdřív vždy vygeneruj **statický obrázek** pro ověření stylu, pak teprve video!

### ✅ Základní prompt:
```
2D flat cartoon illustration, simple clean lineart style, light pastel color palette, minimal shading, thin clean outlines, early 2000s cartoon aesthetic, classic European animation style, NOT Disney, NOT Pixar, NOT 3D. Young woman in her 20s with dark brown medium-length slightly messy hair tied up, casual sweater, confident smile. [POPIS SCÉNY]. Soft sunny day, simple clean background, flat illustration style.
```

### ❌ Negative prompt:
```
no 3D render, no Pixar, no Disney, no Shrek, no realistic textures, no heavy shading, no dramatic lighting, no saturated colors, no anime
```

### Doporučený model:
- **Imagen 3** — nejlepší pro ilustrace, rychlé a levné

---

## 8. Workflow — správné pořadí

```
1. Vygeneruj OBRÁZEK (Imagen 3) → ověř styl
2. Pokud styl sedí → ulož frame jako lara_reference.png
3. Teprve pak generuj VIDEO (Veo 3.1 lite pro testy, Veo 3.1 fast pro finál)
4. Ulož video podle konvence pojmenování
```

---

## 9. Nastavení videa (Veo)

| Parametr | Doporučení |
|---|---|
| Model | Veo 3.1 lite pro testy ($0.05), Veo 3.1 fast pro finál ($0.15) |
| Délka | 8 sekund |
| Formát | 16:9 pro YouTube, 9:16 pro Reels |
| Rozlišení | 720p pro testy, 1080p pro finál |
| Zvuk | Vždy vypnuto — "no music, no sound effects, silent video" |

---

## 10. Konzistence postavy napříč videi

1. **Vždy používej stejný detailní popis Lary** ze sekce 3 — nekrať ho
2. **Referenční obrázek:** `./reference/lara_reference.png` — ulož první zdařilý výsledek
3. Při dalším generování přidej: `character design consistent with reference style`
4. Pokud výsledek nesedí → uprav prompt, přidej více detailů o vlasech a oblečení

---

## 11. Pojmenování souborů

```
gl_cartoon_{typ}_{tema}_{format}_{verze}.mp4
gl_cartoon_{typ}_{tema}_{format}_{verze}.png
```

Příklady:
- `gl_cartoon_intro_promoce_16x9_v1.mp4`
- `gl_cartoon_thumbnail_ep03_16x9_v1.png`
- `gl_cartoon_kocka_kuchyne_9x16_v1.mp4`

---

## 12. Vztah k pixel art stylu (GermanLlama logo)

| Pixel art styl | Cartoon styl |
|---|---|
| Logo, brand assets, reklamy | Podcast videa, YouTube |
| Lama s šálou a brýlemi | Lara + kočka + vedlejší postavy |
| Statické obrázky | Animované scény, videa |
| `CLAUDE.md` v `germanllama-logo/` | `CLAUDE_cartoon.md` v `germanllama-video/` |

---

## 13. Rychlý checklist před odesláním promptu

- [ ] Obsahuje prompt "2D flat cartoon, simple clean lineart, early 2000s"?
- [ ] Je "NOT Disney, NOT Pixar, NOT 3D render" v promptu?
- [ ] Je popsána Lara — tmavě hnědé vlasy sepnuté nahoru, svetr, sebejistý úsměv?
- [ ] Je přidán negative prompt?
- [ ] Je v promptu "no music, no sound effects, silent video"?
- [ ] Je specifikován formát (16:9 / 9:16)?
- [ ] Byl nejdřív vygenerován testovací obrázek (Imagen)?
- [ ] Je soubor pojmenován podle konvence?
