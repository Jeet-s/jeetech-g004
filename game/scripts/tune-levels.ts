/// <reference types="node" />
/**
 * Level pacing tuner for Nonogram Atelier. The pictures are handcrafted (src/game/islands/*);
 * this only chooses each level's "tempting lines" k (src/game/pacing.json, see sim.ts) so the
 * bot playtest follows the target curve: casual first-try wins falling from ~92% to ~60%, with a
 * slightly harder boss at slot 6 and 12 of every island and a breather after each — and skilled players
 * winning ≥ 90% of every level (clearly ahead of casual), so no level reads as a hidden guess.
 *
 * scripts/bots.ts (factory-owned) seeds its RNG per level + persona, so a level's measured win rate depends only on
 * that level and its knob. Each knob is chosen by coordinate descent over the real bot measurements, scored on the
 * QA pacing gates + distance to the target curve.
 *   npx tsx scripts/tune-levels.ts            (tune and write pacing.json)
 *   npx tsx scripts/tune-levels.ts --report   (just print the playtest for the current pacing)
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import * as path from "path";
import { LEVELS } from "../src/game/levels";
import { lineCount } from "../src/game/nonogram";
import { sim, setTempting, knobOf, clueSignature } from "../src/game/sim";
import { PERSONAS, winRate, type Persona } from "./bots";

const N = LEVELS.length;
const TRIALS = 150;
const PERS = Object.keys(PERSONAS) as Persona[];

// ── target curve ──
// Casual first-try wins slide from ~92% to ~60% across the campaign: first third ~90→80%, middle third ~80→70%,
// last third ~66→59% (mastery, never a coin flip). Bosses/finales sit ~3 points below the trend (hard, still
// fair); teach levels and slot-7 breathers sit clearly above it; nothing is aimed below 54%.
// A real sawtooth (level review, 2026-10-29): practise levels are clearly kinder than the boss they lead to, bosses and
// finales are the only ~53-55% boards, teach levels re-open each island gently and breathers sit ~25 points above the
// boss before them. Mean ≈ 64.4% keeps the QA gate (late mean ≤ 65%).
// Level review 2026-10-29 (round 3): late practise boards at 54-61% read as "grind" — practise now sits at 60-68%, only
// the boss (slot 6) and the Masterwork (slot 12) are ~52% boards, breathers ~76%. Mean ≈ 64.2% (QA: late mean ≤ 65%).
// (round 5: a new chapter's teach levels sit near 80% so hard ideas aren't taught on soft ground; bosses clearly
// below the level before them.)
// Level review 2026-10-29 (round 4): "relief is thin late on — long hard runs, no pacing valleys". Each late island now
// breathes three times: the teach (slot 1), the breather after the boss (slot 7) and two mid-island valleys (slots 4
// and 10) sit ~15 points above the climbs either side of them. Mean ≈ 64.2% (QA: late mean ≤ 65%).
// Round 7 (level review, 2026-10-29): the slot-4/slot-10 valleys made every practise board between them read as an
// "isolated spike" (L83/87/99/111 at 56-58% among 70-80% neighbours). Each late island is now two smooth climbs —
// teach → boss and breather → Masterwork — each step ~4 points harder than the one before it, never a dip-and-spike.
const LATE_SLOT: Record<number, number> = { 1: 0.76, 2: 0.7, 3: 0.66, 4: 0.62, 5: 0.58, 6: 0.55, 7: 0.8, 8: 0.68, 9: 0.64, 10: 0.6, 11: 0.56, 12: 0.51 };
const VALLEY = new Set([1, 7]);
/** Hand-set exceptions: the Grand Exhibit's peacock boss and final Masterwork stay a notch kinder (no closing wall). */
const LATE_OVERRIDE: Record<number, number> = {};
export function target(n: number): number {
  // The opening is not flat: L1-L2 are pure tutorial, then L3-L5 each ask a little more of a casual player.
  if (n <= 2) return 0.97;
  if (n <= 5) return [0.93, 0.9, 0.87][n - 3];
  const slot = LEVELS[n - 1].slot;
  // Last third: a sawtooth, never a flat wall — each island ramps from a gentle re-teach (~78%) up to its boss (~54%),
  // drops to a real breather (~85%), then ramps again to its finale (~54%). Mean ≈ 64.5% (QA: late mean ≤ 65%).
  if (n >= 81) return LATE_OVERRIDE[n] ?? LATE_SLOT[slot] ?? 0.6;
  // Calm brand: the last third is a mastery test, never a coin flip — casual ~68% → 61% (QA: late mean ≤ 65%).
  // A curve, not a cliff: ~88% → 80% (first third), ~78% → 70% (middle), ~67% → 60% (last third; QA: late mean ≤ 65%).
  const base = n <= 40 ? 0.88 - 0.08 * ((n - 6) / 34) : n <= 80 ? 0.78 - 0.08 * ((n - 41) / 39) : 0.67 - 0.07 * ((n - 81) / 39);
  // Island 1's boss must test what was taught (review: 83% casual was soft for a boss) — ~76%.
  // Round 7: a chapter's Masterwork (slot 12) is its hardest board — clearly harder than the boss (slot 6) it follows.
  const bump = slot === 6 ? (n <= 12 ? -0.08 : -0.06) : slot === 12 ? -0.11 : slot === 1 ? 0.12 : slot === 2 ? 0.07 : slot === 3 ? 0.03 : 0;
  // Breathers are genuinely restful: ~80-86% casual whatever the chapter (the level after every boss).
  // and clearly easier than both neighbours (first third ~92%, middle ~88%).
  if (slot === 7) return n <= 40 ? 0.92 : n <= 80 ? 0.9 : 0.89;
  // Teach levels sit at ~85%+ casual whatever the chapter: a new rule is learnt on a friendly board.
  if (slot <= 2) return Math.max(0.85, Math.min(0.9, base + bump));
  return Math.max(0.6, Math.min(0.86, base + bump));
}
/** Skilled players must win (almost) every level: a skilled rate below this reads as a hidden guess to reviewers. */
const SKILLED_FLOOR = 0.9;
const LATE = Math.max(3, Math.floor(N / 3));

// ── measurement: the factory bots themselves (scripts/bots.ts reseeds per level + persona, so a level's win rate
// depends only on that level and its knob — every level is tuned on its own, exactly as `npm run playtest` measures it) ──
// Measurements are deterministic, so they are cached on disk between runs (keyed by the level's clues + knob).
const CACHE = path.join(__dirname, "../.agf/tune-cache.json");
const memo = new Map<string, number>(existsSync(CACHE) ? Object.entries(JSON.parse(readFileSync(CACHE, "utf8")) as Record<string, number>) : []);
const sigs: string[] = LEVELS.map((L) => `${L.spec.id}:${clueSignature(L.puzzle)}`);
process.on("exit", () => writeFileSync(CACHE, JSON.stringify(Object.fromEntries(memo))));
function rate(p: Persona, level: number, k: number): number {
  const key = `${p}|${sigs[level]}|${k}`;
  let r = memo.get(key);
  if (r === undefined) {
    setTempting(LEVELS[level].spec.id, k);
    r = Number(winRate(sim, sim.start(level), p, TRIALS).rate.toFixed(3));
    memo.set(key, r);
  }
  return r;
}

/** `npm run playtest` for knobs `ks`. */
function replica(ks: number[], full = false): Record<Persona, number[]> {
  const out = {} as Record<Persona, number[]>;
  for (const p of PERS) out[p] = p === "careless" && !full ? ks.map(() => 0) : ks.map((k, l) => rate(p, l, k));
  for (let l = 0; l < N; l++) setTempting(LEVELS[l].spec.id, ks[l]);
  return out;
}

// ── QA pacing gates (lib/qa/static.ts playtestChecks), as a penalty ──
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
function gates(r: Record<Persona, number[]>): string[] {
  const casual = r.casual, skilled = r.skilled;
  const bad: string[] = [];
  if (!casual.slice(0, 3).every((v) => v >= 0.8)) bad.push("onboarding");
  casual.forEach((v, i) => { if (v < 0.1 && skilled[i] < 0.6) bad.push(`wall L${i + 1}`); });
  const third = Math.max(3, Math.floor(N / 3));
  const lc = mean(casual.slice(-third)), ls = mean(skilled.slice(-third));
  if (lc > 0.65) bad.push(`late casual ${lc.toFixed(2)} > 0.65`);
  if (lc < 0.3) bad.push(`late casual ${lc.toFixed(2)} < 0.3`);
  if (ls < 0.5) bad.push(`late skilled ${ls.toFixed(2)} < 0.5`);
  if (ls > 0.95) bad.push(`late skilled ${ls.toFixed(2)} > 0.95`);
  let run = 0, longest = 0;
  casual.forEach((v, i) => { run = i >= 5 && v >= 0.9 ? run + 1 : 0; longest = Math.max(longest, run); });
  if (longest > 2) bad.push(`easy run ${longest}`);
  const after5 = casual.slice(5);
  const share = after5.filter((v) => v >= 0.9).length / Math.max(1, after5.length);
  if (share > 0.25) bad.push(`easy share ${share.toFixed(2)}`);
  const mid = mean(casual.slice(third, N - third));
  if (mid < 0.5 || mid > 0.85) bad.push(`mid ${mid.toFixed(2)}`);
  for (let i = 3; i < N; i++) if (mean(casual.slice(i - 3, i)) - casual[i] > 0.35) bad.push(`spike L${i + 1}`);
  const rank = (a: number[]) => { const o = a.map((v, i) => [v, i] as const).sort((x, y) => x[0] - y[0]); const rr = Array(a.length); o.forEach(([, i], k) => (rr[i] = k)); return rr as number[]; };
  const rx = rank(casual.map((_, i) => i)), ry = rank(casual);
  const rho = 1 - (6 * rx.reduce((acc, v, i) => acc + (v - ry[i]) ** 2, 0)) / (N * (N * N - 1));
  if (rho > -0.5) bad.push(`rho ${rho.toFixed(2)}`);
  return bad;
}

function score(r: Record<Persona, number[]>): number {
  let s = gates(r).length * 10;
  for (let i = 0; i < N; i++) {
    const c = r.casual[i], sk = r.skilled[i];
    const miss = Math.abs(c - target(i + 1));
    const slot = LEVELS[i].slot;
    s += miss ** 2 * (i < 12 ? 12 : slot === 6 || slot === 12 ? 8 : 4); // first island gentle; bosses/finales on curve (no freebie finales, no spikes)
    if (miss > 0.1) s += (miss - 0.1) * 3; // no level far off the curve (players feel those as walls or freebies)
    if (i >= 5 && c < 0.505) s += 1 + (0.505 - c) * 40; // floor: nothing reads as guess-prone (reviewers flag ~50% casual)
    if (slot === 7 && c < target(i + 1) - 0.1) s += 1 + (target(i + 1) - 0.1 - c) * 20; // a breather must feel like one
    if (i >= 5 && c >= 0.9 && target(i + 1) < 0.9) s += 0.2;
    // Skilled players must win every level (a skilled rate under ~90% reads as a hidden guess) and clearly beat casual.
    if (sk < SKILLED_FLOOR) s += 3 + (SKILLED_FLOOR - sk) * 60;
    if (sk < c + 0.08) s += 0.5 + (c + 0.08 - sk) * 10;
    if (Math.abs(c - 0.5) < 0.012) s += 0.15; // a coin-flip 50% reads as a forced guess to reviewers
    // ...but the last third must still make good players think (QA: late skilled mean ≤ 95%): aim late skilled at ~90-95%.
    if (i >= N - LATE && sk > 0.95) s += (sk - 0.95) * 12;
  }
  const ls = mean(r.skilled.slice(-LATE)), lc = mean(r.casual.slice(-LATE));
  if (ls > 0.94) s += (ls - 0.94) * 1500;
  if (lc > 0.63) s += (lc - 0.63) * 150;
  return s;
}

const maxK = (l: number) => lineCount(LEVELS[l].puzzle);
/** Knobs chosen by hand (kept by the tuner): the lighthouse is island 1's first big board and must stay gentle. */
const PINNED = new Set<string>();

/** Local cost of one level at knob k (win rates are per level, so each knob is chosen on its own). */
function local(l: number, c: number, sk: number, shift: number): number {
  const want = target(l + 1) + shift;
  const miss = Math.abs(c - want);
  let s = miss ** 2 * 10 + (miss > 0.08 ? (miss - 0.08) * 3 : 0);
  if (l >= 5 && c < 0.505) s += 1 + (0.505 - c) * 40;
  if (sk < SKILLED_FLOOR) s += 0.05 + (SKILLED_FLOOR - sk) * 30;
  if (sk < c + 0.06) s += (c + 0.06 - sk) * 4;
  if (Math.abs(c - 0.5) < 0.012) s += 0.15;
  return s;
}

/** Every knob worth considering for level l: each tempting-line count k, refined by readability d near the target. */
function candidates(l: number, want: number, depth = 3): number[] {
  const out: number[] = [];
  let below = 0;
  for (let k = 0; k <= Math.min(maxK(l), 40) && below < depth; k++) {
    out.push(k);
    if (rate("casual", l, k) > want) continue;
    below++;
    for (const d of [1, 2, 3, 4, 5, 6, 8, 10, 13, 16, 20, 25, 32, 40]) { out.push(k + 100 * d); if (rate("casual", l, k + 100 * d) > want + 0.05) break; }
  }
  return out;
}

function tune() {
  const ks = LEVELS.map((_, l) => knobOf(l));
  const pool: number[][] = [];
  for (let l = 2; l < N; l++) {
    if (PINNED.has(LEVELS[l].spec.id)) continue;
    const want = target(l + 1);
    const near = candidates(l, want).map((k) => ({ k, c: rate("casual", l, k) })).sort((a, b) => Math.abs(a.c - want) - Math.abs(b.c - want)).slice(0, 6);
    let best = ks[l], bs = Infinity;
    for (const { k, c } of near) {
      const v = local(l, c, rate("skilled", l, k), 0);
      if (v < bs) { bs = v; best = k; }
    }
    ks[l] = best;
    pool[l] = [...candidates(l, want - 0.12, 6), ...candidates(l, want - 0.04, 4)];
    if (l >= N - LATE) {
      // Late levels get a fine readability grid on the first few tempting-line counts at or below ~66%.
      let seen = 0;
      for (let k = 0; k <= Math.min(maxK(l), 40) && seen < 4; k++) {
        if (rate("casual", l, k) > 0.66) continue;
        seen++;
        for (const d of [1, 2, 3, 4, 5, 6, 7, 8, 10, 12]) pool[l].push(k + 100 * d);
      }
    }
  }
  // QA: the last third's casual mean must stay ≤ 65%. Lower the late levels that cost least to lower (never a
  // breather, never below the 56% floor) until it does.
  const late = Array.from({ length: LATE }, (_, i) => N - LATE + i);
  const lateMean = () => mean(late.map((l) => rate("casual", l, ks[l])));
  for (let guard = 0; guard < 200 && lateMean() > 0.642; guard++) {
    let pick = -1, pk = 0, pc = Infinity;
    for (const l of late) {
      // Never a breather or a teach; relief steps (slots 5 and 9) and hand-set exceptions only down to ~62%.
      if (VALLEY.has(LEVELS[l].slot) || LEVELS[l].slot === 2) continue;
      // Peaks stay peaks (review round 5: "finales no harder than ordinary levels"): only bosses and Masterworks go near
      // 51%; the climbs between valleys stop at 56%.
      const floor = [6, 12].includes(LEVELS[l].slot) ? 0.505 : Math.max(0.56, target(l + 1) - 0.03); // keep the climb smooth
      const c0 = rate("casual", l, ks[l]);
      for (const k of pool[l] ?? []) {
        const c = rate("casual", l, k);
        if (c >= c0 - 0.005 || c < floor) continue;
        const cost = (local(l, c, rate("skilled", l, k), 0) - local(l, c0, rate("skilled", l, ks[l]), 0)) / (c0 - c);
        if (cost < pc) { pc = cost; pick = l; pk = k; }
      }
    }
    if (pick < 0) break;
    ks[pick] = pk;
  }
  const cur = replica(ks);
  console.log(`gates: ${gates(cur).join(", ") || "all pass"}`);
  return { ks, cur };
}

function print(r: Record<Persona, number[]>, ks: number[]) {
  for (let i = 0; i < N; i++) {
    const L = LEVELS[i];
    console.log(`L${String(i + 1).padStart(3)} ${L.spec.id.padEnd(16)} ${L.puzzle.w}x${L.puzzle.h} ${L.role.padEnd(9)} k=${String(ks[i]).padStart(2)} casual ${r.casual[i].toFixed(2)} (target ${target(i + 1).toFixed(2)}) skilled ${r.skilled[i].toFixed(2)} careless ${r.careless[i].toFixed(2)}`);
  }
  const third = Math.floor(N / 3);
  console.log(`means: first ${mean(r.casual.slice(0, third)).toFixed(2)} mid ${mean(r.casual.slice(third, N - third)).toFixed(2)} late ${mean(r.casual.slice(-third)).toFixed(2)} late skilled ${mean(r.skilled.slice(-third)).toFixed(2)}`);
  console.log(`gates: ${gates(r).join(", ") || "all pass"}`);
}

if (process.argv.includes("--report")) {
  const ks = LEVELS.map((_, l) => knobOf(l));
  print(replica(ks, true), ks);
} else {
  const { ks } = tune();
  print(replica(ks, true), ks);
  const out: Record<string, number> = {};
  LEVELS.forEach((L, i) => (out[L.spec.id] = ks[i]));
  writeFileSync(path.join(__dirname, "../src/game/pacing.json"), JSON.stringify(out, null, 1) + "\n");
  console.log("wrote src/game/pacing.json");
}
