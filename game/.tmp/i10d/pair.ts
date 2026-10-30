import { ISL10 } from "../../src/game/islands/isl10";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const n = Number(process.argv[2]); const s: any = ISL10[n - 1];
const run = (x: any) => { try { const r = logicSolve(buildPuzzle(x)); return r.unique ? r : null; } catch { return null; } };
const p: any = buildPuzzle(s); const opts: [string, string][] = [];
[...p.rows.map((c: any, i: number) => ["r" + i, c]), ...p.cols.map((c: any, i: number) => ["c" + i, c])].forEach(([nm, c]: any) => {
  opts.push(["S", nm]); c.blocks.forEach((b: any, k: number) => { if (b.len >= 2) opts.push(["C", nm + "." + k]); }); });
const res: string[] = [];
for (const [t, v] of opts) { const sm = [...(s.smudge ?? [])], cr = [...(s.crack ?? [])];
  if (t === "S") { if (sm.includes(v)) continue; sm.push(v); } else { if (cr.includes(v)) continue; cr.push(v); }
  const r = run({ ...s, smudge: sm, crack: cr }); if (r) res.push(`${r.search.toFixed(1)} ${r.passes}p o${r.firstOpen} smudge=${sm} crack=${cr}`); }
res.sort((a, b) => parseFloat(b) - parseFloat(a)); console.log(res.slice(0, 10).join("\n"));
