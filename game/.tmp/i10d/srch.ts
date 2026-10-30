import { ISL10 } from "../../src/game/islands/isl10";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const n = Number(process.argv[2]); const s: any = ISL10[n - 1];
const run = (x: any) => { try { const r = logicSolve(buildPuzzle(x)); return r.unique ? r : null; } catch { return null; } };
const base = run(s)!; console.log("base", base.passes, base.search.toFixed(1));
const p: any = buildPuzzle(s); const sm = s.smudge ?? [], cr = s.crack ?? []; const out: string[] = [];
[...p.rows.map((c: any, i: number) => ["r" + i, c]), ...p.cols.map((c: any, i: number) => ["c" + i, c])].forEach(([nm, c]: any) => {
  if (!sm.includes(nm)) { const r = run({ ...s, smudge: [...sm, nm] }); if (r) out.push(`${r.search.toFixed(1)} ${r.passes}p o${r.firstOpen} S${nm}`); }
  c.blocks.forEach((b: any, k: number) => { const key = nm + "." + k; if (cr.includes(key) || b.len < 2) return; const r = run({ ...s, crack: [...cr, key] }); if (r) out.push(`${r.search.toFixed(1)} ${r.passes}p o${r.firstOpen} C${key}(${b.len})`); });
});
out.sort((a, b) => parseFloat(b) - parseFloat(a)); console.log(out.slice(0, 14).join(" | "));
