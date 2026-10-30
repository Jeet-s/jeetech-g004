/**
 * Simulation interface for the factory's bot playtesters (scripts/playtest.ts).
 * The builder implements it on the REAL engine of the game (no UI) so bots can
 * play every level the way people do. QA uses the results to reject levels
 * that are boring (too easy), walls (almost nobody wins) or badly paced, and the
 * level-design review reads every level through describe().
 *
 * How a nonogram is played, as a model. A solver scans rows and columns for one whose clue, held
 * against the marks already there, forces something — then inks/crosses what it forces (lineSolve in
 * nonogram.ts, the same logic the hint explanations use). One bot move is
 *   • a LOOK at an unfinished line: if it yields, the board advances by the richest deduction
 *     available (which line a player spots first doesn't change what the board teaches); if it
 *     yields nothing, the look is wasted;
 *   • or a HUNCH on a dead-end line: inking cells that line's clue doesn't support. A first try
 *     counts as failed at the first hunch — in the real game nothing is punished (no strikes, no
 *     timers, free undo), but an unsupported ink is exactly what makes players stall, abandon or
 *     reach for a hint.
 * Hunches exist only on dead-end lines, so boards where deductions are scarce (few lines yield)
 * offer more of them — hard for the right reason. How many of a level's lines are "tempting"
 * (k, src/game/pacing.json) is tuned per level by scripts/tune-levels.ts to the pacing curve.
 */
import { LEVELS, ISLANDS } from "./levels";
import { clueOf, clueSolve, isKnown, lineCount, lineIndices, logicSolve, maskValue, startMasks, type Puzzle } from "./nonogram";
import pacing from "./pacing.json";

export type Status = "playing" | "won" | "lost";

/**
 * How a level designer reads one level (scripts/levels-report.ts → QA's level-design review).
 * grid: the START state as ASCII art, one text row per board row, + a legend. intent: what this
 * level teaches or tests and its "aha" moment, written when the level was designed.
 */
export interface LevelBrief {
  grid: string;
  legend: string;
  intent: string;
  mechanics: string[]; // mechanics / twists in play on this level
}

export interface Sim<S, M> {
  levelCount: number;
  /** Fresh state of level `index` (0-based). */
  start(index: number): S;
  /** Legal moves from this state (what a player could tap/swipe now). */
  moves(state: S): M[];
  apply(state: S, move: M): S;
  status(state: S): Status;
  /** Higher = closer to winning — what a human "sees" as progress. Used by human-like bots. */
  progress(state: S): number;
  /** The level as a designer sees it — REQUIRED: QA's level-design review reads every level through it. */
  describe(index: number): LevelBrief;
}

export interface NonoState {
  level: number;
  /** Hash of the puzzle's clues — what makes this level a different puzzle from every other. */
  puzzle: string;
  /** One char per cell: candidate mask + 48 (bit 0 paper, bit c colour c); one bit set = decided. */
  masks: string;
  known: number;
  slips: number;
  moves: number;
}

// ── tuning knob per level: how many of its lines tempt a hunch when they dead-end (pacing.json) ──
const tempting: Record<string, number> = { ...(pacing as Record<string, number>) };
export function setTempting(id: string, k: number) { tempting[id] = k; thresholdCache.length = 0; }
/**
 * A knob is k + 100·d: k tempting lines, and d = how readable the board is once play is under way — every line that
 * yields right now is d extra times as likely to catch a player's eye (a clean board shows its next step; a busy
 * one hides it among dead ends). d only matters when a hunch is on offer, so the start position never changes.
 */
export const knobOf = (level: number) => tempting[LEVELS[level].spec.id] ?? 0;
export const temptingOf = (level: number) => knobOf(level) % 100;
const readabilityOf = (level: number) => Math.floor(knobOf(level) / 100);
const thresholdCache: number[] = [];
/** Lines whose rank is below this threshold are the tempting ones (the k lowest ranks). */
function thresholdOf(level: number): number {
  if (thresholdCache[level] !== undefined) return thresholdCache[level];
  const k = temptingOf(level);
  const sorted = Array.from(rankOf(level)).sort((a, b) => a - b);
  return (thresholdCache[level] = k <= 0 ? 0 : k >= sorted.length ? 2 : sorted[k]);
}

export function clueSignature(p: Puzzle): string {
  const enc = (l: number) => {
    const c = clueOf(p, l);
    return c.smudged ? "~" : (c.tally ? "T" : "") + c.blocks.map((b) => `${b.hidden ? "?" : b.len}${p.palette.length > 1 ? "abcdef"[b.color - 1] : ""}`).join(".");
  };
  const stamps = p.given.map((g, i) => (g ? (p.void[i] ? "v" : String(p.solution[i])) : "_")).join("");
  return `${p.w}x${p.h}|${Array.from({ length: lineCount(p) }, (_, l) => enc(l)).join("/")}|${stamps}`;
}

function fnv(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
}

/** Per-line hunch rank: a fixed pseudo-random number in [0,1) per (level, line). */
const hunchRank: Float64Array[] = [];
function rankOf(level: number): Float64Array {
  if (hunchRank[level]) return hunchRank[level];
  const r = new Float64Array(lineCount(LEVELS[level].puzzle));
  let s = (Number.parseInt(fnv(LEVELS[level].spec.id), 36) ^ 0x9e3779b9) >>> 0;
  for (let i = 0; i < r.length; i++) { s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0; r[i] = ((s ^ (s >>> 13)) >>> 0) / 2 ** 32; }
  return (hunchRank[level] = r);
}

// Per-level constants (line → cells) so the hot path never allocates them.
const lineCells: number[][][] = [];
const cellsOf = (level: number, line: number) => {
  const p = LEVELS[level].puzzle;
  const t = (lineCells[level] ??= Array.from({ length: lineCount(p) }, (_, l) => lineIndices(p.w, p.h, l)));
  return t[line];
};

// ── line looks (cached: a look is a pure function of the line's clue and current masks) ──
const lookCache = new Map<string, number[] | null>();
function look(level: number, arr: number[], line: number): number[] | null {
  const p = LEVELS[level].puzzle;
  const idx = cellsOf(level, line);
  let key = `${level}:${line}:`;
  let open = false;
  for (const i of idx) { const m = arr[i]; key += String.fromCharCode(48 + m); if (m & (m - 1)) open = true; }
  if (!open) return null;
  const hit = lookCache.get(key);
  if (hit !== undefined) return hit;
  let res: number[] | null = null;
  const clue = clueOf(p, line);
  if (!clue.smudged) {
    const cur = idx.map((i) => arr[i]);
    const nx = clueSolve(clue, cur, p.palette.length);
    if (nx && nx.some((v, k) => v !== cur[k])) res = nx;
  }
  lookCache.set(key, res);
  return res;
}

interface Info { arr: number[]; open: number[]; prod: Map<number, number[]>; child?: NonoState }
const infos = new WeakMap<NonoState, Info>();
const encode = (arr: number[]) => String.fromCharCode(...arr.map((m) => 48 + m));

function infoOf(s: NonoState): Info {
  let inf = infos.get(s);
  if (inf) return inf;
  const arr = [...s.masks].map((ch) => ch.charCodeAt(0) - 48);
  const p = LEVELS[s.level].puzzle;
  const prod = new Map<number, number[]>();
  const open: number[] = [];
  for (let l = 0; l < lineCount(p); l++) {
    if (clueOf(p, l).smudged || !cellsOf(s.level, l).some((i) => !isKnown(arr[i]))) continue;
    open.push(l);
    const r = look(s.level, arr, l);
    if (r) prod.set(l, r);
  }
  inf = { arr, open, prod };
  infos.set(s, inf);
  return inf;
}

const knownCount = (m: number[]) => m.reduce((a, v) => a + (isKnown(v) ? 1 : 0), 0);
const sigCache: string[] = [];

export function startState(level: number): NonoState {
  const arr = startMasks(LEVELS[level].puzzle);
  sigCache[level] ??= fnv(clueSignature(LEVELS[level].puzzle));
  return { level, puzzle: sigCache[level], masks: encode(arr), known: knownCount(arr), slips: 0, moves: 0 };
}

export function statusOf(s: NonoState): Status {
  if (s.slips > 0) return "lost";
  return s.known === s.masks.length ? "won" : "playing";
}

/**
 * Moves: look at any unfinished line (0..L-1); plus, for a dead-end line (one that yields nothing
 * right now) on a tempting board, a hasty ink on it (L + line) — the hunch that breaks a first try.
 */
export function movesOf(s: NonoState): number[] {
  if (statusOf(s) !== "playing") return [];
  const inf = infoOf(s);
  const L = lineCount(LEVELS[s.level].puzzle);
  const out = inf.open.slice();
  const th = thresholdOf(s.level);
  if (th > 0) {
    const rk = rankOf(s.level);
    // A hunch needs something to hang on: players guess on a stuck line that already holds their own marks, not
    // on a fresh one (stamps and the canvas edge are part of the printed puzzle) — so the start board never offers
    // a fatal first move, and guesses come mid-solve, where they do.
    const p = LEVELS[s.level].puzzle;
    for (const l of inf.open) {
      if (inf.prod.has(l) || rk[l] >= th) continue;
      if (cellsOf(s.level, l).some((i) => !p.void[i] && !p.given[i] && isKnown(inf.arr[i]))) out.push(L + l);
    }
  }
  const d = readabilityOf(s.level);
  if (d > 0 && out.length > inf.open.length) for (let k = 0; k < d; k++) for (const l of inf.prod.keys()) out.push(l);
  return out;
}

/**
 * A look that yields advances the board by the richest deduction available (which line a player
 * happens to spot first doesn't change what the board teaches); a look that yields nothing changes
 * nothing; a hunch ends the first try.
 */
export function applyMove(s: NonoState, m: number): NonoState {
  const p = LEVELS[s.level].puzzle;
  const L = lineCount(p);
  if (m >= L) return { ...s, slips: s.slips + 1, moves: s.moves + 1 };
  const inf = infoOf(s);
  if (!inf.prod.has(m)) return { ...s, moves: s.moves + 1 };
  if (inf.child) {
    const again = { ...inf.child, moves: s.moves + 1 };
    infos.set(again, infos.get(inf.child)!);
    return again;
  }
  let best = -1, bestGain = -1;
  for (const [l, res] of inf.prod) {
    const idx = cellsOf(s.level, l);
    let gain = 0;
    for (let k = 0; k < idx.length; k++) if (!isKnown(inf.arr[idx[k]]) && isKnown(res[k])) gain++;
    if (gain > bestGain || (gain === bestGain && l < best)) { best = l; bestGain = gain; }
  }
  const res = inf.prod.get(best)!;
  const arr = inf.arr.slice();
  const idx = cellsOf(s.level, best);
  const touched = new Set<number>([best]);
  for (let k = 0; k < idx.length; k++) {
    const i = idx[k];
    if (arr[i] === res[k]) continue;
    arr[i] = res[k];
    touched.add(Math.floor(i / p.w));
    touched.add(p.h + (i % p.w));
  }
  const child: NonoState = { ...s, masks: encode(arr), known: s.known + bestGain, moves: s.moves + 1 };
  const prod = new Map(inf.prod);
  for (const l of touched) { const r = look(s.level, arr, l); if (r) prod.set(l, r); else prod.delete(l); }
  const open = inf.open.filter((l) => cellsOf(s.level, l).some((i) => !isKnown(arr[i])));
  infos.set(child, { arr, open, prod });
  inf.child = child;
  return child;
}

function openBits(masks: string): number {
  let n = 0;
  for (let i = 0; i < masks.length; i++) { let m = masks.charCodeAt(i) - 48; while (m) { n += m & 1; m >>= 1; } }
  return n;
}

export const sim: Sim<NonoState, number> = {
  levelCount: LEVELS.length,
  start: startState,
  moves: movesOf,
  apply: applyMove,
  status: statusOf,
  // Decided cells; a vanishing tie-break (≤ 1e-9, far below the bots' 1e-6 jitter) for colour looks that narrow a
  // cell's options without deciding it — a greedy solver then never stalls on a 3-colour board (validate).
  progress: (s) => (s.slips ? -1 : s.known / s.masks.length - 1e-12 * openBits(s.masks)),
  describe: describeLevel,
};

// ── the designer's view ──

/** "r6" → "row 7", "c0" → "column 1", "r4.1" → "row 5 #2" — the 1-based names the player (and every aha) uses. */
const lineLabel = (t: string) => `${t[0] === "r" ? "row" : "column"} ${Number(t.slice(1).split(".")[0]) + 1}`;
export function twistLabel(smudge?: string[], crack?: string[], tally?: string[]): string {
  return [
    tally?.length ? `tally ${tally.map(lineLabel).join(", ")}` : "",
    smudge?.length ? `smudged ${smudge.map(lineLabel).join(", ")}` : "",
    crack?.length ? `cracked ${crack.map((c) => `${lineLabel(c)} #${Number(c.split(".")[1]) + 1}`).join(", ")}` : "",
  ].filter(Boolean).join("; ");
}

export function describeLevel(index: number): LevelBrief {
  const L = LEVELS[index];
  const p = L.puzzle, spec = L.spec;
  const K = p.palette.length;
  const pic = spec.art.split("\n").map((l) => l.trim()).filter(Boolean);
  const r = logicSolve(p);
  const isl = ISLANDS[L.island];
  const twists = twistLabel(spec.smudge, spec.crack, spec.tally);
  return {
    grid: pic.join("\n"),
    legend: "Solution picture; start is blank but stamps/voids. .=paper #=ink a-f=colours UPPER/@=stamp ,=stamped paper ~=void. Twists 1-based; a tally line shows only how many cells of each colour it holds (no runs, no order). Unique by line logic. solver=looks/passes/lines open.",
    intent:
      `${isl.name} ${L.slot}/12 ${L.role}${L.masterwork ? " (Masterwork)" : ""}, "${spec.title}" ${p.w}x${p.h}${K > 1 ? ` ${K} colours` : ""}${twists ? ` [${twists}]` : ""}: ` +
      `${spec.aha} (solver ${r.steps} looks/${r.passes} passes/${r.firstOpen} lines open)`,
    mechanics: spec.mechanics,
  };
}

/** Decoded solution value of a cell in a sim state (for tests). */
export const cellValue = (s: NonoState, i: number) => {
  const m = s.masks.charCodeAt(i) - 48;
  return isKnown(m) ? maskValue(m) : -1;
};
