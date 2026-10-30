import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine, isKnown } from "../../src/game/nonogram";
// For stamped specs: parallel-pass compare stamped vs no-stamp board; report the first pass where the stamp
// gives a non-stamp cell the plain board does not have, and where the plain board stalls.
function passes(p: any) {
  let masks = startMasks(p); const out = [masks]; const L = lineCount(p);
  for (let k = 0; k < 200; k++) {
    const base = masks; const next = masks.slice(); let ch = false;
    for (let l = 0; l < L; l++) { const nx = applyLine(p, base, l); if (!nx || nx === base) continue; for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; ch = true; } }
    if (!ch) break; masks = next; out.push(masks);
  }
  return out;
}
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of Object.values(mod).flat() as any[]) {
    if (!/[,@A-F]/.test(s.art)) continue;
    const p = buildPuzzle(s);
    const q = buildPuzzle({ ...s, art: s.art.replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c: string) => c.toLowerCase()) });
    const a = passes(p), b = passes(q);
    const stampCells = p.given.map((g: number, i: number) => g ? i : -1).filter((i: number) => i >= 0);
    const known = (m: number[]) => m.filter((x, i) => isKnown(x) && !p.given[i]).length;
    let first = -1;
    for (let k = 1; k < a.length; k++) { const bk = b[Math.min(k, b.length - 1)]; if (a[k].some((x, i) => !p.given[i] && isKnown(x) && !isKnown(bk[i]))) { first = k; break; } }
    const lastB = b[b.length - 1];
    const unk = lastB.filter((x) => !isKnown(x)).length;
    const cells = stampCells.map((i: number) => `r${Math.floor(i / p.w) + 1}c${(i % p.w) + 1}`).join(",");
    console.log(`${s.id}: stamps ${cells}; stamp first bites at pass ${first} of ${a.length - 1}; plain board stalls after pass ${b.length - 1} with ${unk} unknown (of ${p.w * p.h})`);
  }
})();
