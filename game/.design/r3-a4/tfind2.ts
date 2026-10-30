// pairs of tally lines: OK with tallies; report whether all-smudged BAD (needed) and per-line needed
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const must = process.argv[4] ? process.argv[4].split(",").map((x) => x[0] + (+x.slice(1) - 1)) : null;
  const p0 = buildPuzzle(s); const smud = s.smudge ?? [];
  const lines: string[] = []; for (let r = 0; r < p0.h; r++) lines.push("r" + r); for (let c = 0; c < p0.w; c++) lines.push("c" + c);
  const cand = lines.filter((l) => !smud.includes(l));
  const nm = (l: string) => l[0] + (+l.slice(1) + 1);
  for (let i = 0; i < cand.length; i++) for (let j = i + 1; j < cand.length; j++) {
    const t = [cand[i], cand[j]]; if (must && !t.some((x) => must.includes(x))) continue;
    const r = logicSolve(buildPuzzle({ ...s, tally: t })); if (!r.unique) continue;
    const all = logicSolve(buildPuzzle({ ...s, smudge: [...smud, ...t] })); if (all.unique) continue;
    const per = t.map((l) => logicSolve(buildPuzzle({ ...s, tally: t.filter((x) => x !== l), smudge: [...smud, l] })).unique ? "-" : "N");
    console.log(`${t.map(nm).join("+")} looks ${r.steps} passes ${r.passes} open ${r.firstOpen} allUnk ${all.unknown} per ${per.join("")}`);
  }
})();
