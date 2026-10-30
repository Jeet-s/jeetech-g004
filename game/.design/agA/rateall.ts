// usage: npx tsx rateall.ts <id> <palette json> <file with arts separated by blank lines>
import * as fs from "fs";
import { LEVELS } from "../../src/game/levels";
import { buildPuzzle, lineCount, logicSolve } from "../../src/game/nonogram";
import { sim, setTempting } from "../../src/game/sim";
import { winRate } from "../../scripts/bots";
const id = process.argv[2], palette = JSON.parse(process.argv[3]);
const arts = [fs.readFileSync(process.argv[4], "utf8").split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean)[Number(process.argv[5])]];
const idx = LEVELS.findIndex((l) => l.spec.id === id); const L = LEVELS[idx] as any; const base = L.spec;
for (const a of arts) {
  L.spec = { ...base, palette, art: "\n" + a }; L.puzzle = buildPuzzle(L.spec);
  const r = logicSolve(L.puzzle); if (!r.unique) { console.log("NOT UNIQUE"); continue; }
  const n = lineCount(L.puzzle); const out: string[] = [];
  for (const k of (process.env.KS ? process.env.KS.split(",").map(Number) : [Math.round(n / 4), Math.round(n / 2), n])) { setTempting(id, k); out.push(`k${k}:${winRate(sim, sim.start(idx), "casual", 150).rate.toFixed(2)}`); }
  console.log(`looks ${r.steps} passes ${r.passes} ${out.join(" ")} :: ${a.split("\n").join(" / ")}`);
}
