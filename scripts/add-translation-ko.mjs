#!/usr/bin/env node
/**
 * Merges Czech (from git) and Korean (current file) translations.
 * Result: each entry gets  translation: "česky"  AND  translationKo: "한국어"
 *
 * Usage:  node scripts/add-translation-ko.mjs
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/game/vocabularyData.ts");

// ── 1. Read both versions ──────────────────────────────────────────────────
const czechSource = execSync("git show 2a55952:src/game/vocabularyData.ts").toString();
const koreanSource = readFileSync(FILE, "utf8");

// ── 2. Extract translation values in order ────────────────────────────────
const PATTERN = /translation: "([^"]*)"/g;

function extractAll(src) {
  const vals = [];
  let m;
  const re = /translation: "([^"]*)"/g;
  while ((m = re.exec(src)) !== null) vals.push(m[1]);
  return vals;
}

const czechVals  = extractAll(czechSource);
const koreanVals = extractAll(koreanSource);

if (czechVals.length !== koreanVals.length) {
  console.error(`Mismatch: ${czechVals.length} Czech vs ${koreanVals.length} Korean`);
  process.exit(1);
}
console.log(`Found ${czechVals.length} translations — merging...`);

// ── 3. Build output: replace each  translation: "KO"
//      with  translation: "CS"  translationKo: "KO"  ──────────────────────
let output = koreanSource;
const matches = [];
let m2;
const RE2 = /translation: "([^"]*)"/g;
while ((m2 = RE2.exec(koreanSource)) !== null) {
  matches.push({ index: m2.index, full: m2[0] });
}

// Replace back-to-front
for (let i = matches.length - 1; i >= 0; i--) {
  const { index, full } = matches[i];
  const cs = czechVals[i].replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const ko = koreanVals[i].replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const replacement = `translation: "${cs}", translationKo: "${ko}"`;
  output = output.slice(0, index) + replacement + output.slice(index + full.length);
}

// ── 4. Update interfaces ───────────────────────────────────────────────────
output = output
  .replace(
    /export interface Question \{[^}]+\}/s,
    (m) => m.includes("translationKo") ? m : m.replace("translation: string;", "translation: string;\n  translationKo: string;")
  )
  .replace(
    /export interface FillQuestion \{[^}]+\}/s,
    (m) => m.includes("translationKo") ? m : m.replace("translation: string;", "translation: string;\n  translationKo: string;")
  );

// ── 5. Write ───────────────────────────────────────────────────────────────
writeFileSync(FILE, output, "utf8");
console.log("Done! Each entry now has  translation (Czech) + translationKo (Korean).");
