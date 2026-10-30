import { LEVELS } from "../src/game/levels";
import { sim, setTempting, type NonoState } from "../src/game/sim";
import { PERSONAS } from "../scripts/bots";
function play(level: number, rand: () => number, noise: number, cap = 400): boolean {
  let s: NonoState = sim.start(level);
  for (let n = 0; n < cap; n++) {
    const st = sim.status(s); if (st !== "playing") return st === "won";
    const moves = sim.moves(s); if (!moves.length) return false;
    let pick = moves[Math.floor(rand() * moves.length)];
    if (rand() > noise) { let best = -Infinity; for (const m of moves) { const nx = sim.apply(s, m); const v = sim.status(nx) === "won" ? Infinity : sim.progress(nx) + rand() * 1e-6; if (v > best) { best = v; pick = m; } } }
    s = sim.apply(s, pick);
  }
  return false;
}
const lv = process.argv.slice(2).map(Number);
for (const n of lv) {
  const out: string[] = [];
  for (const k of [0,1,2,3,5,8]) {
    setTempting(LEVELS[n-1].spec.id, k);
    let a = (n * 2654435761 + k * 40503 + 17) >>> 0;
    const rand = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    let w = 0; for (let i = 0; i < 200; i++) if (play(n-1, rand, PERSONAS.casual)) w++;
    out.push(`k${k}:${(w/200).toFixed(2)}`);
  }
  console.log(`L${n} ${LEVELS[n-1].puzzle.w}x${LEVELS[n-1].puzzle.h}`, out.join(" "));
}
