import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const P = buildPuzzle({ ...s, crack: [] }); const base = logicSolve(P);
  console.log("base", base.unique, base.steps, base.passes);
  for (let l = 0; l < P.h + P.w; l++) { const bl = (clueOf(P, l) as any).blocks; for (let k = 0; k < bl.length; k++) {
    if (bl[k].len < 2) continue;
    const key = (l < P.h ? "r" + l : "c" + (l - P.h)) + "." + k;
    const r = logicSolve(buildPuzzle({ ...s, crack: [...(s.crack ?? []), key] }));
    if (r.unique && (r.steps > base.steps || r.passes > base.passes)) console.log(`${l < P.h ? "r" + (l + 1) : "c" + (l - P.h + 1)} #${k + 1} (${bl[k].len}${"abcdef"[bl[k].color - 1]}) key ${key}: looks ${r.steps} passes ${r.passes}`);
  } }
})();
