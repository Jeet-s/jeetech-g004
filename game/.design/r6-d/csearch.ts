import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
// try a crack on every clue number; print the OK ones (plus existing cracks kept if KEEP)
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const ids = process.argv.slice(3);
  for (const s of Object.values(mod).flat() as any[]) {
    if (ids.length && !ids.includes(s.id)) continue;
    const p0 = buildPuzzle({ ...s, crack: [] }); const out: string[] = [s.id];
    const base = process.env.KEEP ? s.crack ?? [] : [];
    for (let l = 0; l < p0.w + p0.h; l++) {
      const c = clueOf(p0, l); for (let k = 0; k < c.blocks.length; k++) {
        const t = (l < p0.h ? `r${l}` : `c${l - p0.h}`) + "." + k;
        const r = logicSolve(buildPuzzle({ ...s, crack: [...base, t] }));
        if (r.unique) out.push(`  ${t} = ${l < p0.h ? "row " + (l + 1) : "col " + (l - p0.h + 1)} #${k + 1} (${c.blocks[k].len}${"abcdef"[c.blocks[k].color - 1]}) looks ${r.steps} passes ${r.passes}`);
      }
    }
    console.log(out.join("\n"));
  }
})();
