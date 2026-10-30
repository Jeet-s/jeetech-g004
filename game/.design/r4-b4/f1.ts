import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine, isKnown, logicSolve } from "../../src/game/nonogram";
export function prof(s: any) {
  const p = buildPuzzle(s); let masks = startMasks(p); const L = lineCount(p); const out: number[] = [];
  const N = p.w * p.h;
  for (let pass = 0; pass < 12; pass++) { const base = masks, next = masks.slice(); let any = false;
    for (let l = 0; l < L; l++) { const nx = applyLine(p, base, l); if (!nx || nx === base) continue; for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; any = true; } }
    if (!any) break; masks = next; out.push(Math.round(100 * masks.filter(isKnown).length / N)); }
  return out;
}
if (require.main === module) (async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of (Object.values(mod).flat() as any[]).filter((x) => !process.argv[3] || x.id === process.argv[3])) { const r = logicSolve(buildPuzzle(s)); console.log(s.id, r.unique ? "OK" : "BAD", "passes", r.passes, "looks", r.steps, "known%/pass", prof(s).join(" ")); }
})();
