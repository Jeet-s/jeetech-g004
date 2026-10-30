import * as fs from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
// usage: mut.ts base.txt flips iters [fixedTallies] [lockmask.txt]
// lock: cells marked 'x' in the second block of base file may be flipped (if present); otherwise any cell
const blocks = fs.readFileSync(process.argv[2], "utf8").trim().split(/\n\s*\n/);
const base = blocks[0].trim().split("\n");
const mask = blocks[1] ? blocks[1].trim().split("\n") : null;
const flips = +process.argv[3], iters = +process.argv[4];
const fixed = process.argv[5] ? process.argv[5].split(",").filter(Boolean) : [];
const extraN = process.argv[6] ? +process.argv[6] : 1; // number of additional tallies to search
const h = base.length, w = base[0].length;
const cand: [number, number][] = [];
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!mask || mask[y][x] === "x") cand.push([y, x]);
const names = [...Array.from({ length: h }, (_, i) => "r" + i), ...Array.from({ length: w }, (_, i) => "c" + i)];
const nm = (s: string) => (s[0] + (+s.slice(1) + 1));
let seed = 12345; const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const seen = new Set<string>();
const sp = (art: string, extra: any) => ({ id: "x", title: "x", palette: [INK], role: "teach", mechanics: [], aha: "", art: "\n" + art, ...extra } as any);
for (let it = 0; it < iters; it++) {
  const g = base.map((r) => r.split(""));
  const nf = it === 0 ? 0 : 1 + Math.floor(rnd() * flips);
  for (let k = 0; k < nf; k++) { const [y, x] = cand[Math.floor(rnd() * cand.length)]; g[y][x] = g[y][x] === "#" ? "." : "#"; }
  const art = g.map((r) => r.join("")).join("\n");
  if (seen.has(art)) continue; seen.add(art);
  if (g.some((r) => !r.includes("#"))) continue;
  if (Array.from({ length: w }, (_, x) => g.some((r) => r[x] === "#")).includes(false)) continue;
  const combos: string[][] = [];
  if (extraN === 0) combos.push([...fixed]);
  else if (extraN === 1) { for (const a of names) if (!fixed.includes(a)) combos.push([...fixed, a]); }
  else for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) if (!fixed.includes(names[i]) && !fixed.includes(names[j]) && (process.env.MIX ? (names[i][0] !== names[j][0]) : true)) combos.push([...fixed, names[i], names[j]]);
  for (const t of combos) {
    const r = logicSolve(buildPuzzle(sp(art, { tally: t })));
    if (!r.unique) continue;
    const need = process.env.ALLN ? (logicSolve(buildPuzzle(sp(art, { smudge: t }))).unique ? "-" : "N") : t.map((x) => logicSolve(buildPuzzle(sp(art, { tally: t.filter((y) => y !== x), smudge: [x] }))).unique ? "-" : "N").join("");
    if (need.includes("-")) continue;
    console.log(`T[${t.map(nm).join(",")}] looks ${r.steps} passes ${r.passes} open ${r.firstOpen} flips ${nf}\n${art}\n`);
  }
}
