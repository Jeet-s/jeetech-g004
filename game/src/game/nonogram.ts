/**
 * Nonogram Atelier — the game engine (pure TypeScript, no UI).
 *
 * A puzzle is a picture (w × h cells, 0 = paper, 1..K = palette colour). Every row and column
 * shows its clue: the runs of colour in order. Same-colour runs need at least one blank cell
 * between them; runs of different colours may touch. The player inks cells until the picture
 * matches; X and Dot are private marks that never count.
 *
 * Twists used by the campaign (all solver-aware, see lineSolve):
 *   stamps  — given cells pre-inked on the canvas (Mosaic Hall)
 *   voids   — cells outside a shaped canvas (Sculpture Hall); always paper, not playable
 *   smudged — a whole clue line is unreadable; that line is painted from its crossings (Lantern Gallery)
 *   cracked — one number of a clue is glazed over ("?"): its colour is known, its length is not (Kiln Room)
 *   tally   — a ringed clue counts each colour's cells in the line, not its runs: how many, never where or
 *             in how many pieces (Observatory Studio)
 *
 * The line solver works on candidate masks: bit 0 = paper, bit c = colour c. It computes, for one line,
 * every value each cell can still take over ALL placements of the clue — the full single-line logic.
 * Repeating it across rows and columns to a fixpoint proves a puzzle has one picture that falls out
 * by logic alone (no guessing); scripts/validate.ts runs that proof on every level.
 */

export interface Block { len: number; color: number; hidden?: boolean }
export interface LineClue {
  blocks: Block[];
  smudged?: boolean;
  /** Tally clue: only the number of cells of each colour is shown (tallyOf), not the runs. */
  tally?: boolean;
}

export interface Puzzle {
  id: string;
  title: string;
  w: number;
  h: number;
  /** Hex colours for 1..K (index 0 = colour 1). */
  palette: string[];
  /** Row-major solution, 0 = paper, 1..K colour. */
  solution: number[];
  /** Row-major: 1 = stamped (given) cell, revealed at start. */
  given: number[];
  /** Row-major: 1 = void (outside the canvas). */
  void: number[];
  rows: LineClue[];
  cols: LineClue[];
}

export interface PuzzleSpec {
  id: string;
  title: string;
  palette: string[];
  /** Picture rows. '.' paper, '#' or a..f colour 1..6, uppercase A..F / '@' = stamped colour, ',' stamped paper, '~' void. */
  art: string;
  /** Lines whose clue is smudged: "r3", "c0" (0-based). */
  smudge?: string[];
  /** Cracked clue numbers: "r4.1" = row 4, clue number #1 (0-based) shows "?". */
  crack?: string[];
  /** Tally lines: "r3", "c0" (0-based) show a ringed count per colour instead of their runs. */
  tally?: string[];
}

const COLOR_CH = "#abcdef";

export function parseArt(art: string): { w: number; h: number; solution: number[]; given: number[]; void: number[] } {
  const lines = art.split("\n").map((l) => l.trim()).filter((l) => l.length);
  const h = lines.length, w = lines[0].length;
  const solution: number[] = [], given: number[] = [], vd: number[] = [];
  for (const l of lines) {
    if (l.length !== w) throw new Error(`ragged art row "${l}" (${l.length} != ${w})`);
    for (const ch of l) {
      let v = 0, g = 0, o = 0;
      if (ch === "." ) v = 0;
      else if (ch === ",") g = 1;
      else if (ch === "~") o = 1;
      else if (ch === "#") v = 1;
      else if (ch === "@") { v = 1; g = 1; }
      else if ("abcdef".includes(ch)) v = "abcdef".indexOf(ch) + 1;
      else if ("ABCDEF".includes(ch)) { v = "ABCDEF".indexOf(ch) + 1; g = 1; }
      else throw new Error(`bad art char "${ch}"`);
      solution.push(v); given.push(g); vd.push(o);
    }
  }
  return { w, h, solution, given, void: vd };
}

/** Runs of colour along a line of solution values. */
export function runsOf(line: number[]): Block[] {
  const out: Block[] = [];
  let i = 0;
  while (i < line.length) {
    const c = line[i];
    if (!c) { i++; continue; }
    let j = i;
    while (j < line.length && line[j] === c) j++;
    out.push({ len: j - i, color: c });
    i = j;
  }
  return out;
}

export function lineIndices(w: number, h: number, line: number): number[] {
  // lines 0..h-1 = rows, h..h+w-1 = columns
  if (line < h) return Array.from({ length: w }, (_, c) => line * w + c);
  const c = line - h;
  return Array.from({ length: h }, (_, r) => r * w + c);
}

export function buildPuzzle(spec: PuzzleSpec): Puzzle {
  const { w, h, solution, given, void: vd } = parseArt(spec.art);
  const K = Math.max(1, ...solution);
  if (spec.palette.length < K) throw new Error(`${spec.id}: palette has ${spec.palette.length} colours, art uses ${K}`);
  const rows: LineClue[] = [], cols: LineClue[] = [];
  for (let r = 0; r < h; r++) rows.push({ blocks: runsOf(solution.slice(r * w, r * w + w)) });
  for (let c = 0; c < w; c++) cols.push({ blocks: runsOf(Array.from({ length: h }, (_, r) => solution[r * w + c])) });
  for (const s of spec.smudge ?? []) {
    const k = Number(s.slice(1));
    (s[0] === "r" ? rows : cols)[k].smudged = true;
  }
  for (const s of spec.tally ?? []) {
    const k = Number(s.slice(1));
    (s[0] === "r" ? rows : cols)[k].tally = true;
  }
  for (const s of spec.crack ?? []) {
    const [ln, bi] = s.split(".");
    const k = Number(ln.slice(1));
    const clue = (ln[0] === "r" ? rows : cols)[k];
    clue.blocks[Number(bi)].hidden = true;
  }
  return { id: spec.id, title: spec.title, w, h, palette: spec.palette.slice(0, K), solution, given, void: vd, rows, cols };
}

export const colorsOf = (p: Puzzle) => p.palette.length;
export const lineCount = (p: Puzzle) => p.w + p.h;
export const clueOf = (p: Puzzle, line: number): LineClue => (line < p.h ? p.rows[line] : p.cols[line - p.h]);
export const lineName = (p: Puzzle, line: number) => (line < p.h ? `row ${line + 1}` : `column ${line - p.h + 1}`);

// ───────────────────────────── line solver ─────────────────────────────

/** A tally clue's counts: [colour, cells] in palette order, colours with no cells left out. */
export function tallyOf(blocks: Block[]): { color: number; count: number }[] {
  const m = new Map<number, number>();
  for (const b of blocks) m.set(b.color, (m.get(b.color) ?? 0) + b.len);
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([color, count]) => ({ color, count }));
}

/**
 * Tally logic: each value v (paper or a colour) must fill exactly its count of the line. When the cells already
 * certain to be v reach that count, v leaves every other cell; when only that many cells can still be v, they all are.
 */
export function tallySolve(blocks: Block[], cells: number[], K: number): number[] | null {
  const n = cells.length;
  const need = new Array<number>(K + 1).fill(0);
  for (const b of blocks) need[b.color] += b.len;
  need[0] = n - need.slice(1).reduce((a, b) => a + b, 0);
  if (need[0] < 0) return null;
  const out = cells.slice();
  for (let guard = 0; guard < 4 * (K + 1); guard++) {
    let changed = false;
    for (let v = 0; v <= K; v++) {
      const bit = 1 << v;
      let sure = 0, can = 0;
      for (const m of out) { if (m & bit) { can++; if (m === bit) sure++; } }
      if (sure > need[v] || can < need[v]) return null;
      for (let p = 0; p < n; p++) {
        if (!(out[p] & bit)) continue;
        if (sure === need[v] && out[p] !== bit) { out[p] &= ~bit; changed = true; }
        else if (can === need[v] && out[p] !== bit) { out[p] = bit; changed = true; }
      }
      for (const m of out) if (!m) return null;
    }
    if (!changed) break;
  }
  return out;
}

/** Full single-line logic for any clue (runs, cracked runs or a tally). */
export const clueSolve = (clue: LineClue, cells: number[], K: number) =>
  clue.tally ? tallySolve(clue.blocks, cells, K) : lineSolve(clue.blocks, cells, K);

/**
 * Full single-line logic. `cells` are candidate masks (bit 0 paper, bit c colour c).
 * Returns the narrowed masks, or null when no placement of the clue fits (contradiction).
 */
export function lineSolve(blocks: Block[], cells: number[], K: number): number[] | null {
  const n = cells.length, B = blocks.length;
  // bad[c][p] = # cells in [0,p) that cannot be colour c
  const bad: Int32Array[] = [];
  for (let c = 1; c <= K; c++) {
    const a = new Int32Array(n + 1);
    for (let p = 0; p < n; p++) a[p + 1] = a[p] + ((cells[p] >> c) & 1 ? 0 : 1);
    bad[c] = a;
  }
  const fits = (j: number, p: number, L: number) => p + L <= n && bad[blocks[j].color][p + L] - bad[blocks[j].color][p] === 0;
  const lens = (j: number) => (blocks[j].hidden ? null : blocks[j].len);
  const sameAsPrev = (j: number) => j > 0 && blocks[j - 1].color === blocks[j].color;
  // state index: (j * (n+1) + p) * 2 + flag   (flag 1 = cell p-1 ended block j-1)
  const S = (B + 1) * (n + 1) * 2;
  const G = new Uint8Array(S); // can finish from state
  const idx = (j: number, p: number, f: number) => (j * (n + 1) + p) * 2 + f;
  for (let p = n; p >= 0; p--) {
    for (let j = B; j >= 0; j--) {
      for (let f = 0; f < 2; f++) {
        let ok = 0;
        if (p === n) ok = j === B ? 1 : 0;
        else {
          if (cells[p] & 1 && G[idx(j, p + 1, 0)]) ok = 1;
          if (!ok && j < B && !(f && sameAsPrev(j))) {
            const L0 = lens(j);
            if (L0 !== null) { if (fits(j, p, L0) && G[idx(j + 1, p + L0, 1)]) ok = 1; }
            else for (let L = 1; p + L <= n && !ok; L++) { if (!fits(j, p, L)) break; if (G[idx(j + 1, p + L, 1)]) ok = 1; }
          }
        }
        G[idx(j, p, f)] = ok;
      }
    }
  }
  if (!G[idx(0, 0, 0)]) return null;
  const F = new Uint8Array(S);
  F[idx(0, 0, 0)] = 1;
  const poss = new Int32Array(n);
  const diff: Int32Array[] = [];
  for (let c = 1; c <= K; c++) diff[c] = new Int32Array(n + 1);
  for (let p = 0; p < n; p++) {
    for (let j = 0; j <= B; j++) {
      for (let f = 0; f < 2; f++) {
        if (!F[idx(j, p, f)]) continue;
        if (cells[p] & 1 && G[idx(j, p + 1, 0)]) { poss[p] |= 1; F[idx(j, p + 1, 0)] = 1; }
        if (j < B && !(f && sameAsPrev(j))) {
          const c = blocks[j].color;
          const L0 = lens(j);
          const tryL = (L: number) => {
            if (G[idx(j + 1, p + L, 1)]) { diff[c][p]++; diff[c][p + L]--; F[idx(j + 1, p + L, 1)] = 1; }
          };
          if (L0 !== null) { if (fits(j, p, L0)) tryL(L0); }
          else for (let L = 1; p + L <= n; L++) { if (!fits(j, p, L)) break; tryL(L); }
        }
      }
    }
  }
  const out = new Array<number>(n);
  for (let c = 1; c <= K; c++) {
    let run = 0;
    for (let p = 0; p < n; p++) { run += diff[c][p]; if (run > 0) poss[p] |= 1 << c; }
  }
  for (let p = 0; p < n; p++) {
    out[p] = cells[p] & poss[p];
    if (!out[p]) return null;
  }
  return out;
}

export const fullMask = (K: number) => (1 << (K + 1)) - 1;
export const isKnown = (m: number) => (m & (m - 1)) === 0;
export const maskValue = (m: number) => 31 - Math.clz32(m); // for single-bit masks: 0 paper, c colour

/** Candidate masks at the start of a level: stamps and voids are already known. */
export function startMasks(p: Puzzle): number[] {
  const full = fullMask(colorsOf(p));
  return p.solution.map((v, i) => (p.void[i] ? 1 : p.given[i] ? 1 << v : full));
}

/** One line step on masks: returns the narrowed copy of the whole grid, or the same array if nothing changed, or null. */
export function applyLine(p: Puzzle, masks: number[], line: number): number[] | null {
  const clue = clueOf(p, line);
  if (clue.smudged) return masks;
  const idx = lineIndices(p.w, p.h, line);
  const cur = idx.map((i) => masks[i]);
  const res = clueSolve(clue, cur, colorsOf(p));
  if (!res) return null;
  let changed = false;
  for (let k = 0; k < idx.length; k++) if (res[k] !== cur[k]) { changed = true; break; }
  if (!changed) return masks;
  const next = masks.slice();
  for (let k = 0; k < idx.length; k++) next[idx[k]] = res[k];
  return next;
}

export const lineOpen = (p: Puzzle, masks: number[], line: number) => lineIndices(p.w, p.h, line).some((i) => !isKnown(masks[i]));

export interface LogicReport {
  solved: boolean;
  unique: boolean; // solved to exactly the stored picture
  contradiction: boolean;
  unknown: number; // cells left undetermined when stuck
  steps: number; // productive line steps taken by a best-first solver
  passes: number; // rounds of "look at every line once" needed (logic depth)
  search: number; // Σ open/productive lines per step — expected looks to find each deduction
  minProductive: number; // tightest bottleneck: fewest productive lines at any step
  firstOpen: number; // productive lines at the very start
  masks: number[];
}

/**
 * Solve by line logic only. Best-first: each step applies the line that settles the most cells
 * (what a strong human does), and records how scarce productive lines were — a puzzle where only
 * one line in thirty moves forward is much harder to read than one where every line gives.
 */
export function logicSolve(p: Puzzle, from?: number[]): LogicReport {
  let masks = from ?? startMasks(p);
  const L = lineCount(p);
  let steps = 0, search = 0, minProductive = Infinity, firstOpen = -1;
  for (;;) {
    let open = 0, productive = 0, best = -1, bestGain = 0, bestMasks: number[] | null = null;
    for (let l = 0; l < L; l++) {
      if (!lineOpen(p, masks, l)) continue;
      if (clueOf(p, l).smudged) continue;
      open++;
      const nx = applyLine(p, masks, l);
      if (nx === null) return report(p, masks, steps, search, minProductive, firstOpen, true);
      if (nx === masks) continue;
      productive++;
      let gain = 0;
      for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== masks[i] && isKnown(nx[i])) gain++;
      if (gain > bestGain || best < 0) { best = l; bestGain = gain; bestMasks = nx; }
    }
    if (firstOpen < 0) firstOpen = productive;
    if (!productive || !bestMasks) break;
    steps++;
    search += open / productive;
    minProductive = Math.min(minProductive, productive);
    masks = bestMasks;
  }
  return report(p, masks, steps, search, minProductive, firstOpen, false);
}

function report(p: Puzzle, masks: number[], steps: number, search: number, minProductive: number, firstOpen: number, contradiction: boolean): LogicReport {
  const unknown = masks.filter((m) => !isKnown(m)).length;
  const solved = !contradiction && unknown === 0;
  const unique = solved && masks.every((m, i) => maskValue(m) === p.solution[i]);
  return { solved, unique, contradiction, unknown, steps, passes: countPasses(p), search, minProductive: Number.isFinite(minProductive) ? minProductive : 0, firstOpen, masks };
}

/** Parallel rounds: every line looks at the grid as it stood at the start of the round. */
export function countPasses(p: Puzzle): number {
  let masks = startMasks(p);
  const L = lineCount(p);
  for (let pass = 0; pass < 400; pass++) {
    const base = masks;
    let next = masks.slice(), changed = false;
    for (let l = 0; l < L; l++) {
      const nx = applyLine(p, base, l);
      if (!nx || nx === base) continue;
      for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; changed = true; }
    }
    if (!changed) return pass;
    masks = next;
  }
  return 400;
}

// ───────────────────────────── play state (what the screen drives) ─────────────────────────────

/** Player marks per cell: 0 blank, >0 inked colour, X = -1, DOT = -2. */
export const BLANK = 0, X = -1, DOT = -2;
export type Tool = "fill" | "x" | "dot";

export interface Change { i: number; from: number; to: number }
export interface PlayState {
  cells: number[];
  undo: Change[][];
  redo: Change[][];
  hints: number;
  /** Ink placed on a cell the picture leaves blank (or the wrong colour) — counted, never punished unless strikes mode. */
  slips: number;
  strikes: number;
  moves: number;
}

export interface PlayOptions { autoX: boolean; strikes: boolean }
export const DEFAULT_OPTIONS: PlayOptions = { autoX: true, strikes: false };

export function newPlay(p: Puzzle): PlayState {
  return {
    cells: p.solution.map((v, i) => (p.void[i] ? X : p.given[i] ? (v > 0 ? v : X) : BLANK)),
    undo: [], redo: [], hints: 0, slips: 0, strikes: 0, moves: 0,
  };
}

export const locked = (p: Puzzle, i: number) => !!(p.void[i] || p.given[i]);

/** Strikes mode allows more mistakes on bigger boards (players asked for lives that scale with size). */
export const strikeLimit = (p: Puzzle) => 3 + Math.floor(Math.max(p.w, p.h) / 10);

/** The value a tap (or the first cell of a drag) writes with the active tool. Tapping the same mark again clears it. */
export function toolValue(cur: number, tool: Tool, color: number): number {
  const want = tool === "fill" ? color : tool === "x" ? X : DOT;
  return cur === want ? BLANK : want;
}

export interface PaintResult { state: PlayState; changed: number[]; rejected: number[]; completedLines: number[] }

/**
 * Paint `value` on cells (one tap = one cell; a drag = the run of cells along one row/column).
 * One undo step. Auto-X then crosses out the rest of every line whose ink now matches its clue.
 * Strikes mode (off by default): ink on a wrong cell is refused, crossed out and costs a strike.
 */
export function paint(p: Puzzle, s: PlayState, cells: number[], value: number, opt: PlayOptions = DEFAULT_OPTIONS): PaintResult {
  const cur = s.cells.slice();
  const changes: Change[] = [];
  const rejected: number[] = [];
  let slips = s.slips, strikes = s.strikes;
  for (const i of cells) {
    if (locked(p, i) || cur[i] === value) continue;
    // A drag never overwrites the other kind of mark (keeps X's safe while sweeping ink), except erasing.
    if (cells.length > 1 && value !== BLANK && cur[i] !== BLANK && cur[i] !== DOT) continue;
    let to = value;
    if (value > 0 && p.solution[i] !== value) {
      slips++;
      if (opt.strikes) { strikes++; rejected.push(i); to = p.solution[i] > 0 ? cur[i] : X; if (to === cur[i]) continue; }
    }
    changes.push({ i, from: cur[i], to });
    cur[i] = to;
  }
  const touched = new Set<number>();
  for (const c of changes) { touched.add(Math.floor(c.i / p.w)); touched.add(p.h + (c.i % p.w)); }
  const completedLines: number[] = [];
  for (const l of touched) {
    if (!lineSatisfied(p, cur, l)) continue;
    completedLines.push(l);
    if (!opt.autoX) continue;
    for (const i of lineIndices(p.w, p.h, l)) {
      if (cur[i] === BLANK || cur[i] === DOT) { changes.push({ i, from: cur[i], to: X }); cur[i] = X; }
    }
  }
  if (!changes.length) return { state: { ...s, slips, strikes }, changed: [], rejected, completedLines: [] };
  return {
    state: { ...s, cells: cur, undo: [...s.undo, changes], redo: [], slips, strikes, moves: s.moves + 1 },
    changed: changes.map((c) => c.i),
    rejected,
    completedLines,
  };
}

export function undo(s: PlayState): PlayState {
  const step = s.undo[s.undo.length - 1];
  if (!step) return s;
  const cells = s.cells.slice();
  for (let k = step.length - 1; k >= 0; k--) cells[step[k].i] = step[k].from;
  return { ...s, cells, undo: s.undo.slice(0, -1), redo: [...s.redo, step], moves: s.moves + 1 };
}

export function redo(s: PlayState): PlayState {
  const step = s.redo[s.redo.length - 1];
  if (!step) return s;
  const cells = s.cells.slice();
  for (const c of step) cells[c.i] = c.to;
  return { ...s, cells, redo: s.redo.slice(0, -1), undo: [...s.undo, step], moves: s.moves + 1 };
}

/** Runs of ink in a line of player marks (X / dot / blank all count as gaps). */
function inkRuns(vals: number[]): Block[] {
  return runsOf(vals.map((v) => (v > 0 ? v : 0)));
}

export function lineSatisfied(p: Puzzle, cells: number[], line: number): boolean {
  const vals = lineIndices(p.w, p.h, line).map((i) => cells[i]);
  const runs = inkRuns(vals);
  const clue = clueOf(p, line);
  if (clue.smudged) {
    // A smudged line is done when it matches the picture (its crossings decide it).
    return lineIndices(p.w, p.h, line).every((i) => (cells[i] > 0 ? cells[i] : 0) === p.solution[i]);
  }
  const b = clue.blocks;
  if (clue.tally) {
    // A tally is done when each colour's count is met — where the runs sit is the crossings' business.
    const have = tallyOf(runs), want = tallyOf(b);
    return have.length === want.length && have.every((t, k) => t.color === want[k].color && t.count === want[k].count);
  }
  // A cracked number hides its length from the player, not from the line: only the picture's own run length
  // completes it (otherwise auto-X would cross out cells of a run the player hasn't finished).
  const truth = b.some((k) => k.hidden) ? runsOf(lineIndices(p.w, p.h, line).map((i) => p.solution[i])) : b;
  return runs.length === b.length && runs.every((r, k) => r.color === b[k].color && r.len === truth[k].len);
}

/**
 * Which clue numbers to grey out. A number is greyed only when it is certainly done: either the whole
 * line matches, or it is matched by a closed run counted in from an edge (bounded by X/edge on both sides).
 */
export function clueDone(p: Puzzle, cells: number[], line: number): boolean[] {
  const clue = clueOf(p, line);
  const b = clue.blocks;
  const done = b.map(() => false);
  if (clue.smudged) return done;
  if (lineSatisfied(p, cells, line)) return b.map(() => true);
  if (clue.tally) return done;
  const vals = lineIndices(p.w, p.h, line).map((i) => cells[i]);
  const scan = (order: number[], blocksOrder: number[]) => {
    let k = 0, pos = 0;
    while (pos < order.length && k < blocksOrder.length) {
      const v = vals[order[pos]];
      if (v === X) { pos++; continue; }
      if (v <= 0) return; // blank or dot: unknown territory
      let e = pos;
      while (e < order.length && vals[order[e]] === v) e++;
      const closed = e === order.length || vals[order[e]] === X || (vals[order[e]] > 0 && vals[order[e]] !== v);
      if (!closed) return;
      const blk = b[blocksOrder[k]];
      if (blk.color !== v || (!blk.hidden && blk.len !== e - pos)) return;
      done[blocksOrder[k]] = true;
      k++;
      pos = e;
    }
  };
  const fwd = vals.map((_, i) => i);
  scan(fwd, b.map((_, i) => i));
  scan(fwd.slice().reverse(), b.map((_, i) => i).reverse());
  return done;
}

export function isSolved(p: Puzzle, cells: number[]): boolean {
  for (let i = 0; i < cells.length; i++) {
    const ink = cells[i] > 0 ? cells[i] : 0;
    if (ink !== p.solution[i]) return false;
  }
  return true;
}

export const isLost = (p: Puzzle, s: PlayState, opt: PlayOptions) => opt.strikes && s.strikes >= strikeLimit(p);

/** Fraction of the picture's ink placed correctly (for progress rings / resume cards). */
export function inkProgress(p: Puzzle, cells: number[]): number {
  let need = 0, have = 0;
  for (let i = 0; i < cells.length; i++) if (p.solution[i] > 0 && !p.given[i]) { need++; if (cells[i] === p.solution[i]) have++; }
  return need ? have / need : 1;
}

// ───────────────────────────── hints (Hint Brush) ─────────────────────────────

/** Hint Brush on a line: paints the WHOLE chosen line correctly (ink + X), as one undo step. */
export function hintLine(p: Puzzle, s: PlayState, line: number, opt: PlayOptions = DEFAULT_OPTIONS): PaintResult {
  const idx = lineIndices(p.w, p.h, line).filter((i) => !locked(p, i));
  const cur = s.cells.slice();
  const changes: Change[] = [];
  for (const i of idx) {
    const to = p.solution[i] > 0 ? p.solution[i] : X;
    if (cur[i] !== to) { changes.push({ i, from: cur[i], to }); cur[i] = to; }
  }
  const completedLines: number[] = [];
  const touched = new Set<number>([line]);
  for (const c of changes) { touched.add(Math.floor(c.i / p.w)); touched.add(p.h + (c.i % p.w)); }
  for (const l of touched) {
    if (!lineSatisfied(p, cur, l)) continue;
    completedLines.push(l);
    if (!opt.autoX) continue;
    for (const i of lineIndices(p.w, p.h, l)) if (cur[i] === BLANK || cur[i] === DOT) { changes.push({ i, from: cur[i], to: X }); cur[i] = X; }
  }
  if (!changes.length) return { state: s, changed: [], rejected: [], completedLines: [] };
  return { state: { ...s, cells: cur, undo: [...s.undo, changes], redo: [], hints: s.hints + 1, moves: s.moves + 1 }, changed: changes.map((c) => c.i), rejected: [], completedLines };
}

/** Player's marks as solver masks — only marks that agree with the picture are trusted. */
function knowledge(p: Puzzle, cells: number[]): number[] {
  const full = fullMask(colorsOf(p));
  return cells.map((v, i) => {
    if (p.void[i] || p.given[i]) return 1 << p.solution[i];
    if (v > 0 && v === p.solution[i]) return 1 << v;
    if (v === X && p.solution[i] === 0) return 1;
    return full;
  });
}

export interface Advice { line: number; cells: number[]; text: string }

/**
 * The next deduction from the player's current (correct) marks, in plain words — used by the
 * hint picker ("explain") and by the QA replay to know the next real tap.
 */
export function nextDeduction(p: Puzzle, cells: number[]): Advice | null {
  let masks = knowledge(p, cells);
  // Colour lines often only NARROW a cell ("coral or teal, not paper") before any cell is certain. Marks can't
  // record that, so carry the narrowed candidates forward until some line settles a cell the player can paint.
  for (let round = 0; round < 64; round++) {
    let best: Advice | null = null, bestGain = 0, narrowed: number[] | null = null;
    for (let l = 0; l < lineCount(p); l++) {
      if (clueOf(p, l).smudged) continue;
      const nx = applyLine(p, masks, l);
      if (!nx || nx === masks) continue;
      const gained = lineIndices(p.w, p.h, l).filter((i) => nx[i] !== masks[i] && isKnown(nx[i]) && needsMark(p, cells, i));
      if (gained.length > bestGain) { bestGain = gained.length; best = { line: l, cells: gained, text: explain(p, cells, l, gained) }; }
      if (!gained.length) {
        const base: number[] = narrowed ?? masks.slice();
        for (const i of lineIndices(p.w, p.h, l)) base[i] &= nx[i];
        narrowed = base;
      }
    }
    if (best) {
      if (round > 0) best.text = `Reading the colours its crossing lines allow: ${best.text[0].toLowerCase()}${best.text.slice(1)}`;
      return best;
    }
    if (!narrowed) return null;
    masks = narrowed;
  }
  return null;
}

/** A cell still needs the player's attention if its mark doesn't match the picture (ink) or isn't crossed (paper). */
const needsMark = (p: Puzzle, cells: number[], i: number) =>
  p.solution[i] > 0 ? cells[i] !== p.solution[i] : cells[i] !== X;

function explain(p: Puzzle, cells: number[], line: number, gained: number[]): string {
  const clue = clueOf(p, line);
  const name = lineName(p, line);
  const idx = lineIndices(p.w, p.h, line);
  const n = idx.length;
  const blocks = clue.blocks;
  const sum = blocks.reduce((a, b) => a + b.len, 0);
  let gaps = 0;
  for (let k = 1; k < blocks.length; k++) if (blocks[k].color === blocks[k - 1].color) gaps++;
  const inks = gained.filter((i) => p.solution[i] > 0).length;
  const xs = gained.length - inks;
  const numbers = blocks.map((b) => (b.hidden ? "?" : String(b.len))).join(" ") || "0";
  if (clue.tally && blocks.length) {
    const t = tallyOf(blocks).map((x) => String(x.count)).join(" + ");
    if (lineSatisfied(p, cells, line)) return `${capital(name)}'s tally (${t}) is complete: every other cell is an X.`;
    return inks
      ? `${capital(name)}'s tally says ${t}, and only that many cells there can still take ink — all of them are inked.`
      : `${capital(name)}'s tally says ${t}, and that many are already certain — the rest of the line is paper.`;
  }
  if (!blocks.length) return `The clue of ${name} is 0: nothing is inked there, so every cell is an X.`;
  if (lineSatisfied(p, cells, line)) return `${capital(name)} already shows ${numbers}: every other cell is an X.`;
  if (!blocks.some((b) => b.hidden) && sum + gaps === n) return `${capital(name)}: ${numbers} plus the gaps between them fill all ${n} cells exactly, so the whole line is decided.`;
  const known = idx.filter((i) => !needsMark(p, cells, i)).length;
  if (known === 0 && inks > 0 && blocks.length === 1) {
    const b = blocks[0].len;
    return `${capital(name)} holds one run of ${b} in ${n} cells. Slide it fully left and fully right: the ${inks} cell${inks > 1 ? "s" : ""} both positions cover must be inked.`;
  }
  if (known === 0 && inks > 0) return `${capital(name)} needs ${numbers} with only ${n - sum - gaps} spare cell${n - sum - gaps === 1 ? "" : "s"}. Every way to place the runs covers the same ${inks} cell${inks > 1 ? "s" : ""}.`;
  if (xs && !inks) return `In ${name}, no run of ${numbers} can reach ${xs === 1 ? "this cell" : `these ${xs} cells`} given the marks already there — cross ${xs === 1 ? "it" : "them"} out.`;
  return `Your marks in ${name} pin down where ${numbers} can sit: ${inks ? `${inks} more cell${inks > 1 ? "s are" : " is"} certainly inked` : ""}${inks && xs ? " and " : ""}${xs ? `${xs} cell${xs > 1 ? "s are" : " is"} certainly empty` : ""}.`;
}

const capital = (s: string) => s[0].toUpperCase() + s.slice(1);

// ───────────────────────────── scoring ─────────────────────────────

export interface Result { hints: number; slips: number; seconds: number }

/** ★ solved · ★ no Hint Brush · ★ steady hand (no ink on a wrong cell). Speed only adds Pigments, never stars. */
export function starsFor(r: Result): number {
  return 1 + (r.hints === 0 ? 1 : 0) + (r.slips === 0 ? 1 : 0);
}

/** Par time in seconds for the speed bonus (never required). */
export const parSeconds = (p: Puzzle) => Math.round(20 + p.w * p.h * 0.9 * (1 + 0.25 * (colorsOf(p) - 1)));

export function pigmentsFor(p: Puzzle, r: Result, masterwork: boolean): { base: number; noHint: number; speed: number; total: number } {
  const base = Math.round(10 + (p.w * p.h) / 6 + 5 * (colorsOf(p) - 1)) * (masterwork ? 2 : 1);
  const noHint = r.hints === 0 ? Math.round(base * 0.25) : 0;
  const speed = r.seconds > 0 && r.seconds <= parSeconds(p) ? Math.round(base * 0.1) : 0;
  return { base, noHint, speed, total: base + noHint + speed };
}
