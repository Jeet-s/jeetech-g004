import { LEVELS } from "../src/game/levels";
import { isSolved, locked, newPlay, paint, toolValue } from "../src/game/nonogram";
import { qaNextRun } from "../src/game/qaRun";
let worst = 0;
for (const L of LEVELS) {
  const p = L.puzzle;
  let s = newPlay(p); let color = 1; let steps = 0;
  while (!isSolved(p, s.cells) && steps < 500) {
    const run = qaNextRun(p, s.cells, color);
    if (!run) break;
    steps++;
    if (run.color !== color) { color = run.color; continue; }
    const v = toolValue(s.cells[run.cells[0]], "fill", color);
    const r = paint(p, s, run.cells, v, { autoX: true, strikes: false });
    if (!r.changed.length) { console.log("nochange", L.number); break; }
    s = r.state;
  }
  worst = Math.max(worst, steps);
  if (!isSolved(p, s.cells) || steps > 60) console.log(`L${L.number} ${p.w}x${p.h} K${p.palette.length} steps ${steps} solved ${isSolved(p, s.cells)}`);
}
console.log("worst", worst);
