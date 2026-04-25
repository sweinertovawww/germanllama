#!/usr/bin/env node
/**
 * Translates all Czech `translation` values in vocabularyData.ts to Korean.
 * Uses Anthropic API via fetch in batches of 100.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/translate-to-korean.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE_PATH = join(__dirname, "../src/game/vocabularyData.ts");
const BATCH_SIZE = 100;
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error("❌  Chybí ANTHROPIC_API_KEY. Spusť jako:");
  console.error("    ANTHROPIC_API_KEY=sk-ant-... node scripts/translate-to-korean.mjs");
  process.exit(1);
}

// ── 1. Read file ──────────────────────────────────────────────────────────────
const source = readFileSync(FILE_PATH, "utf8");

// ── 2. Extract all translation values with their positions ────────────────────
const PATTERN = /translation: "([^"]*)"/g;
const matches = [];
let m;
while ((m = PATTERN.exec(source)) !== null) {
  matches.push({ index: m.index, full: m[0], value: m[1] });
}
console.log(`✅  Nalezeno ${matches.length} překladů.`);

// ── 3. Translate in batches ───────────────────────────────────────────────────
async function translateBatch(texts) {
  const prompt = `Translate the following Czech words/phrases to Korean.
These are translations of German vocabulary used in a language-learning app for workers (trades, office, etc.).
Return ONLY a JSON array of strings — same order, same count, no extra keys.

Czech phrases:
${JSON.stringify(texts)}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.content[0].text.trim();

  // Strip markdown code fences if present
  const json = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/, "");
  const result = JSON.parse(json);

  if (!Array.isArray(result) || result.length !== texts.length) {
    throw new Error(
      `Neočekávaný výsledek: čekalo se ${texts.length} položek, přišlo ${result?.length}`
    );
  }
  return result;
}

const allValues = matches.map((m) => m.value);
const translated = [];

for (let i = 0; i < allValues.length; i += BATCH_SIZE) {
  const batch = allValues.slice(i, i + BATCH_SIZE);
  const end = Math.min(i + BATCH_SIZE, allValues.length);
  process.stdout.write(`⏳  Překládám ${i + 1}–${end} / ${allValues.length} ...`);
  const result = await translateBatch(batch);
  translated.push(...result);
  console.log(" ✓");
}

// ── 4. Replace in source (back-to-front to preserve indices) ─────────────────
let output = source;
for (let i = matches.length - 1; i >= 0; i--) {
  const { index, full, value } = matches[i];
  const koreanValue = translated[i];
  // Escape any double quotes in the Korean text (shouldn't happen but be safe)
  const safe = koreanValue.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const replacement = `translation: "${safe}"`;
  output = output.slice(0, index) + replacement + output.slice(index + full.length);
}

// ── 5. Write result ───────────────────────────────────────────────────────────
writeFileSync(FILE_PATH, output, "utf8");
console.log(`\n🎉  Hotovo! Soubor uložen: src/game/vocabularyData.ts`);
console.log(`    Celkem přeloženo: ${translated.length} položek.`);
