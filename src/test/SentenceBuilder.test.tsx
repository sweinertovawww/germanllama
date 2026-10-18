import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SentenceBuilder from "@/pages/SentenceBuilder";

const store = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => { store.set(k, String(v)); },
  removeItem: (k: string) => { store.delete(k); },
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
}});
Object.defineProperty(window, "localStorage", { configurable: true, value: globalThis.localStorage });
window.matchMedia = window.matchMedia ?? ((q: string) => ({ matches: false, media: q, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false }));

it("restores saved round with fresh Czech translations", () => {
  localStorage.clear(); localStorage.setItem("gl_lang", "cs");
  localStorage.setItem("sb-game-state", JSON.stringify({
    pairs: [{ id: 0, fullGerman: "Den Schaltplan genau lesen.", translation: "배선도를 정확하게 읽으십시오.", start: "Den Schaltplan", end: "genau lesen.", matched: false, profession: "elektrikář" }],
    score: 0, totalScore: 0, completedRounds: 0,
  }));
  render(<MemoryRouter><LanguageProvider><SentenceBuilder /></LanguageProvider></MemoryRouter>);
  expect(screen.getByText(/Přesně číst schéma zapojení\./)).toBeTruthy();
  expect(screen.queryByText(/배선도/)).toBeNull();
});

it("drops saved state with unknown sentences", () => {
  localStorage.clear(); localStorage.setItem("gl_lang", "cs");
  localStorage.setItem("sb-game-state", JSON.stringify({
    pairs: [{ id: 0, fullGerman: "Gibt es nicht.", translation: "x", start: "Gibt es", end: "nicht.", matched: false, profession: "x" }],
    score: 0, totalScore: 0, completedRounds: 0,
  }));
  render(<MemoryRouter><LanguageProvider><SentenceBuilder /></LanguageProvider></MemoryRouter>);
  expect(screen.queryByText("Gibt es")).toBeNull();
});
