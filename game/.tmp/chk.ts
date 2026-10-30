import * as path from "path";
import { buildPuzzle, logicSolve, lineCount, lineIndices, clueOf } from "../src/game/nonogram";
const f = process.argv[2];
(async () => {
  let specs: any[] = [];
  let base = 0;
  if (f === "cur") {
    const { LEVELS } = await import("../src/game/levels");
    const lo = Number(process.argv[3] ?? 61), hi = Number(process.argv[4] ?? 120);
    specs = LEVELS.slice(lo - 1, hi).map((l) => ({ ...l.spec, _n: l.number }));
  } else {
    const mod = await import(path.resolve(f));
    specs = Object.values(mod).find((v) => Array.isArray(v)) as any[];
  }
  for (const s of specs) {
    try {
      const p = buildPuzzle(s);
      const r = logicSolve(p);
      const empty: number[] = [];
      for (let l = 0; l < lineCount(p); l++) { const c = lineIndices(p.w, p.h, l); if (!clueOf(p, l).blocks.length && !c.every((i) => p.void[i])) empty.push(l); }
      console.log(`${s._n ? "L" + s._n : ""} ${s.id.padEnd(20)} ${p.w}x${p.h} K${p.palette.length} ${r.unique ? "OK " : "BAD(" + r.unknown + ")"} looks ${r.steps} passes ${r.passes} open ${r.firstOpen} search ${r.search.toFixed(1)}${empty.length ? " EMPTY " + empty.join(",") : ""} ${s.role ?? ""}`);
    } catch (e) { console.log(s.id, "ERR", (e as Error).message); }
  }
})();
