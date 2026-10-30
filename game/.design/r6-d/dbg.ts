import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { A } from "./s5";
const s0: any = A[1];
const art = s0.art.trim().replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c: string) => c.toLowerCase());
const g = art.split("\n"); const hist: Record<string, number> = {};
for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) for (const t of ".ab") { if (g[y][x] === t) continue;
  const a2 = g.map((r: string, k: number) => (k === y ? r.slice(0, x) + t + r.slice(x + 1) : r)).join("\n");
  const r = logicSolve(buildPuzzle({ ...s0, art: a2 })); const key = r.unique ? "U" : r.contradiction ? "C" : String(Math.min(50, r.unknown)); hist[key] = (hist[key] ?? 0) + 1; }
console.log(hist);
