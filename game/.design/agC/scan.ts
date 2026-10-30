import * as path from "path";
import { buildPuzzle, logicSolve, countPasses } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of mod.A as any[]) {
    if (!s.smudge?.length) continue;
    const p = buildPuzzle(s); const r = logicSolve(p);
    if (!r.unique) continue;
    const q = buildPuzzle({ ...s, art: s.art.replace(/,/g, ".").replace(/[A-F]/g, (c: string) => c.toLowerCase()) });
    const rq = logicSolve(q); if (rq.unique) continue;
    const ch = s.art.match(/[,A-F]/)![0];
    console.log(`${s.id} stamp=${ch} looks ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} nostampUnknown ${rq.unknown}`);
  }
})();
