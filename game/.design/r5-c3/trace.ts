import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine, isKnown } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const only = process.argv[3];
  const specs = (Object.values(mod).flat() as any[]).filter((s) => !only || s.id === only);
  for (const s of specs) {
    const p = buildPuzzle(s);
    let masks = startMasks(p); const L = lineCount(p);
    const when = masks.map((m) => (isKnown(m) ? 0 : -1));
    for (let pass = 1; pass < 60; pass++) {
      const base = masks; const next = masks.slice(); let ch = false;
      for (let l = 0; l < L; l++) { const nx = applyLine(p, base, l); if (!nx || nx === base) continue; for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; ch = true; } }
      if (!ch) break;
      next.forEach((m, i) => { if (when[i] < 0 && isKnown(m)) when[i] = pass; });
      masks = next;
    }
    console.log(s.id);
    for (let y = 0; y < p.h; y++) { let t = ""; for (let x = 0; x < p.w; x++) { const i = y * p.w + x; const v = p.solution[i]; t += (when[i] < 0 ? "?" : when[i].toString(36)) + (v ? "abcdef"[v - 1].toUpperCase() : (p.void[i] ? "~" : ".")) + " "; } console.log("  " + t); }
  }
})();
