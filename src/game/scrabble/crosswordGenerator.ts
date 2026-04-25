import { QUESTIONS, type Profession } from "@/game/vocabularyData";

export interface WordEntry {
  german: string;
  czech: string;
  article: string;
}

export interface PlacedWord {
  word: string;
  entry: WordEntry;
  row: number;
  col: number;
  direction: "H" | "V";
  number: number;
}

export interface CrosswordData {
  grid: (string | null)[][];
  placed: PlacedWord[];
  rows: number;
  cols: number;
}

const ARTICLES = ["der", "die", "das"];

function getGermanWord(text: string): string {
  const m = text.match(/má\s+(.+?)\?/);
  return m ? m[1].trim() : text.replace("?", "").trim();
}

export function getWordsForProfession(professions: Profession[]): WordEntry[] {
  const qs = professions.length === 0
    ? QUESTIONS
    : QUESTIONS.filter(q => professions.includes(q.profession));

  return qs
    .map(q => ({
      german: getGermanWord(q.text).toUpperCase(),
      czech: q.translation,
      article: ARTICLES[q.correct],
    }))
    .filter(w => w.german.length >= 4 && w.german.length <= 12);
}

function shuffle<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

export function generateCrossword(words: WordEntry[], maxWords = 7): CrosswordData {
  const SIZE = 30;
  const grid: (string | null)[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  const placed: PlacedWord[] = [];
  const candidates = shuffle(words).slice(0, Math.max(maxWords + 5, 15));

  if (candidates.length === 0) {
    return { grid: [], placed: [], rows: 0, cols: 0 };
  }

  // Place first word horizontally in center
  const first = candidates[0];
  const startRow = Math.floor(SIZE / 2);
  const startCol = Math.floor((SIZE - first.german.length) / 2);
  for (let i = 0; i < first.german.length; i++) {
    grid[startRow][startCol + i] = first.german[i];
  }
  placed.push({ word: first.german, entry: first, row: startRow, col: startCol, direction: "H", number: 1 });

  // Try to place remaining words
  for (let ci = 1; ci < candidates.length && placed.length < maxWords; ci++) {
    const entry = candidates[ci];
    const w = entry.german;
    let bestPlacement: { row: number; col: number; dir: "H" | "V" } | null = null;

    // Try to intersect with already placed words
    for (const p of placed) {
      for (let pi = 0; pi < p.word.length; pi++) {
        for (let wi = 0; wi < w.length; wi++) {
          if (p.word[pi] !== w[wi]) continue;

          // If placed word is H, try new word V (and vice versa)
          const newDir: "H" | "V" = p.direction === "H" ? "V" : "H";
          let newRow: number, newCol: number;

          if (p.direction === "H") {
            // Intersection at p's column startCol+pi, new word goes vertical
            newCol = p.col + pi;
            newRow = p.row - wi;
          } else {
            // Intersection at p's row startRow+pi, new word goes horizontal
            newRow = p.row + pi;
            newCol = p.col - wi;
          }

          if (canPlace(grid, w, newRow, newCol, newDir, placed)) {
            bestPlacement = { row: newRow, col: newCol, dir: newDir };
            break;
          }
        }
        if (bestPlacement) break;
      }
      if (bestPlacement) break;
    }

    if (bestPlacement) {
      const { row, col, dir } = bestPlacement;
      for (let i = 0; i < w.length; i++) {
        const r = dir === "H" ? row : row + i;
        const c = dir === "H" ? col + i : col;
        grid[r][c] = w[i];
      }
      placed.push({ word: w, entry, row, col, direction: dir, number: placed.length + 1 });
    }
  }

  // Calculate bounding box
  let minR = SIZE, maxR = 0, minC = SIZE, maxC = 0;
  for (const p of placed) {
    for (let i = 0; i < p.word.length; i++) {
      const r = p.direction === "H" ? p.row : p.row + i;
      const c = p.direction === "H" ? p.col + i : p.col;
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
      minC = Math.min(minC, c);
      maxC = Math.max(maxC, c);
    }
  }

  const rows = maxR - minR + 1;
  const cols = maxC - minC + 1;
  const croppedGrid: (string | null)[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => grid[minR + r][minC + c])
  );

  const adjustedPlaced = placed.map(p => ({
    ...p,
    row: p.row - minR,
    col: p.col - minC,
  }));

  return { grid: croppedGrid, placed: adjustedPlaced, rows, cols };
}

function canPlace(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  dir: "H" | "V",
  placed: PlacedWord[]
): boolean {
  const SIZE = grid.length;

  for (let i = 0; i < word.length; i++) {
    const r = dir === "H" ? row : row + i;
    const c = dir === "H" ? col + i : col;

    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return false;

    const existing = grid[r][c];
    if (existing !== null && existing !== word[i]) return false;

    // Check adjacent cells (perpendicular)
    if (existing === null) {
      if (dir === "H") {
        // Check above and below
        if (r > 0 && grid[r - 1][c] !== null) return false;
        if (r < SIZE - 1 && grid[r + 1][c] !== null) return false;
      } else {
        // Check left and right
        if (c > 0 && grid[r][c - 1] !== null) return false;
        if (c < SIZE - 1 && grid[r][c + 1] !== null) return false;
      }
    }
  }

  // Check cell before and after word
  if (dir === "H") {
    if (col > 0 && grid[row][col - 1] !== null) return false;
    if (col + word.length < SIZE && grid[row][col + word.length] !== null) return false;
  } else {
    if (row > 0 && grid[row - 1][col] !== null) return false;
    if (row + word.length < SIZE && grid[row + word.length][col] !== null) return false;
  }

  return true;
}
