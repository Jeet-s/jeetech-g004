import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine, isKnown } from "../../src/game/nonogram";
// per pass: cells the stamped board knows that the plain board does not yet (excluding stamp cells), listed for pass 1-3
function run(p: any) { let masks = startMasks(p); const out = [masks]; const L = lineCount(p);
  for (let k = 0; k < 200; k++) { const base = masks; const next = masks.slice(); let ch = false;
    for (let l = 0; l < L; l++) { const nx = applyLine(p, base, l); if (!nx || nx === base) continue; for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; ch = true; } }
    if (!ch) break; masks = next; out.push(masks); } return out; }
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const ids = process.argv.slice(3);
  for (const s of Object.values(mod).flat() as any[]) {
    if (!/[,@A-F]/.test(s.art) || (ids.length && !ids.includes(s.id))) continue;
    const p = buildPuzzle(s); const q = buildPuzzle({ ...s, art: s.art.replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c: string) => c.toLowerCase()) });
    const a = run(p), b = run(q); const nm = (i: number) => `r${Math.floor(i / p.w) + 1}c${(i % p.w) + 1}`;
    const lines: string[] = [];
    for (let k = 1; k < Math.min(a.length, 5); k++) { const bk = b[Math.min(k, b.length - 1)]; const ex: string[] = []; a[k].forEach((x: number, i: number) => { if (!p.given[i] && isKnown(x) && !isKnown(bk[i])) ex.push(nm(i)); }); lines.push(`  pass ${k}: +${ex.length} ${ex.slice(0, 14).join(" ")}`); }
    const unk = b[b.length - 1].map((x: number, i: number) => (isKnown(x) ? "" : nm(i))).filter(Boolean);
    console.log(`${s.id}: stamped passes ${a.length - 1}; plain stalls after pass ${b.length - 1}, unknown ${unk.length}: ${unk.slice(0, 12).join(" ")}\n${lines.join("\n")}`);
  }
})();
