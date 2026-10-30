/// <reference types="node" />
/** Engine self-test for the play API the screens use:  npx tsx scripts/engine-test.ts */
import { buildPuzzle, newPlay, paint, undo, redo, hintLine, clueDone, lineSatisfied, isSolved, isLost, starsFor, pigmentsFor, toolValue, nextDeduction, lineSolve, X, DOT, BLANK } from "../src/game/nonogram";

let fails = 0;
const check = (name: string, cond: boolean) => { if (!cond) { fails++; console.log(`FAIL ${name}`); } else console.log(`ok   ${name}`); };

// Teacup: row 0 = "####." (clue 4), row 1 = "#####".
const p = buildPuzzle({ id: "t", title: "t", palette: ["#000"], art: `
####.
#####
#####
####.
.##..` });

let s = newPlay(p);
check("fresh board not solved", !isSolved(p, s.cells));
// Tap fill on row 0 cells 0..3 as one drag → row satisfied → auto-X on cell 4.
let r = paint(p, s, [0, 1, 2, 3], 1);
s = r.state;
check("drag inks four cells", [0, 1, 2, 3].every((i) => s.cells[i] === 1));
check("auto-X closes the finished row", s.cells[4] === X && r.completedLines.includes(0));
check("one undo step for the drag", s.undo.length === 1);
s = undo(s);
check("undo clears the drag and its auto-X", s.cells.slice(0, 5).every((v) => v === BLANK));
s = redo(s);
check("redo restores it", s.cells[4] === X && s.cells[0] === 1);
check("row 0 clue greyed", clueDone(p, s.cells, 0).every(Boolean));

// Tool cycling: tapping X on an X clears it; dot marks.
check("toolValue toggles off", toolValue(X, "x", 1) === BLANK && toolValue(BLANK, "dot", 1) === DOT);

// Slip without strikes: allowed, counted.
s = paint(p, s, [24], 1).state; // (4,4) is paper
check("slip counted, not refused", s.slips === 1 && s.cells[24] === 1);
s = undo(s);

// Strikes mode refuses wrong ink and crosses it out.
const sm = paint(p, newPlay(p), [24], 1, { autoX: true, strikes: true });
check("strikes mode refuses wrong ink", sm.state.cells[24] === X && sm.state.strikes === 1 && sm.rejected.length === 1);
check("not lost after one strike", !isLost(p, sm.state, { autoX: true, strikes: true }));

// Partial clue grey-out from the edge: row 4 clue "2" — mark X at 0 then ink 1,2 then X at 3.
let t = newPlay(p);
t = paint(p, t, [20], X, { autoX: false, strikes: false }).state;
t = paint(p, t, [21, 22], 1, { autoX: false, strikes: false }).state;
check("closed run greys its clue number", lineSatisfied(p, t.cells, 4) && clueDone(p, t.cells, 4)[0]);

// Hint Brush: whole line correct + counted.
const h = hintLine(p, newPlay(p), 1);
check("hint paints the chosen line", [5, 6, 7, 8, 9].every((i) => h.state.cells[i] === 1) && h.state.hints === 1);

// Solve by following nextDeduction.
let q = newPlay(p);
for (let g = 0; g < 100 && !isSolved(p, q.cells); g++) {
  const a = nextDeduction(p, q.cells);
  if (!a) break;
  for (const i of a.cells) q = paint(p, q, [i], p.solution[i] > 0 ? p.solution[i] : X).state;
}
check("hint engine leads to the solved picture", isSolved(p, q.cells) && q.slips === 0);
check("3 stars clean solve", starsFor({ hints: 0, slips: 0, seconds: 30 }) === 3);
check("2 stars with a hint", starsFor({ hints: 1, slips: 0, seconds: 30 }) === 2);
check("pigments: no-hint bonus", pigmentsFor(p, { hints: 0, slips: 0, seconds: 30 }, false).noHint > 0);
check("explanation text present", (nextDeduction(p, newPlay(p).cells)?.text.length ?? 0) > 20);

// Colour line logic: "2a 1b" in 3 cells: different colours may touch → exact fit.
const full = 0b111;
const res = lineSolve([{ len: 2, color: 1 }, { len: 1, color: 2 }], [full, full, full], 2);
check("different colours touch: exact fit", !!res && res[0] === 2 && res[1] === 2 && res[2] === 4);
const same = lineSolve([{ len: 2, color: 1 }, { len: 1, color: 1 }], [full, full, full], 2);
check("same colours need a gap: impossible in 3", same === null);
// Cracked number: "? 1" (colour 1) in 4 cells where the last cell is ink → the "?" run ends by cell 1.
const crk = lineSolve([{ len: 1, color: 1, hidden: true }, { len: 1, color: 1 }], [3, 3, 3, 2], 1);
check("cracked run fits before the last run", !!crk && crk[2] === 1 && crk[3] === 2);

console.log(fails ? `${fails} FAILED` : "all engine checks pass");
process.exit(fails ? 1 : 0);
