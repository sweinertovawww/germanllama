#!/usr/bin/env node
/**
 * Translates all Czech `translation` values in vocabularyData.ts to Korean
 * using the free Google Translate endpoint (no API key required).
 *
 * Usage:
 *   node scripts/translate-to-korean-free.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE_PATH = join(__dirname, "../src/game/vocabularyData.ts");
const DELAY_MS = 80; // polite delay between requests

const source = readFileSync(FILE_PATH, "utf8");

const PATTERN = /translation: "([^"]*)"/g;
const matches = [];
let m;
while ((m = PATTERN.exec(source)) !== null) {
  matches.push({ index: m.index, full: m[0], value: m[1] });
}
console.log(`Found ${matches.length} translations.`);

async function translateOne(text) {
  if (!text.trim()) return text;
  const url =
    "https://translate.googleapis.com/translate_a/single" +
    `?client=gtx&sl=cs&tl=ko&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for: ${text}`);
  const data = await res.json();
  // data[0] is array of [translated, original, ...] chunks
  return data[0].map((chunk) => chunk[0]).join("");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const translated = [];
for (let i = 0; i < matches.length; i++) {
  const { value } = matches[i];
  process.stdout.write(`[${i + 1}/${matches.length}] ${value.slice(0, 50)} → `);
  try {
    const ko = await translateOne(value);
    translated.push(ko);
    console.log(ko.slice(0, 60));
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    translated.push(value); // keep original on error
  }
  await sleep(DELAY_MS);
}

// Replace back-to-front to preserve indices
let output = source;
for (let i = matches.length - 1; i >= 0; i--) {
  const { index, full } = matches[i];
  const safe = translated[i].replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const replacement = `translation: "${safe}"`;
  output = output.slice(0, index) + replacement + output.slice(index + full.length);
}

writeFileSync(FILE_PATH, output, "utf8");
console.log(`\nDone! Translated ${translated.length} entries.`);
