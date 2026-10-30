/// <reference types="node" />
/**
 * Level-design helper: solver facts + TRUE (sound-RNG) bot win rates for chosen levels.
 *   npx tsx scripts/measure-levels.ts 5 16 30-36        (levels by 1-based number or range)
 *   K=0,3,6 npx tsx scripts/measure-levels.ts 61        (also try these tempting-line knobs)
 * True rates ignore the factory bots' short RNG cycle; `npm run playtest` can differ per level until
 * scripts/tune-levels.ts re-aligns the knobs (pacing.json) for the whole campaign.
 */
import { LEVELS } from "../src/game/levels";
import { logicSolve } from "../src/game/nonogram";
import { sim, setTempting, knobOf, type NonoState } from "../src/game/sim";
import { PERSONAS, type Persona } from "./bots";

function play(level: number, rand: () => number, noise: number, cap = 400): boolean {
  let s: NonoState = sim.start(level);
  for (let n = 0; n < cap; n++) {
    const st = sim.status(s);
    if (st !== "playing") return st === "won";
    const moves = sim.moves(s);
    if (!moves.length) return false;
    let pick = moves[Math.floor(rand() * moves.length)];
    if (rand() > noise) {
      let best = -Infinity;
      for (const m of moves) {
        const next = sim.apply(s, m);
        const v = sim.status(next) === "won" ? Infinity : sim.progress(next) + rand() * 1e-6;
        if (v > best) { best = v; pick = m; }
      }
    }
    s = sim.apply(s, pick);
  }
  return false;
}
function rate(level: number, p: Persona, trials = 300): number {
  let a = (level * 2654435761 + 17) >>> 0;
  const rand = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let w = 0;
  for (let i = 0; i < trials; i++) if (play(level, rand, PERSONAS[p])) w++;
  return w / trials;
}
const want: number[] = [];
for (const a of process.argv.slice(2)) {
  const [x, y] = a.split("-").map(Number);
  for (let n = x; n <= (y || x); n++) want.push(n);
}
const ks = (process.env.K ?? "").split(",").filter(Boolean).map(Number);
for (const n of want.length ? want : LEVELS.map((l) => l.number)) {
  const L = LEVELS[n - 1], p = L.puzzle, r = logicSolve(p);
  const k0 = knobOf(n - 1);
  const row = [`L${n} ${L.spec.id} ${p.w}x${p.h} ${p.palette.length}c ${L.role}${L.masterwork ? "*" : ""}`, `unique=${r.unique} looks=${r.steps} passes=${r.passes} open=${r.firstOpen}`];
  for (const k of [k0, ...ks.filter((k: number) => k !== k0)]) {
    setTempting(L.spec.id, k);
    row.push(`k=${k}: casual ${rate(n - 1, "casual").toFixed(2)} skilled ${rate(n - 1, "skilled").toFixed(2)}`);
  }
  setTempting(L.spec.id, k0);
  console.log(row.join(" | "));
}
