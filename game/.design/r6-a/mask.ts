import * as path from "path";
import { buildPuzzle, lineCount, applyLine, startMasks, lineIndices } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[])[Number(process.argv[3])];
  const passes = Number(process.argv[4]); const line = process.argv[5];
  const p = buildPuzzle(s); let masks = startMasks(p); const L = lineCount(p);
  for (let k = 0; k < passes; k++) { const base = masks; const cur = masks.slice(); for (let l = 0; l < L; l++) { const nx = applyLine(p, base, l); if (nx && nx !== base) for (const i of lineIndices(p.w, p.h, l)) cur[i] &= nx[i]; } masks = cur; }
  const l = line[0] === "r" ? Number(line.slice(1)) - 1 : p.h + Number(line.slice(1)) - 1;
  const nm = (m: number) => [0,1,2,3].filter(b => m & (1 << b)).map(b => ".abc"[b]).join("");
  console.log(lineIndices(p.w, p.h, l).map((i) => nm(masks[i])).join(" | "));
})();
