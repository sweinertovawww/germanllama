# GermanLlama — Visual Brand Style Guide for Image Generation

Tento soubor definuje jednotný vizuální styl značky GermanLlama.
Používej ho jako základ při každém generování obrázků nebo videí přes Google AI Studio (Imagen / Veo).

---

## 1. Identita značky

- **Název:** GermanLlama / germanllama.com
- **Zaměření:** Výuka němčiny pro česky a slovensky mluvící pracovníky v Německu
- **Tón:** Mix humoru a vzdělávání — přátelský, lehký, ale věcný
- **Hlavní postava:** Pixel art lama s německou šálou a slunečními brýlemi (viz referenční logo)

---

## 2. Vizuální styl — NIKDY NEMĚNIT

Toto jsou neměnné prvky stylu, které musí být přítomny ve VŠECH generovaných obrázcích:

### Styl kresby
- **Pixel art / 8-bit retro styl** — vždy, bez výjimky
- Čtvercové pixely s tvrdými hranami (žádné rozmazání, žádný gradient na postavě)
- Omezená barevná paleta s černými obrysy kolem objektů
- Estetika retro videoher (Minecraft, staré RPG)

### Lama — charakter
- Krémově bílá lama v pixel art stylu
- **Šála v barvách německé vlajky:** černá, červená, žlutá — VŽDY přítomna
- **Tmavé sluneční brýle** — VŽDY přítomny (definují osobnost postavy)
- Výraz: sebejistý, trochu drzý, ale sympatický
- Velikost: lama je vždy jasně rozpoznatelná, ne miniaturní

### Barvy pozadí a prostředí
- Pozadí se MŮŽE měnit podle scény (auto, továrna, stavba, příroda...)
- Vždy zachovat pixel art styl i v pozadí
- Zlatožlutá záře (glow) za lamou je volitelná, ale doporučená pro hero obrázky
- Neutrální šedé pozadí pouze pro logo varianty

### Co se NESMÍ měnit
- Pixel art styl (žádný realistický, žádný 3D render, žádná fotografie)
- Šála v barvách německé vlajky
- Sluneční brýle
- Krémová barva lamy

---

## 3. Použití lamy v kompozici

Lama může vystupovat různými způsoby podle potřeby:

| Typ použití | Popis |
|---|---|
| **Hero / hlavní postava** | Lama v popředí, velká, dominantní — pro podcast cover, Reels thumbnail |
| **V akci** | Lama dělá něco (řídí auto, drží nástroj, stojí na stavbě) — pro reklamní posty |
| **Brand element** | Lama menší, v rohu nebo jako doplněk scény — pro web bannery |

---

## 4. Formáty podle platformy

| Platforma | Formát | Rozlišení |
|---|---|---|
| Instagram / Facebook Reels (thumbnail) | 1:1 nebo 9:16 | 1080x1080 nebo 1080x1920 |
| Podcast cover | 1:1 | 3000x3000 (nebo min. 1400x1400) |
| Web germanllama.com | 16:9 nebo 1:1 | 1200x675 nebo 1200x1200 |

---

## 5. Text v obrázku (volitelné)

Text se přidává pouze pokud je explicitně požadován.

### Pravidla pro text v obrázku:
- **Font:** Pixel / retro styl (konzistentní s celkovým stylem)
- **Barvy textu:** bílá s černým outline, nebo žlutá s černým outline
- **Obsah textu:** německé slovíčko, název epizody, krátká fráze
- **Umístění:** spodní část obrázku nebo vedle lamy — nikdy přes postavu
- Pokud text není zadán → negeneruj žádný text v obrázku

---

## 6. Prompt šablona pro Google AI Studio (Imagen)

Při každém generování obrázku použij tuto základní šablonu a doplň [SCÉNA]:

### Základní prompt (vždy použít):
```
Pixel art style, 8-bit retro aesthetic, cream-white llama character with black sunglasses and a scarf in German flag colors (black, red, yellow), [SCÉNA], hard pixel edges, limited color palette, black outlines, retro video game sprite aesthetic, warm golden glow behind the llama, friendly and slightly humorous mood
```

### Příklady [SCÉNA]:
- `sitting in a car at a German factory parking lot, pixel art background`
- `standing on a construction site holding a wrench, pixel art background`
- `in a warehouse with shelves, looking confident, pixel art background`
- `on a green meadow with mountains in background, pixel art style`
- `at a German language classroom with a blackboard, pixel art background`

### Negative prompt — vždy přidat:
```
no realistic style, no 3D render, no photograph, no smooth gradients on character, no missing scarf, no missing sunglasses, no different llama color
```

---

## 7. Prompt šablona pro krátká videa (Veo / Google AI Studio)

### Základní prompt:
```
Pixel art animation, 8-bit retro style, cream-white llama character with black sunglasses and German flag scarf (black, red, yellow), [AKCE], smooth pixel animation, limited color palette, retro game aesthetic, warm and humorous mood, 5-10 seconds loop
```

### Příklady [AKCE]:
- `llama driving a small car and waving`
- `llama walking through a factory floor confidently`
- `llama pointing at a German word on a chalkboard`

---

## 8. Pojmenování souborů

```
gl_{typ}_{scena_klic}_{format}_{verze}.png
```

Příklady:
- `gl_hero_auto_1x1_v1.png`
- `gl_podcast_cover_v2.png`
- `gl_reel_stavba_9x16_v1.png`
- `gl_web_banner_sklad_v1.png`

---

## 9. Referenční soubor

Ulož originální logo jako referenci do složky projektu:
```
./reference/germanllama_logo_original.png
```

Při každém generování nového obrázku zkontroluj, že výsledek vizuálně odpovídá referenčnímu logu — zejména styl pixelů, šála a brýle.

---

## 10. Rychlý checklist před odesláním promptu

- [ ] Obsahuje prompt "pixel art style, 8-bit retro"?
- [ ] Je zmíněna šála v barvách německé vlajky?
- [ ] Jsou zmíněny sluneční brýle?
- [ ] Je přidán negative prompt?
- [ ] Sedí formát na cílovou platformu?
- [ ] Je soubor pojmenován podle konvence?
