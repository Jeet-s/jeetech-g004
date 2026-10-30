import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
// for each spec, try a tally on each single line; print OK + NEEDED ones
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of Object.values(mod).flat() as any[]) {
    const p0 = buildPuzzle({ ...s, tally: [] }); const r0 = logicSolve(p0);
    const out: string[] = [`${s.id}: plain ${r0.unique ? "OK" : "BAD"} looks ${r0.steps} passes ${r0.passes}`];
    for (let l = 0; l < p0.w + p0.h; l++) {
      const t = l < p0.h ? `r${l}` : `c${l - p0.h}`;
      const extra: string[] = process.env.KEEP ? (s.tally ?? []).filter((x: string) => x !== t) : [];
      const r = logicSolve(buildPuzzle({ ...s, tally: [...extra, t] }));
      if (!r.unique) continue;
      const sm = logicSolve(buildPuzzle({ ...s, tally: extra, smudge: [...(s.smudge ?? []), t] }));
      if (sm.unique) continue;
      out.push(`  ${t} (1-based ${l < p0.h ? "r" + (l + 1) : "c" + (l - p0.h + 1)}) looks ${r.steps} passes ${r.passes} open ${r.firstOpen} needed(${sm.unknown})`);
    }
    console.log(out.join("\n"));
  }
})();
