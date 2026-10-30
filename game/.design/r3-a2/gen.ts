import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
// gen.ts '<template with ? optional cells>' [K=1] [samples] [fixedTally comma list]
const tpl = process.argv[2].trim().split(/[\n/]/).map((r) => r.trim()).filter(Boolean);
const K = Number(process.argv[3] ?? 1), N = Number(process.argv[4] ?? 4096);
const fixed = process.argv[5] ? process.argv[5].split(",") : [];
const h = tpl.length, w = tpl[0].length;
const opts: [number, number][] = [];
tpl.forEach((r, y) => r.split("").forEach((c, x) => c === "?" && opts.push([y, x])));
const names = [...Array.from({ length: h }, (_, i) => "r" + i), ...Array.from({ length: w }, (_, i) => "c" + i)];
const total = 2 ** opts.length;
const seen = new Set<string>();
const results: [number, string][] = [];
for (let it = 0; it < Math.min(N, total); it++) {
  const g = tpl.map((r) => r.split(""));
  const D = Number(process.env.DENS ?? 0.5);
  opts.forEach(([y, x], i) => (g[y][x] = (total <= N ? Math.floor(it / 2 ** i) % 2 === 1 : Math.random() < D) ? "#" : "."));
  const art = g.map((r) => r.join("")).join("\n");
  if (seen.has(art)) continue; seen.add(art);
  const s: any = { id: "g", title: "g", palette: [INK], art: "\n" + art };
  let p; try { p = buildPuzzle(s); } catch { continue; }
  if (p.rows.some((r) => !r.blocks.length) || p.cols.some((c) => !c.blocks.length)) continue;
  if (!logicSolve(p).unique) continue;
  // needed lines: smudge alone breaks line logic
  const full = (L: string) => { const li = Number(L.slice(1)) + (L[0] === "c" ? h : 0); const n = clueOf(p!, li).blocks.reduce((a: number, q: any) => a + q.len, 0); return n === (L[0] === "c" ? h : w); };
  const ess = names.filter((L) => !full(L)).filter((L) => !logicSolve(buildPuzzle({ ...s, smudge: [L] })).unique);
  const cand = K === 1 ? ess.map((L) => [L]) : ess.flatMap((a, i) => ess.slice(i + 1).map((b) => [a, b]));
  for (const T0 of cand) {
    const T = [...new Set([...fixed, ...T0])];
    const r = logicSolve(buildPuzzle({ ...s, tally: T }));
    if (!r.unique) continue;
    if (r.passes > Number(process.env.MAXP ?? 99) || r.firstOpen < Number(process.env.MINO ?? 0)) continue;
    if (!T.every((t) => !logicSolve(buildPuzzle({ ...s, tally: T.filter((x) => x !== t), smudge: [t] })).unique)) continue;
    const desc = T.map((L) => { const li = Number(L.slice(1)) + (L[0] === "c" ? h : 0); const b = clueOf(p!, li).blocks; return `${L[0]}${Number(L.slice(1)) + 1}=${b.reduce((a: number, q: any) => a + q.len, 0)}(${b.map((q: any) => q.len).join(" ")})`; }).join(" + ");
    results.push([r.steps, `${desc} looks ${r.steps} passes ${r.passes} open ${r.firstOpen}\n${art}\n`]);
  }
}
console.log(`combos ${seen.size}, hits ${results.length}`);
results.sort((a, b) => a[0] - b[0]);
const show = Number(process.env.SHOW ?? 8);
const step = Math.max(1, Math.floor(results.length / show));
for (let i = 0; i < results.length && i / step < show; i += step) console.log(results[i][1]);
