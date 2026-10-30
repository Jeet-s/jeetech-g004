// essential lines: smudging them breaks line-solvability; also try that line as tally
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of Object.values(mod).flat() as any[]) {
    const rows: string[] = s.art.trim().split("\n").map((l: string) => l.trim());
    const H = rows.length, W = rows[0].length;
    const lines = [...Array(H).keys()].map((k) => "r" + k).concat([...Array(W).keys()].map((k) => "c" + k));
    const b = logicSolve(buildPuzzle({ ...s, tally: [] }));
    const out: string[] = [];
    for (const t of lines) {
      const q = logicSolve(buildPuzzle({ ...s, tally: [], smudge: [t] }));
      if (q.unique) continue;
      const r = logicSolve(buildPuzzle({ ...s, tally: [t] }));
      out.push(`${t}${r.unique ? `:T ${r.steps}/${r.passes}/${r.firstOpen}` : ""}`);
    }
    console.log(`${s.title} plain ${b.unique ? "OK" : "BAD"} ${b.steps}/${b.passes}/${b.firstOpen} essential: ${out.join(" ")}`);
  }
})();
