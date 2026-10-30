import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of (Object.values(mod).flat() as any[]).filter((x) => !process.argv[3] || x.id === process.argv[3])) {
    const p = buildPuzzle(s); const out: string[] = [];
    for (let l = 0; l < p.h + p.w; l++) { const id = l < p.h ? "r" + l : "c" + (l - p.h); if ((s.smudge ?? []).includes(id)) continue;
      const q = logicSolve(buildPuzzle({ ...s, smudge: [...(s.smudge ?? []), id] })); if (q.unique) continue;
      const t = logicSolve(buildPuzzle({ ...s, tally: [...(s.tally ?? []), id] }));
      out.push(`${id[0]}${+id.slice(1) + 1}(${q.unknown}${t.unique ? " TALLY-OK" : ""})`); }
    console.log(s.id, out.join(" ") || "no critical line");
  }
})();
