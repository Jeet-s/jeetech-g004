import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of Object.values(mod).flat() as any[]) {
    const p0 = buildPuzzle({ ...s, crack: [] });
    const base = logicSolve(p0);
    console.log(`${s.id} plain: ${base.unique ? "OK" : "BAD " + base.unknown} looks ${base.steps} passes ${base.passes} open ${base.firstOpen}`);
    if (!base.unique) continue;
    const out: string[] = [];
    for (let l = 0; l < p0.w + p0.h; l++) clueOf(p0, l).blocks.forEach((b, k) => {
      const tag = (l < p0.h ? "r" + l : "c" + (l - p0.h)) + "." + k;
      const r = logicSolve(buildPuzzle({ ...s, crack: [tag] }));
      if (r.unique) out.push(`${tag}(len ${b.len}) looks ${r.steps} passes ${r.passes} open ${r.firstOpen}`);
    });
    console.log("  " + out.join("\n  "));
  }
})();
