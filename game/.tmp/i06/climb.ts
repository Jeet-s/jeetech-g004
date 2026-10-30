import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
// usage: climb.ts file K maxEdits allowedChars protectChars [seed]
const [file, K, maxE, allowed, protect, seedS] = process.argv.slice(2);
let art = readFileSync(file, "utf8").trim().split("\n").map((r) => r.trim());
const orig = art.map((r) => r);
let seed = Number(seedS ?? 1);
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const score = (a: string[]) => {
  const t = a.join("\n");
  const rows = a, w = rows[0].length;
  for (let y = 0; y < rows.length; y++) if (![...rows[y]].some((c) => /[a-fA-F#@]/.test(c)) && ![...rows[y]].every((c)=>c==="~")) return -1;
  for (let x = 0; x < w; x++) if (!rows.some((r) => /[a-fA-F#@]/.test(r[x])) && !rows.every((r)=>r[x]==="~")) return -1;
  const p = buildPuzzle({ id: "t", title: "t", palette: Array(Number(K)).fill("#000"), art: t });
  const r = logicSolve(p);
  return r.unique ? r.search : -1;
};
let best = score(art);
console.log("start", best.toFixed(1));
const diff = (a: string[]) => a.reduce((n, r, y) => n + [...r].filter((c, x) => c !== orig[y][x]).length, 0);
for (let it = 0; it < Number(process.env.IT ?? 1500); it++) {
  const y = Math.floor(rnd() * art.length), x = Math.floor(rnd() * art[0].length);
  const ch = art[y][x]; if (y < Number(process.env.Y0 ?? 0) || y > Number(process.env.Y1 ?? 99)) continue;
  if (ch === "~" || protect.includes(ch)) continue;
  // neighbor must be non-paper
  const nb = [[0,1],[1,0],[0,-1],[-1,0]].some(([dy,dx]) => { const c = art[y+dy]?.[x+dx]; return c && c !== "." && c !== "~"; });
  if (!nb) continue;
  const nc = allowed[Math.floor(rnd() * allowed.length)];
  if (nc === ch) continue;
  const cand = art.map((r, yy) => (yy === y ? r.slice(0, x) + nc + r.slice(x + 1) : r));
  if (diff(cand) > Number(maxE)) continue;
  const s = score(cand);
  if (s > best) { best = s; art = cand; }
}
console.log("best", best.toFixed(1), "edits", diff(art));
console.log(art.join("\n"));
