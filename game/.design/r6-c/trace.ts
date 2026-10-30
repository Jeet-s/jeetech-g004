import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine, isKnown, maskValue, clueOf } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const only = process.argv[3];
  const specs = (Object.values(mod).flat() as any[]).filter((s) => !only || s.id === only);
  for (const s of specs) {
    const p = buildPuzzle(s); const L = lineCount(p);
    const nm = (l: number) => (l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`);
    let masks = startMasks(p);
    const show = (m: number[], prev: number[] | null) => { for (let y = 0; y < p.h; y++) { let t = ""; for (let x = 0; x < p.w; x++) { const i = y * p.w + x; const v = m[i]; const ch = p.void[i] ? "~" : !isKnown(v) ? "?" : maskValue(v) === 0 ? "." : "abcdef"[maskValue(v) - 1]; t += prev && isKnown(v) && !isKnown(prev[i]) ? ch.toUpperCase().replace(".", "x") : ch; } console.log("   " + t); } };
    console.log(`== ${s.id}`);
    for (let pass = 1; pass < 50; pass++) {
      const base = masks; let next = masks.slice(); const gains: string[] = [];
      for (let l = 0; l < L; l++) { if (clueOf(p, l).smudged) continue; const nx = applyLine(p, base, l); if (!nx) { console.log("CONTRA", nm(l)); return; } let g = 0; for (const i of lineIndices(p.w, p.h, l)) if (isKnown(nx[i]) && !isKnown(base[i])) { g++; next[i] = nx[i]; } else if (nx[i] !== base[i] && !isKnown(next[i])) next[i] &= nx[i]; if (g) gains.push(`${nm(l)}:${g}`); }
      if (!gains.length) break;
      console.log(` pass ${pass}: ${gains.join(" ")}`); show(next, base); masks = next;
      if (masks.every(isKnown)) break;
    }
  }
})();
