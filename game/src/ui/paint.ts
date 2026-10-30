import type { Puzzle } from "../game/nonogram";

const hex = (c: string) => { const n = parseInt(c.slice(1, 7), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const toHex = (rgb: number[]) => `#${rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`;
/** Blend colour a toward b by t (0 = a, 1 = b). */
export const mix = (a: string, b: string, t: number) => { const x = hex(a), y = hex(b); return toHex(x.map((v, k) => v + (y[k] - v) * t)); };

/**
 * The finished picture as a painting rather than a silhouette: every shape keeps an inked outline (its edge cells)
 * and is washed inside with colour — the island's hue for ink-only pictures (two tones: a lighter heart, a richer
 * rim), a deeper shade of its own colour for coloured ones. Returns one colour per cell ("" = paper).
 */
export function paintedColors(p: Puzzle, hue: string): string[] {
  const at = (r: number, c: number) => (r < 0 || c < 0 || r >= p.h || c >= p.w ? 0 : p.solution[r * p.w + c]);
  const depth = (r: number, c: number, v: number) => {
    // 1 = on the shape's edge, 2 = one cell in, 3 = deeper inside.
    for (let d = 1; d <= 2; d++)
      for (let dr = -d; dr <= d; dr++) for (let dc = -d; dc <= d; dc++) if (Math.abs(dr) + Math.abs(dc) <= d && at(r + dr, c + dc) !== v) return d;
    return 3;
  };
  const inkOnly = p.palette.length === 1;
  return p.solution.map((v, i) => {
    if (!v) return "";
    const r = Math.floor(i / p.w), c = i % p.w;
    const base = p.palette[v - 1] ?? "#1F2A3A";
    const d = depth(r, c, v);
    if (inkOnly) return d === 1 ? base : d === 2 ? mix(hue, base, 0.28) : mix(hue, "#FFF6DE", 0.12);
    return d === 1 ? mix(base, "#1F2A3A", 0.32) : d === 2 ? base : mix(base, "#FFF6DE", 0.16);
  });
}
