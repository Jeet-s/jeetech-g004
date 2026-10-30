import * as path from "path";
import { buildPuzzle, lineCount, applyLine, startMasks, lineIndices, lineOpen, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const specs = Object.values(mod).flat() as any[];
  specs.forEach((s, k) => {
    const p = buildPuzzle(s); const r = logicSolve(p);
    let masks = startMasks(p); const L = lineCount(p); const out: string[] = [];
    for (let pass = 1; pass < 50; pass++) {
      const base = masks; const cur = masks.slice(); let prod = 0, open = 0;
      for (let l = 0; l < L; l++) { if (!lineOpen(p, base, l)) continue; open++; const nx = applyLine(p, base, l); if (nx && nx !== base) { prod++; for (const i of lineIndices(p.w, p.h, l)) cur[i] &= nx[i]; } }
      if (!prod) break; masks = cur; out.push(`${prod}/${open}`);
    }
    console.log(k, s.id, r.unique ? "OK" : "BAD", "looks", r.steps, "minProd", r.minProductive, "search", r.search.toFixed(1), out.join(" "));
  });
})();
