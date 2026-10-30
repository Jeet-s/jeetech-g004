/**
 * Probe: how hard can the bots' casual win rate get on a candidate board? (light: 1 level, a few knobs, 150 trials)
 *   npx tsx .design/rate.ts <specfile.ts>   — each spec must reuse an existing level id (it is swapped in for that level).
 * Prints casual win rate at k = 0 / quarter / half / all lines tempting, and skilled at the knob nearest 0.62 casual.
 * A late practise board must be ABLE to reach ~0.60-0.66 casual (min casual ≤ 0.6) with skilled ≥ 0.88 there.
 */
import * as path from "path";
import { LEVELS } from "../../src/game/levels";
import { buildPuzzle, lineCount, logicSolve } from "../../src/game/nonogram";
import { sim, setTempting } from "../../src/game/sim";
import { winRate } from "../../scripts/bots";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const specs = Object.values(mod).flat() as any[];
  for (const s of specs) {
    const idx = LEVELS.findIndex((l) => l.spec.id === s.id);
    if (idx < 0) { console.log(s.id, "no such level id"); continue; }
    const L = LEVELS[idx] as any;
    L.spec = { ...L.spec, ...s }; L.puzzle = buildPuzzle(L.spec);
    const n = lineCount(L.puzzle);
    const ks = [0,1,2,3,4,5,6,8,10,13,n,n+200,n+800];
    const out: string[] = [];
    let best = { k: 0, c: 1, sk: 1 };
    for (const k of ks) {
      setTempting(s.id, k);
      const c = winRate(sim, sim.start(idx), "casual", 150).rate;
      out.push(`k${k}:${c.toFixed(2)}`);
      if (Math.abs(c - 0.62) < Math.abs(best.c - 0.62)) best = { k, c, sk: winRate(sim, sim.start(idx), "skilled", 150).rate };
    }
    const r = logicSolve(L.puzzle);
    console.log(`L${idx + 1} ${s.id} ${L.puzzle.w}x${L.puzzle.h} looks ${r.steps} passes ${r.passes} open ${r.firstOpen} search ${r.search.toFixed(1)} | casual ${out.join(" ")} | nearest 0.62: k${best.k} casual ${best.c.toFixed(2)} skilled ${best.sk.toFixed(2)}`);
  }
})();
