import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine, isKnown } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const p = buildPuzzle(s); let masks = startMasks(p); const L = lineCount(p);
  const nm = (l: number) => (l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`);
  const cell = (i: number) => `r${Math.floor(i / p.w) + 1}c${(i % p.w) + 1}`;
  for (let pass = 1; pass < 60; pass++) {
    const base = masks; const next = masks.slice(); let ch = false; const out: string[] = [];
    for (let l = 0; l < L; l++) { const nx = applyLine(p, base, l); if (!nx || nx === base) continue; const got: string[] = [];
      for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; ch = true; if (isKnown(nx[i]) && !isKnown(base[i])) got.push(cell(i)); }
      if (got.length) out.push(`${nm(l)}:${got.length <= 4 ? got.join("/") : got.length}`); }
    if (!ch) break; masks = next; console.log(`pass ${pass}: ${out.join(" ")}`);
  }
})();
