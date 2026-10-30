// usage: npx tsx .design/agA/search.ts <template-file> [maxPass] [minOpen] [noExact 0/1] [palette json] [opts json]
import * as fs from "fs";
import { buildPuzzle, logicSolve, lineCount, clueOf, startMasks, applyLine } from "../../src/game/nonogram";
import { LEVELS } from "../../src/game/levels";
const sig = (p: any) => JSON.stringify([p.rows, p.cols, p.w, p.h]);
const known = new Set(LEVELS.map((l) => sig(l.puzzle)));
const tpl = fs.readFileSync(process.argv[2], "utf8").trim();
const maxPass = Number(process.argv[3] ?? 99), minOpen = Number(process.argv[4] ?? 0), noExact = process.argv[5] === "1";
const palette = JSON.parse(process.argv[6] ?? '["#000"]');
const opts: Record<string, string> = JSON.parse(process.argv[7] ?? '{"?":".#"}');
const free: number[] = []; for (let i = 0; i < tpl.length; i++) if (opts[tpl[i]]) free.push(i);
const total = free.reduce((a, i) => a * opts[tpl[i]].length, 1);
console.error("free", free.length, "combos", total);
const res: any[] = [];
for (let n = 0; n < total; n++) {
  let k = n; const ch = tpl.split("");
  for (const i of free) { const o = opts[tpl[i]]; ch[i] = o[k % o.length]; k = Math.floor(k / o.length); }
  const art = "\n" + ch.join("");
  let p; try { p = buildPuzzle({ id: "x", title: "x", palette, art } as any); } catch { continue; }
  let bad = false;
  for (let l = 0; l < lineCount(p); l++) { const b = clueOf(p, l).blocks; if (!b.length) { bad = true; break; }
    const len = l < p.h ? p.w : p.h; let s = b.reduce((a, x) => a + x.len, 0); for (let j = 1; j < b.length; j++) if (b[j].color === b[j - 1].color) s++;
    if (noExact && s === len) { bad = true; break; } }
  if (bad) continue;
  if (process.env.NOROWS) { const m0 = startMasks(p); let rp = false; for (let l = 0; l < p.h; l++) if (applyLine(p, m0, l) !== m0) { rp = true; break; } if (rp) continue; }
  if (process.env.MINPASS && 0) {}
  const r = logicSolve(p); if (!r.unique) continue;
  if (r.passes < Number(process.env.MINPASS ?? 0)) continue;
  if (r.passes > maxPass || r.firstOpen < minOpen) continue;
  if (known.has(sig(p))) continue;
  res.push({ art, looks: r.steps, passes: r.passes, open: r.firstOpen });
}
res.sort((a, b) => b.passes - a.passes || b.looks - a.looks); if (process.env.SYM) { const sym = (r: any) => { const L = r.art.trim().split("\n"); return L.reduce((s: number, l: string) => s + [...l].filter((c, i) => c !== l[l.length - 1 - i]).length, 0); }; res.sort((a, b) => sym(a) - sym(b) || a.passes - b.passes); }
console.log("found", res.length);
for (const r of res.slice(0, Number(process.env.TOP ?? 8))) console.log(`looks ${r.looks} passes ${r.passes} open ${r.open}${r.art}\n`);
