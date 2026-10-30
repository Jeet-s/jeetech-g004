// usage: npx tsx tut.ts <specfile> <exportName> <idx> "r4,c4;..."  -- each ';' group = a step: fix those lines, then list lines determined
import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine, isKnown } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[])[Number(process.argv[3] ?? 0)];
  const p = buildPuzzle(s);
  let m = startMasks(p);
  const name = (l: number) => (l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`);
  const parse = (t: string) => (t[0] === "r" ? Number(t.slice(1)) - 1 : p.h + Number(t.slice(1)) - 1);
  const report = () => { const det: string[] = []; for (let l = 0; l < lineCount(p); l++) { const idx = lineIndices(p.w, p.h, l); if (idx.every((i) => isKnown(m[i]))) continue; const nx = applyLine(p, m, l); if (nx && idx.every((i) => isKnown(nx[i]))) det.push(name(l)); } return det; };
  console.log("start determined:", report().join(","));
  for (const g of (process.argv[4] ?? "").split(";").filter(Boolean)) {
    for (const t of g.split(",")) { const l = parse(t); for (const i of lineIndices(p.w, p.h, l)) m[i] = 1 << p.solution[i]; }
    // auto-X: lines whose ink is all present get paper
    console.log(`after ${g}:`, report().join(","));
  }
})();
