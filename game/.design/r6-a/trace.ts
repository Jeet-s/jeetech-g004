import * as path from "path";
import { buildPuzzle, lineCount, applyLine, startMasks, lineIndices, isKnown, maskValue } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const idx = Number(process.argv[3] ?? 0);
  const s = (Object.values(mod).flat() as any[])[idx];
  const p = buildPuzzle(s);
  let masks = startMasks(p);
  const L = lineCount(p);
  const nm = (l: number) => (l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`);
  const ch = (m: number) => isKnown(m) ? (maskValue(m) === 0 ? "." : (p.palette.length > 1 ? "abcdef"[maskValue(m) - 1] : "#")) : "?";
  for (let pass = 1; pass < 50; pass++) {
    const base = masks; let cur = masks.slice(); const prod: string[] = [];
    for (let l = 0; l < L; l++) {
      const nx = applyLine(p, base, l);
      if (nx && nx !== base) { prod.push(nm(l)); for (const i of lineIndices(p.w, p.h, l)) cur[i] &= nx[i]; }
    }
    if (!prod.length) break;
    masks = cur;
    console.log(`pass ${pass}: ${prod.join(",")}`);
    for (let y = 0; y < p.h; y++) console.log("   " + Array.from({ length: p.w }, (_, x) => ch(masks[y * p.w + x])).join(""));
  }
})();
