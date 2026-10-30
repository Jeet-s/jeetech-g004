import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of Object.values(mod).flat() as any[]) {
    const r = logicSolve(buildPuzzle(s));
    const per = (s.tally ?? []).map((t: string) => { const q = logicSolve(buildPuzzle({ ...s, tally: s.tally.filter((x: string) => x !== t), smudge: [...(s.smudge ?? []), t] })); const pl = logicSolve(buildPuzzle({ ...s, tally: s.tally.filter((x: string) => x !== t) })); return `${t[0]}${+t.slice(1) + 1}:${q.unique ? "notneeded" : "NEEDED"}(plain:${pl.steps}/${pl.passes})`; });
    console.log(`${s.id} [${s.title}] ${r.unique ? "OK" : "BAD"} looks ${r.steps} passes ${r.passes} open ${r.firstOpen}  ${per.join(" ")}`);
  }
})();
