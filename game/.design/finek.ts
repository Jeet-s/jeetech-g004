/** Fine knob search for single levels: npx tsx .design/finek.ts <level>:<target> ...  → writes pacing.json entries. */
import { readFileSync, writeFileSync } from "fs";
import { LEVELS } from "../src/game/levels";
import { lineCount } from "../src/game/nonogram";
import { sim, setTempting } from "../src/game/sim";
import { winRate } from "../scripts/bots";
const file = "src/game/pacing.json";
const pacing = JSON.parse(readFileSync(file, "utf8"));
for (const arg of process.argv.slice(2)) {
  const [ns, ts] = arg.split(":"); const l = Number(ns) - 1, want = Number(ts);
  const id = LEVELS[l].spec.id, n = Math.min(40, lineCount(LEVELS[l].puzzle));
  const rate = (k: number, p: "casual" | "skilled") => { setTempting(id, k); return winRate(sim, sim.start(l), p, 150).rate; };
  let best = { k: pacing[id] ?? 0, c: rate(pacing[id] ?? 0, "casual"), s: rate(pacing[id] ?? 0, "skilled") };
  const score = (c: number, s: number) => Math.abs(c - want) + (s < 0.88 ? (0.88 - s) * 3 : 0);
  const start = best.c;
  for (let k = 1; k <= n; k++) for (const d of [0, 1, 2, 3, 4, 6, 8, 10, 13, 16, 20, 25, 32, 40]) {
    const kk = k + 100 * d, c = rate(kk, "casual");
    if (Math.abs(c - want) > Math.abs(best.c - want) + 0.03) { if (c > want + 0.1) break; continue; }
    const s = rate(kk, "skilled");
    if (score(c, s) < score(best.c, best.s)) best = { k: kk, c, s };
    if (c > want + 0.1) break;
  }
  pacing[id] = best.k; setTempting(id, best.k);
  console.log(`L${l + 1} ${id} target ${want}: was ${start.toFixed(3)} → k=${best.k} casual ${best.c.toFixed(3)} skilled ${best.s.toFixed(3)}`);
}
writeFileSync(file, JSON.stringify(pacing, null, 2) + "\n");
