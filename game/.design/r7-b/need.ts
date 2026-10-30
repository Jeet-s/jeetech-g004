// which lines are needed (smudging them breaks line-logic uniqueness), and is the tally OK there
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of Object.values(mod).flat() as any[]) {
    const p = buildPuzzle({ ...s, tally: [] }); const b = logicSolve(p);
    const out: string[] = [`base ${b.unique ? "OK" : "BAD"} ${b.steps}/${b.passes}/${b.firstOpen}`];
    for (let l = 0; l < p.w + p.h; l++) {
      const nm = l < p.h ? "r" + l : "c" + (l - p.h), nmh = l < p.h ? "r" + (l + 1) : "c" + (l - p.h + 1);
      const q = logicSolve(buildPuzzle({ ...s, tally: [], smudge: [...(s.smudge ?? []), nm] }));
      if (q.unique) continue;
      const t = logicSolve(buildPuzzle({ ...s, tally: [nm] }));
      out.push(`${nmh}(${q.unknown}u)${t.unique ? `T:${t.steps}/${t.passes}/${t.firstOpen}` : ""}`);
    }
    console.log(s.title, out.join(" "));
  }
})();
