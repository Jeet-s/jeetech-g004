import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine } from "../../src/game/nonogram";
const known = (m: number) => (m & (m - 1)) === 0;
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const only = process.argv[3];
  for (const s of Object.values(mod).flat() as any[]) {
    if (only && s.id !== only) continue;
    const p = buildPuzzle(s); let masks = startMasks(p); const L = lineCount(p);
    const nm = (l: number) => (l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`);
    console.log("==", s.id);
    for (let pass = 1; pass < 50; pass++) {
      const base = masks; const next = masks.slice(); const out: string[] = [];
      for (let l = 0; l < L; l++) { const nx = applyLine(p, base, l); if (!nx || nx === base) continue; let g = 0;
        for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; if (known(nx[i]) && !known(base[i])) g++; }
        if (g) out.push(`${nm(l)}+${g}`); }
      if (!out.length) break; masks = next; console.log(` p${pass}: ${out.join(" ")}`);
    }
  }
})();
