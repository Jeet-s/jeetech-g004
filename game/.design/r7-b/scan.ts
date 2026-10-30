// npx tsx .design/r7-b/scan.ts <file> <tally|smudge> : for each spec, try each single line as the mechanic
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const kind = process.argv[3];
  const specs = Object.values(mod).flat() as any[];
  for (const s of specs) {
    const base = buildPuzzle({ ...s, tally: [], smudge: s.smudge ?? [] });
    const out: string[] = [];
    for (let l = 0; l < base.w + base.h; l++) {
      const nm = l < base.h ? "r" + l : "c" + (l - base.h);
      const nmh = l < base.h ? "r" + (l + 1) : "c" + (l - base.h + 1);
      const spec = kind === "tally" ? { ...s, tally: [nm] } : { ...s, smudge: [nm] };
      const r = logicSolve(buildPuzzle(spec));
      if (!r.unique) continue;
      if (kind === "tally") {
        const q = logicSolve(buildPuzzle({ ...s, tally: [], smudge: [...(s.smudge ?? []), nm] }));
        if (q.unique) continue;
      }
      out.push(`${nmh}:${r.steps}/${r.passes}`);
    }
    console.log(s.title, out.join(" "));
  }
})();
