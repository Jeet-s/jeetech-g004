import * as path from "path";
import { LEVELS } from "../src/game/levels";
import { buildPuzzle } from "../src/game/nonogram";
import { sim, setTempting } from "../src/game/sim";
import { winRate } from "../scripts/bots";
(async () => {
  const lv = Number(process.argv[3]) - 1;
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of Object.values(mod).flat() as any[]) {
    const L = LEVELS[lv] as any;
    const spec = { ...L.spec, ...s, id: L.spec.id };
    L.spec = spec; L.puzzle = buildPuzzle(spec);
    const out: string[] = [];
    for (const k of [0, 2, 4, 8, 12, 16, 105, 110]) { setTempting(spec.id, k); out.push(`k${k}:${winRate(sim, sim.start(lv), "casual", 60).rate.toFixed(2)}`); }
    console.log(s.id, out.join(" "));
  }
})();
