/// <reference types="node" />
/**
 * Level validation — run by the factory's QA with `npm run validate`.
 * Loads EVERY level through the real engine (src/game/nonogram.ts) and proves, three ways, that it
 * is completable — and that it is a fair nonogram:
 *   1. line logic alone (no guessing) settles every cell to exactly the drawn picture → unique solution;
 *   2. the bot Sim (src/game/sim.ts) reaches "won" by always taking a yielding look;
 *   3. the play API the screens use (paint + auto-X) reaches isSolved() by inking the deduced cells.
 * Difficulty per level = the solver's search effort — Σ over the solve of (open lines ÷ lines that yield), the
 * expected number of lines a player must read to find each next deduction — scaled by what makes each read
 * harder: logic depth (√ passes: how often a line must wait for its crossings), colours (every extra colour is
 * another constraint to cross-check, +40% each) and hidden information (each smudged line / cracked number
 * must be inferred from its crossings, +30% each).
 *
 * Final stdout line (JSON): {"levels": N, "solvable": N, "difficulty": [d1, d2, ...]}
 */
import { LEVELS } from "../src/game/levels";
import { BLANK, isSolved, logicSolve, newPlay, paint, maskValue, X, nextDeduction, lineIndices, lineCount, clueOf } from "../src/game/nonogram";
import { sim } from "../src/game/sim";
import { winRate } from "./bots";

let ok = 0;
const difficulty: number[] = [];
const problems: string[] = [];
const seenArt = new Map<string, number>();

for (const L of LEVELS) {
  const p = L.puzzle;
  const tag = `L${L.number} ${L.spec.id}`;
  let good = true;
  const fail = (msg: string) => { good = false; problems.push(`${tag}: ${msg}`); };

  // 1. Logic: unique, no guessing.
  const r = logicSolve(p);
  if (!r.unique) fail(r.contradiction ? "clues contradict" : `line logic stalls with ${r.unknown} undecided cells (needs guessing or not unique)`);
  const hidden = (L.spec.smudge?.length ?? 0) + (L.spec.crack?.length ?? 0);
  // Difficulty = the logic work of the board (lines read per deduction × depth, colours, hidden clues) weighted by how often
  // a casual player's first try stalls on it (the same human-like bots and trials as `npm run playtest`): a deep board
  // with an obvious next step at every turn is long, not hard; a scarce-deduction board is both.
  const work = r.search * Math.sqrt(Math.max(1, r.passes)) * (1 + 0.4 * (p.palette.length - 1)) * (1 + 0.3 * hidden);
  const stall = 1 - winRate(sim, sim.start(L.number - 1), "casual", 150).rate;
  difficulty.push(Number((work * (stall + 0.05) * 10).toFixed(1)));

  // Board hygiene: no empty (clue 0) lines unless fully void; no repeated pictures.
  for (let l = 0; l < lineCount(p); l++) {
    const cells = lineIndices(p.w, p.h, l);
    if (!clueOf(p, l).blocks.length && !cells.every((i) => p.void[i])) fail(`empty line ${l < p.h ? `row ${l + 1}` : `column ${l - p.h + 1}`}`);
  }
  const key = `${p.w}x${p.h}:${p.solution.join("")}`;
  if (seenArt.has(key)) fail(`same picture as L${seenArt.get(key)}`);
  seenArt.set(key, L.number);

  // 2. Sim: greedy looks reach a win.
  let s = sim.start(L.number - 1);
  for (let n = 0; n < 2000 && sim.status(s) === "playing"; n++) {
    const moves = sim.moves(s);
    let pick = -1, best = -Infinity;
    for (const m of moves) {
      const nx = sim.apply(s, m);
      const v = sim.status(nx) === "won" ? Infinity : sim.progress(nx);
      if (v > best) { best = v; pick = m; }
    }
    if (pick < 0) break;
    s = sim.apply(s, pick);
  }
  if (sim.status(s) !== "won") fail("bot sim cannot finish the level");

  // 3. Play API: follow the hint engine's next deductions, painting exactly what the player would.
  if (r.unique) {
    let play = newPlay(p);
    for (let guard = 0; guard < 5000 && !isSolved(p, play.cells); guard++) {
      const adv = nextDeduction(p, play.cells);
      if (!adv) break;
      for (const i of adv.cells) {
        const v = maskValue(1 << p.solution[i]);
        const want = v > 0 ? v : X;
        if (play.cells[i] === want) continue;
        if (play.cells[i] !== BLANK) play = paint(p, play, [i], BLANK).state;
        play = paint(p, play, [i], want).state;
      }
    }
    if (!isSolved(p, play.cells)) fail("following the hint engine does not complete the picture");
    if (play.slips) fail(`hint-following made ${play.slips} slips`);
  }

  if (good) ok++;
}

const N = LEVELS.length;
const third = Math.max(1, Math.floor(N / 3));
const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
const early = avg(difficulty.slice(0, third)), late = avg(difficulty.slice(-third));
console.error(`difficulty: first third avg ${early.toFixed(1)}, last third avg ${late.toFixed(1)} (x${(late / early).toFixed(1)})`);
if (problems.length) console.error(problems.join("\n"));
if (N < 30) console.error(`only ${N} levels (need ≥ 30)`);
console.log(JSON.stringify({ levels: N, solvable: ok, difficulty }));
process.exit(ok === N && N >= 30 && late >= 3 * early ? 0 : 1);
