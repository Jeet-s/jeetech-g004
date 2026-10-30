// parallel-pass trace: per pass, list lines that progressed, print grid after each pass
import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine, isKnown, maskValue } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[])[Number(process.argv[3] ?? 0)];
  const p = buildPuzzle(s);
  let m = startMasks(p);
  const name = (l: number) => (l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`);
  const show = () => { for (let y = 0; y < p.h; y++) { let t = ""; for (let x = 0; x < p.w; x++) { const v = m[y * p.w + x]; t += isKnown(v) ? (maskValue(v) ? (p.palette.length > 1 ? "abcdef"[maskValue(v) - 1] : "#") : "x") : "?"; } console.log("   " + t); } };
  for (let pass = 1; pass < 40; pass++) {
    const base = m; const next = m.slice(); const prog: string[] = [];
    for (let l = 0; l < lineCount(p); l++) { const nx = applyLine(p, base, l); if (!nx || nx === base) continue; let g = 0; for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; if (isKnown(nx[i]) && !isKnown(base[i])) g++; } prog.push(`${name(l)}+${g}`); }
    if (!prog.length) break;
    m = next; console.log(`pass ${pass}: ${prog.join(" ")}`); show();
  }
})();
