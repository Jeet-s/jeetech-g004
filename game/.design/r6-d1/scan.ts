// scan.ts file : for each spec art, try a tally on every single line; print OK+NEEDED ones
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of Object.values(mod).flat() as any[]) {
    const rows = s.art.trim().split("\n"); const h = rows.length, w = rows[0].length;
    const base = logicSolve(buildPuzzle({ ...s, tally: [] }));
    console.log(`${s.title} ${w}x${h} plain ${base.unique ? "OK" : "BAD"} L${base.steps} P${base.passes} O${base.firstOpen}`);
    const lines = [...Array.from({ length: h }, (_, i) => "r" + i), ...Array.from({ length: w }, (_, i) => "c" + i)];
    const extra = (process.env.WITH ?? "").split(",").filter(Boolean);
    for (const l of lines) {
      if (extra.includes(l)) continue;
      const T = [...extra, l];
      const q = logicSolve(buildPuzzle({ ...s, tally: T })); if (!q.unique) continue;
      const need = T.every((t) => !logicSolve(buildPuzzle({ ...s, tally: T.filter((x) => x !== t), smudge: [t] })).unique);
      console.log(`  ${T.join("+")}: OK L${q.steps} P${q.passes} O${q.firstOpen} ${need ? "NEEDED" : "decor"}`);
    }
  }
})();
