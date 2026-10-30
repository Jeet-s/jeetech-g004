import { LEVELS } from "../src/game/levels";
import { isSolved, locked, newPlay, nextDeduction, paint, toolValue, X } from "../src/game/nonogram";
let bad = 0;
for (const L of LEVELS) {
  const p = L.puzzle;
  let s = newPlay(p); let color = 1; let n = 0; let note = "";
  while (!isSolved(p, s.cells) && n < 2000) {
    const adv = nextDeduction(p, s.cells);
    const need = (i: number) => (p.solution[i] > 0 ? s.cells[i] !== p.solution[i] : s.cells[i] > 0);
    const pick = adv?.cells.find((i) => p.solution[i] > 0 && need(i)) ?? p.solution.findIndex((_, i) => !locked(p, i) && need(i));
    if (pick < 0) { note = "no pick"; break; }
    const want = p.solution[pick];
    if (want > 0 && color !== want) { color = want; continue; }
    if (want === 0 && color !== s.cells[pick]) { color = s.cells[pick]; continue; }
    if (locked(p, pick)) { note = `locked pick ${pick}`; break; }
    const v = toolValue(s.cells[pick], "fill", color);
    const r = paint(p, s, [pick], v, { autoX: true, strikes: false });
    if (!r.changed.length) { note = `no change at ${pick}`; break; }
    s = r.state; n++;
  }
  if (!isSolved(p, s.cells)) { bad++; console.log(`L${L.number} FAIL after ${n}: ${note}`); }
  else if ([24,48,72,96,120].includes(L.number)) console.log(`L${L.number} ok in ${n} taps, ${p.w}x${p.h}`);
}
console.log("bad", bad);
