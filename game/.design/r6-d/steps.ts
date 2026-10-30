import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine, isKnown, maskValue } from "../../src/game/nonogram";
// usage: steps.ts file id [lines e.g. r5,c9]  — parallel passes: productive lines per pass; full line states for watched lines
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const watch = (process.argv[4] ?? "").split(",").filter(Boolean);
  const p = buildPuzzle(s); const L = lineCount(p);
  const nm = (l: number) => (l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`);
  const ch = (m: number) => (isKnown(m) ? (maskValue(m) === 0 ? "." : p.palette.length > 1 ? "abcdef"[maskValue(m) - 1] : "#") : "?");
  const show = (masks: number[], l: number) => lineIndices(p.w, p.h, l).map((i) => ch(masks[i])).join("");
  let masks = startMasks(p);
  for (let k = 1; k < 60; k++) {
    const base = masks; const next = masks.slice(); const prod: string[] = []; const notes: string[] = [];
    for (let l = 0; l < L; l++) { const nx = applyLine(p, base, l); if (!nx || nx === base) continue; let g = 0; for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; if (isKnown(nx[i]) && !isKnown(base[i])) g++; } prod.push(`${nm(l)}+${g}`); if (watch.includes(nm(l))) notes.push(`   ${nm(l)}: ${show(base, l)} -> ${show(nx, l)}`); }
    if (!prod.length) break;
    masks = next;
    console.log(`pass ${k}: ${prod.join(" ")}`); if (notes.length) console.log(notes.join("\n"));
    if (process.env.GRID) { for (let y = 0; y < p.h; y++) console.log("     " + show(masks, y)); }
  }
  console.log("unknown at end:", masks.filter((m) => !isKnown(m)).length);
})();
