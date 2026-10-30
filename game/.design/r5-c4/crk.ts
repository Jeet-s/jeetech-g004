import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
// usage: crk.ts file.ts [id]  -> for each spec, try each single crack (line.block), list OK ones with passes
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const want = process.argv[3];
  const specs = (Object.values(mod).flat() as any[]).filter((s) => !want || s.id === want);
  for (const s of specs) {
    const base = { ...s, crack: [] };
    const p = buildPuzzle(base); const r0 = logicSolve(p);
    console.log(`${s.id} ${p.w}x${p.h} plain ${r0.unique ? "OK" : "BAD"} looks ${r0.steps} passes ${r0.passes} open ${r0.firstOpen}`);
    const out: string[] = [];
    for (let l = 0; l < p.h + p.w; l++) {
      const bl = clueOf(p, l).blocks;
      for (let k = 0; k < bl.length; k++) {
        const key = (l < p.h ? "r" + l : "c" + (l - p.h)) + "." + k;
        const extra = (s.crack ?? []).filter((x: string) => x !== key);
        const r = logicSolve(buildPuzzle({ ...s, crack: [...extra, key] }));
        if (!r.unique) continue;
        out.push(`  ${key} (${l < p.h ? "row " + (l + 1) : "col " + (l - p.h + 1)} #${k + 1} len ${bl[k].len}${p.palette.length > 1 ? "abcdef"[bl[k].color - 1] : ""}) looks ${r.steps} passes ${r.passes} open ${r.firstOpen}`);
      }
    }
    console.log(out.join("\n"));
  }
})();
