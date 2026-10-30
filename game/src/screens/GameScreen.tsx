import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, { Easing, FadeInUp, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Background, Confetti, CurrencyPill, FailPopup, useShake, GameButton, IconButton, Icon, MiniStars, MinaAvatar, MinaSays, PictureThumb, Popup, Toggle, TutorialHand, WinPopup, feedback, fonts, haptic, palette, play, softShadow, springs } from "../ui";
import { Toast } from "../fx/Toast";
import { ComboBanner, COMBO_BANNER_MS, CALLOUT_LANE } from "../fx/ComboBanner";
import { qaNextRun } from "../game/qaRun";
import { Board, framedSize, lightColor, REVEAL_MS, type BoardHandle, type StrokePhase } from "./Board";
import { ISLANDS, LEVELS, MECHANICS } from "../game/levels";
import {
  clueOf, DOT, hintLine, tallyOf, isLost, isSolved, lineIndices, lineName, lineSatisfied, locked, newPlay, BLANK, nextDeduction, paint, redo as redoState, strikeLimit, toolValue, undo as undoState, X,
  type Advice, type PlayState, type Puzzle, type Tool,
} from "../game/nonogram";
import { INK } from "../game/types";
import {
  BRUSH_PACKS, addBrushes, boardSkinOf, buyBrushes, completePuzzle, loadSave, playInfo, setOpt, spendBrush, starsOf, usePlayer, writeSave, optsOf,
  type PlayTarget, type Reward,
} from "../game/meta";
import { store } from "../modules/store";
import { ads } from "../modules/ads";
import { analytics } from "../modules/analytics";
import { notify } from "../modules/notify";
import { qa, reportNext } from "../modules/qa";
import { useBannerHeight } from "../modules/layout";
import { art } from "../art";

/** Screenshot mode: pre-paint part of the picture, or show the finished win card. */
export interface Demo { fill?: number; win?: boolean; zoom?: boolean; tool?: Tool; xs?: boolean; pick?: boolean }

/**
 * Step-by-step first-run tutorial (levels 1-3). Each step names one line (or one cell) — Mina's text, a pointing
 * hand and a pulsing ring sit on exactly that target, and the step advances when the board satisfies it:
 *  - `line`: every ink cell of that line is inked correctly;  - `cell` + want "x": that cell is crossed out;
 *  - no target: "until" the player's next move (intro notes) or the win (the closing step).
 * `tool` = the tool the step needs (the hand points at the tool tray first when another tool is active).
 */
interface TutStep { text: string; /** a clue to point at (intro notes) */ clue?: number; line?: number; cell?: number; want?: "ink" | "x"; drag?: boolean; tool?: Tool; until?: "move" | "win"; /** only this run (0-based) of the line */ run?: number }
const TUTORIAL: Record<number, { id: string; fallback: string; steps: (p: Puzzle) => TutStep[] }> = {
  // Teacup (8×6): row 6 is an 8 (saucer); columns 3 and 5 are 6s (steam through cup); column 1's 1 is then done, so its ✕s leave row 3's 5 1 exactly 7 cells.
  1: { id: "teacup", fallback: "Welcome to the atelier! Each number is a run of inked cells in its row or column — drag or tap to ink.", steps: (p) => [
    { line: 5, drag: true, tool: "fill", text: "Each number counts the inked cells in its line. Row 6 says 8 and is 8 wide — all of it is ink. Drag across it (or tap each cell)." },
    { line: p.h + 2, drag: true, tool: "fill", text: "Columns read top to bottom. Column 3 says 6 and is 6 tall — drag down all of it." },
    { line: p.h + 4, drag: true, tool: "fill", text: "Column 5 says 6 too — drag down it. That's the steam rising out of the cup." },
    { line: 2, run: 0, drag: true, tool: "fill", text: "Column 1's 1 is done, so auto-✕ crossed out the rest. Row 3's 5 1 needs 5+1+1 = 7 cells — exactly what's left. Drag the 5 first." },
    { line: 2, run: 1, tool: "fill", text: "One paper gap after the 5, then the 1 — it can only be the last cell of row 3. Tap it." },
    { until: "win", text: "Now finish the teacup: rows 2 and 4 are 6s, and the columns place the handle. Made a slip? Undo is always free." },
  ] },
  // Little Sailboat (8×7): row 4's 4 3 is the only exact fit; column 5's 3 3 is the mast; auto-✕ of columns 1/8 leaves row 6's 6 exact; column 7's 2 1 forces an ✕ under the deck; row 7's 4 is then exact.
  2: { id: "little-sailboat", fallback: "Cells that must stay paper get an ✕. Switch the tool to ✕, or let auto-✕ cross out a line once its runs are all inked.", steps: (p) => [
    { line: 3, drag: true, tool: "fill", text: "Row 4 reads 4 3: 4+1+3 = 8, exactly the width — it fits one way only. Drag across both runs." },
    { line: p.h + 4, drag: true, tool: "fill", text: "Column 5 reads 3 3: 3+1+3 = 7, the full height. Drag down the mast — its gap is row 4." },
    { line: 5, drag: true, tool: "fill", text: "Columns 1 and 8 say 1, and row 4 holds it — auto-✕ crossed them out. Row 6's 6 has exactly six cells left: the deck." },
    { cell: 6 * p.w + 6, want: "x", tool: "x", text: "Column 7 reads 2 1: the 2 is rows 3-4, the 1 is row 6 — so its bottom cell is paper. Pick ✕ and cross it out." },
    { line: 6, drag: true, tool: "fill", text: "Back to Fill. Row 7's 4 now has exactly four cells between the ✕s: drag the hull." },
    { until: "win", tool: "fill", text: "Finish the sails: rows 2 and 3 grow out from the mast. Undo is always free." },
  ] },
  // Jellyfish (7×7, no full line): row 4's 5 in 7 always covers columns 3-5 and columns 2/6 (4 in 7) always cover row 4 → row 4 = columns 2-6 (drag); column 4's 2 3 must start its 3 at row 4 → rows 4-6, 2 = rows 1-2 (drag); row 5's 1 1 1 holds column 4, so column 3's 4 stops at row 4 → rows 1-4 (drag).
  3: { id: "jellyfish", fallback: "Hold and drag to paint a whole run in one stroke — the teal counter shows how many cells. Undo is always free.", steps: (p) => [
    { line: 3, drag: true, tool: "fill", text: "No full line now. Row 4's 5 in 7 can slide, but columns 3-5 are inked wherever it sits — and columns 2 and 6 (4 in 7) always cover row 4. That's the whole 5: drag columns 2-6." },
    { line: p.h + 3, drag: true, tool: "fill", text: "Column 4 reads 2 3. If row 4 were the 2, the 3 below it would run off the board — so the 3 is rows 4-6, and the 2 sits above the spot: rows 1-2. Drag both runs." },
    { line: p.h + 2, drag: true, tool: "fill", text: "Row 5's 1 1 1 holds column 4, so the cells beside it are paper. Column 3's 4 must stop at row 4: it is rows 1-4. Drag it; the counter shows 4." },
    { until: "win", text: "Finish the jellyfish: rows 1-2 round off the bell, and the three tentacles trail down rows 5-7. Undo is always free." },
  ] },
};

/** The cells of solution run `k` of a line (in line order). */
function runCells(p: Puzzle, line: number, k: number): number[] {
  const idx = lineIndices(p.w, p.h, line);
  const runs: number[][] = [];
  idx.forEach((i, j) => {
    if (p.solution[i] <= 0) return;
    if (j > 0 && p.solution[idx[j - 1]] === p.solution[i] && runs.length) runs[runs.length - 1].push(i); else runs.push([i]);
  });
  return runs[k] ?? [];
}

/** The ink cells a step asks for: its run, or every ink cell of its line. */
function stepInk(p: Puzzle, st: TutStep): number[] {
  if (st.line == null) return [];
  return st.run != null ? runCells(p, st.line, st.run) : lineIndices(p.w, p.h, st.line).filter((i) => p.solution[i] > 0);
}

/** Has the board satisfied this tutorial step? (Derived from the real play state only.) */
function stepDone(p: Puzzle, st: TutStep, cells: number[], moves: number): boolean {
  if (st.want === "x" && st.cell != null) return cells[st.cell] === X;
  if (st.line != null) return stepInk(p, st).every((i) => cells[i] === p.solution[i]);
  if (st.until === "move") return moves > 0;
  return false;
}

/** The cells a tutorial step points at: the next missing run of its line (drag steps) / missing ink / its X cell. */
function stepCells(p: Puzzle, st: TutStep, cells: number[]): number[] {
  if (st.want === "x" && st.cell != null) return cells[st.cell] === X ? [] : [st.cell];
  if (st.line == null) return [];
  if (st.run != null) { const r = runCells(p, st.line, st.run); return r.some((i) => cells[i] !== p.solution[i]) ? r : []; }
  const idx = lineIndices(p.w, p.h, st.line);
  const missing = idx.filter((i) => p.solution[i] > 0 && cells[i] !== p.solution[i]);
  if (!st.drag || !missing.length) return missing;
  // The solution run that contains the first missing cell.
  const k0 = idx.indexOf(missing[0]);
  let a = k0, b = k0;
  while (a > 0 && p.solution[idx[a - 1]] === p.solution[idx[k0]]) a--;
  while (b < idx.length - 1 && p.solution[idx[b + 1]] === p.solution[idx[k0]]) b++;
  return idx.slice(a, b + 1);
}

export function GameScreen({ target, onExit, onSettings, onNext, onGallery, onAtelier, demo }: {
  target: PlayTarget; onExit: () => void; onSettings: () => void; onNext: (t: PlayTarget | null) => void; onGallery?: () => void; onAtelier?: () => void; demo?: Demo;
}) {
  const info = useMemo(() => playInfo(target), [target]);
  const p = info.puzzle;
  const player = usePlayer();
  const opts = optsOf(player);
  const insets = useSafeAreaInsets();
  const bannerH = useBannerHeight();
  const colored = p.palette.length > 1 || p.palette[0] !== INK;

  const [play_, setPlay] = useState<PlayState>(() => {
    const s = newPlay(p);
    if (demo || qa.level != null) return s; // QA replays always start from a blank canvas
    const saved = loadSave(info.key, p.w * p.h);
    if (saved) { analytics.track("crash_recovery_restore", { level: info.number }); return { ...s, cells: saved }; }
    return s;
  });
  const playRef = useRef(play_);
  playRef.current = play_;
  const [tool, setTool] = useState<Tool>(demo?.tool ?? "fill");
  const [color, setColor] = useState(1);
  // The board is drawn in the screen's FIRST frame: its slot starts at the size it had last time (or an estimate from
  // the window) and onLayout corrects it — never an empty placeholder card while the slot is measured (QA 2026-10-29:
  // "blank cream board with no grid or clues for several frames").
  const win0 = useWindowDimensions();
  const [area, setArea] = useState<{ w: number; h: number } | null>(() => qa.level != null ? null : lastArea ?? {
    w: Math.floor(win0.width),
    h: Math.max(220, Math.floor(win0.height - insets.top - insets.bottom - bannerH - (win0.height < 700 ? 300 : 360))),
  });
  const [won, setWon] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [showWin, setShowWin] = useState(false);
  const [lost, setLost] = useState(false);
  const [pick, setPick] = useState(!!demo?.pick);
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [brushShop, setBrushShop] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [bloom, setBloom] = useState<{ i: number; n: number; color: string } | null>(null);
  const [flash, setFlash] = useState<{ lines: number[]; n: number } | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [tutStep, setTutStep] = useState(0);
  const [fingerDown, setFingerDown] = useState(false);
  const handBack = useRef<ReturnType<typeof setTimeout> | null>(null);
  // `onBoard`: the hand points at a cell (no press ring — the target cell has its own outline).
  const [hand, setHand] = useState<{ from: { x: number; y: number }; to?: { x: number; y: number }; onBoard?: boolean; flip?: boolean } | null>(null);
  // Hint Brush explanation / tip title shown with `advice` in Mina's bubble.
  const [adviceTitle, setAdviceTitle] = useState("Mina's tip");
  // Multi-line / combo banner; the combo grows across consecutive moves that each complete ≥ 1 line.
  const [banner, setBanner] = useState<{ id: number; text: string; chip?: string; color: string } | null>(null);
  const combo = useRef(0);
  // Tutorial levels: a wrong ink gets a gentle coral ring + Mina's note (never a penalty).
  const [warn, setWarn] = useState<{ id: number; cells: number[]; text: string } | null>(null);
  const wonRef = useRef(false);
  const slotH = useRef(0);
  // Feel layer: floating words over the board, a burst when the picture is finished, a soft shake on a refused mark.
  const [boardBox, setBoardBox] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [floats, setFloats] = useState<{ id: number; text: string; color: string }[]>([]);
  const [burst, setBurst] = useState(0);
  const floatId = useRef(0);
  const { style: shakeStyle, shake } = useShake(7);
  // Tutorial: a small confetti puff over the line a step just completed.
  const [tutBurst, setTutBurst] = useState<{ n: number; x: number; y: number }>({ n: 0, x: 0, y: 0 });
  // Mina's reaction in the play strip under the board (line sealed, combo, win).
  const [cheer, setCheer] = useState<{ id: number; text: string; big?: boolean } | null>(null);
  const cheerUp = useCallback((text: string, big?: boolean) => setCheer((c) => ({ id: (c?.id ?? 0) + 1, text, big })), []);
  const { height: winH } = useWindowDimensions();
  const compact = winH < 700;
  // Until a picture is painted its name stays secret (it would give the answer away).
  const hiddenTitle = target.kind === "level" ? `Puzzle ${info.number}` : target.kind === "event" ? "Weekly Exhibition" : info.title;
  // The title never fades for a toast (toasts and banners have their own callout lane); it only steps out while the
  // result card is up, so the painting's name never shows through the scrim behind the card.
  const titleStyle = useAnimatedStyle(() => ({ opacity: withTiming(showWin ? 0 : 1, { duration: 200 }) }), [showWin]);
  // Entrance: everything is drawn (full opacity) from the first frame and only SETTLES into place — the HUD drops in,
  // the framed board grows 0.94 → 1 and the tools rise, staggered ~60 ms apart. Transforms only, never a fade from
  // blank, so no frame of the puzzle start ever looks like missing art.
  const enterHud = useSharedValue(0), enterBoard = useSharedValue(0), enterTools = useSharedValue(0);
  useEffect(() => {
    if (demo) { enterHud.value = 1; enterBoard.value = 1; enterTools.value = 1; return; }
    enterHud.value = 0; enterBoard.value = 0; enterTools.value = 0;
    enterHud.value = withSpring(1, { damping: 13, stiffness: 190 });
    enterBoard.value = withDelay(60, withSpring(1, { damping: 12, stiffness: 170 }));
    enterTools.value = withDelay(130, withSpring(1, { damping: 13, stiffness: 190 }));
  }, [info.key]); // eslint-disable-line react-hooks/exhaustive-deps
  // While the result card is up the HUD, chips and board step out entirely (no dimmed back arrow, "31/31" pill or
  // board edges poking out beside the card).
  const winHide = useAnimatedStyle(() => ({ opacity: withTiming(showWin ? 0 : 1, { duration: 220 }) }), [showWin]);
  const hudStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -18 * (1 - enterHud.value) }] }));
  const boardEnter = useAnimatedStyle(() => ({ transform: [{ translateY: 16 * (1 - enterBoard.value) }, { scale: 0.94 + 0.06 * enterBoard.value }] }));
  const bottomStyle = useAnimatedStyle(() => ({ opacity: withTiming(won ? 0 : 1, { duration: 300 }), transform: [{ translateY: 30 * (1 - enterTools.value) }] }), [won]);
  const say = useCallback((text: string, color: string = palette.primary) => {
    const id = ++floatId.current;
    setFloats([{ id, text, color }]); // one toast at a time, the newest wins
    setTimeout(() => setFloats((f) => f.filter((k) => k.id !== id)), 1300);
  }, []);
  // Pause: the clock stops while the pause menu is open.
  const [paused, setPaused] = useState(false);
  const pausedAt = useRef(0);
  // Tutorial: a satisfied step gets a brief "Nice!" before the next step.
  const [tutNice, setTutNice] = useState(false);
  const board = useRef<BoardHandle>(null);
  const toolRefs = useRef<Record<string, React.ComponentRef<typeof View> | null>>({});
  const swatchRefs = useRef<(React.ComponentRef<typeof View> | null)[]>([]);
  const root = useRef<React.ComponentRef<typeof View>>(null);
  const started = useRef(Date.now());
  const level = info.level;
  // Mina's on-screen teaching: the first three puzzles (step by step), then the first puzzle of every island
  // introduces its new mechanic (one note that steps aside after the next move).
  const tutorial = useMemo<TutStep[] | null>(() => {
    if (qa.level || demo || target.kind !== "level" || !level || starsOf(info.key) > 0) return null;
    const t = TUTORIAL[info.number];
    if (t && (info.number > 2 || !store.get().tutorialDone)) return p.id === t.id ? t.steps(p) : [{ until: "move", text: t.fallback }];
    const mech = ISLANDS[level.island]?.mechanic;
    if (level.slot === 1 && level.island > 0 && (mech === "tally" || mech === "color-tally")) {
      // A new KIND of clue: Mina points straight at the first ringed number on this board.
      const lines = [...p.rows, ...p.cols];
      const t = lines.findIndex((c) => c.tally);
      if (t >= 0) {
        const name = lineName(p, t);
        const counts = tallyOf(clueOf(p, t).blocks).map((x) => x.count).join(" and ");
        return [{
          until: "move", clue: t,
          text: mech === "tally"
            ? `New: a ringed number! ${name[0].toUpperCase()}${name.slice(1)}'s ringed ${counts} counts ALL its ink — in any number of pieces, anywhere. Solve the crossing lines, then count: once ${counts} are inked, the rest is paper.`
            : `New: coloured tallies. ${name[0].toUpperCase()}${name.slice(1)}'s rings count each colour's cells, in no order. The crossing lines say where; the rings say how many of each.`,
        }];
      }
    }
    if (level.slot === 1 && level.island > 0 && mech && MECHANICS[mech]) return [{ until: "move", text: `New on ${ISLANDS[level.island].name}: ${MECHANICS[mech]}.` }];
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.key]);
  const [tipH, setTipH] = useState(0);
  const tutorialOpen = !!tutorial && tutStep < tutorial.length && !won;
  const step = tutorialOpen && tutorial ? tutorial[tutStep] : null;
  /** First step from k on that the board hasn't satisfied yet (steps already done — e.g. restored work — are skipped). */
  const nextOpenStep = useCallback((k: number) => {
    if (!tutorial) return 0;
    const s = playRef.current;
    while (k < tutorial.length && tutorial[k].until !== "win" && stepDone(p, tutorial[k], s.cells, s.moves)) k++;
    return k;
  }, [tutorial, p]);
  useEffect(() => { if (tutorial) setTutStep(nextOpenStep(0)); }, [tutorial, nextOpenStep]);
  // A satisfied step: Mina says "Nice!" for ~1.5 s, then the next open step takes over. Intro notes just close.
  useEffect(() => {
    if (!tutorial || !step || tutNice || won) return;
    if (!stepDone(p, step, play_.cells, play_.moves)) return;
    if (step.until === "move") { setTutStep(tutorial.length); return; }
    setTutNice(true);
    play("star3", 0.55);
    haptic("success");
    // A visible "you did it" on the board itself: confetti puffs out of the middle of the line just finished.
    if (step.line != null) {
      const idx = lineIndices(p.w, p.h, step.line);
      board.current?.cellCenter(idx[Math.floor(idx.length / 2)]).then((c) => { if (c) setTutBurst((b) => ({ n: b.n + 1, x: c.x, y: c.y })); });
      cheerUp(step.line < p.h ? "Row done!" : "Column done!");
    }
  }, [play_.cells, play_.moves, tutorial, step, tutNice, won, p, cheerUp]);
  useEffect(() => {
    if (!tutNice) return;
    const t = setTimeout(() => { setTutNice(false); setTutStep((k) => nextOpenStep(k + 1)); }, 1500);
    return () => clearTimeout(t);
  }, [tutNice, nextOpenStep]);
  // What the current step points at (cells ringed on the board; the hand goes to the first of them).
  const stepTargets = useMemo(() => (step && !tutNice ? stepCells(p, step, play_.cells) : []), [step, tutNice, p, play_.cells]);
  // Live progress of a line step ("3/8 inked" in Mina's card), so the step never looks stale between taps.
  const stepProgress = useMemo(() => {
    if (!step || step.line == null) return null;
    const idx = stepInk(p, step);
    return { done: idx.filter((i) => play_.cells[i] === p.solution[i]).length, need: idx.length };
  }, [step, p, play_.cells]);
  const cueLine = step && !tutNice ? step.line ?? step.clue ?? null : null;
  const warnCells = useMemo(() => (warn ? warn.cells.filter((i) => play_.cells[i] > 0 && play_.cells[i] !== p.solution[i]) : []), [warn, play_.cells, p]);

  // ── level start ──
  useEffect(() => {
    started.current = Date.now();
    analytics.track("level_start", { level: info.number });
    analytics.track("puzzle_start", { level: info.number, size: p.w * p.h, daily: target.kind === "daily" });
    if (target.kind === "level") store.set({ lastLevel: info.number });
    if (demo?.fill) {
      // Screenshot: ink the first part of the picture (row by row) and let auto-X close finished lines.
      const ink = p.solution.map((v, i) => (v > 0 && !p.given[i] ? i : -1)).filter((i) => i >= 0);
      let s = newPlay(p);
      for (const i of ink.slice(0, Math.round(ink.length * demo.fill))) s = paint(p, s, [i], p.solution[i], { autoX: true, strikes: false }).state;
      if (demo.xs) {
        const cells = s.cells.slice();
        const rows = Math.ceil(p.h * demo.fill);
        for (let i = 0; i < rows * p.w; i++) if (p.solution[i] === 0 && cells[i] === 0 && i % 3 !== 1) cells[i] = X;
        if (p.w * p.h > rows * p.w + 2) cells[rows * p.w + 1] = DOT;
        s = { ...s, cells };
      }
      setPlay(s);
    }
    if (demo?.win) {
      setPlay({ ...newPlay(p), cells: p.solution.map((v, i) => (v > 0 ? v : p.void[i] || p.given[i] ? X : X)) });
      setWon(true);
      setReward({ stars: 3, pigments: { base: 40, noHint: 10, speed: 4, total: 54 }, brushBonus: 0, firstSolve: true, bestStars: 3 });
      setTimeout(() => setShowWin(true), 900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.key]);

  // ── QA replay: report the next real touch the solver plays toward the win ──
  // One stroke paints the longest straight run of still-missing cells of one colour (a drag; a tap for one cell),
  // so even a big canvas is won in well under 70 touches. Small cells are zoomed into view first.
  const reportQa = useCallback((s: PlayState) => {
    if (qa.level == null || demo) return;
    if (isSolved(p, s.cells)) { reportNext(info.number, null); return; }
    const report = (v: React.ComponentRef<typeof View> | null | undefined) => v?.measureInWindow((x, y, w, h) => reportNext(info.number, { x: x + w / 2, y: y + h / 2 }));
    const stroke = (cells: number[]) => {
      const b = board.current;
      if (!b) return;
      b.focusCells(cells)
        .then(() => Promise.all([b.cellCenter(cells[0]), b.cellCenter(cells[cells.length - 1])]))
        .then(([a, z]) => { if (a) reportNext(info.number, cells.length > 1 && z ? { x: a.x, y: a.y, x2: z.x, y2: z.y } : a); });
    };
    const run = qaNextRun(p, s.cells, color);
    // Only stray ink left (never on a fresh QA board, but a replay must still finish): tap it off with its own colour.
    const stray = run ? -1 : s.cells.findIndex((v, k) => v > 0 && v !== p.solution[k] && !locked(p, k));
    if (!run && stray < 0) { reportNext(info.number, null); return; }
    const want = run ? run.color : s.cells[stray];
    if (tool !== "fill") return report(toolRefs.current.fill);
    if (colored && color !== want) return report(swatchRefs.current[want - 1]);
    stroke(run ? run.cells : [stray]);
  }, [p, info.number, tool, color, colored, demo]);
  useEffect(() => { reportQa(play_); }, [tool, color]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── pointing hand: the hint picker's suggested clue, or the tutorial step's tool / cell / drag run ──
  const handKey = demo ? "" : pick ? `pick:${play_.cells.join("")}` : step && !tutNice && !warn
    ? `${tutStep}:${step.tool && step.tool !== tool ? `tool:${step.tool}` : stepTargets.filter((i) => play_.cells[i] !== p.solution[i]).join(",")}:${info.number === 1 && step.until === "win" ? play_.cells.join("") : ""}`
    : "";
  useEffect(() => {
    if (!handKey || !area || won) { setHand(null); return; }
    let live = true;
    const toRoot = (from: { x: number; y: number }, to?: { x: number; y: number }, onBoard?: boolean, flip?: boolean) =>
      root.current?.measureInWindow((rx, ry) => { if (live) setHand({ from: { x: from.x - rx, y: from.y - ry }, to: to ? { x: to.x - rx, y: to.y - ry } : undefined, onBoard, flip }); });
    const t = setTimeout(() => {
      const b = board.current;
      if (!b) return;
      const cells = playRef.current.cells;
      if (pick) {
        // Suggest the line the solver would read next — the hand taps its clue number.
        const c = b.clueCenter(nextDeduction(p, cells)?.line ?? 0);
        if (c) toRoot(c); else setHand(null);
        return;
      }
      if (!step) { setHand(null); return; }
      if (step.clue != null) {
        const c = b.clueCenter(step.clue);
        if (c) toRoot(c); else setHand(null);
        return;
      }
      if (step.tool && step.tool !== tool) {
        toolRefs.current[step.tool]?.measureInWindow((x, y, w, h) => toRoot({ x: x + w / 2, y: y + h / 2 }));
        return;
      }
      let list = stepTargets;
      if (!list.length && info.number === 1 && step.until === "win") {
        // Level 1's closing step keeps a gentle pointer on the next cell the logic decides.
        const adv = nextDeduction(p, cells);
        const i = adv?.cells.find((k) => p.solution[k] > 0 && cells[k] !== p.solution[k]);
        list = i != null ? [i] : [];
      }
      if (!list.length) { setHand(null); return; }
      const first = step.drag ? list.find((i) => cells[i] !== p.solution[i]) ?? list[0] : list[0];
      Promise.all([b.cellCenter(first), step.drag && list.length > 1 ? b.cellCenter(list[list.length - 1]) : Promise.resolve(null)]).then(([a, z]) => {
        if (!live) return;
        if (!a) { setHand(null); return; }
        // Cells in the board's last two rows sit right above Mina's card: the hand reaches down to them from above.
        const low = (i: number) => Math.floor(i / p.w) >= p.h - 2;
        toRoot(a, z ?? undefined, true, low(first) || (step.drag && list.length > 1 && low(list[list.length - 1])));
      });
    }, 450);
    return () => { live = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handKey, area, won]);

  // ── win / lose ──
  const onSolved = useCallback((s: PlayState) => {
    setWon(true);
    wonRef.current = true;
    setPick(false);
    setAdvice(null);
    setHand(null);
    setWarn(null);
    setBanner(null);
    combo.current = 0;
    haptic("heavy"); // the hit: the board holds still for a beat (REVEAL.pause), then shakes once
    const seconds = Math.round((Date.now() - started.current) / 1000);
    const r = completePuzzle(info, { hints: s.hints, slips: s.slips, seconds }, target);
    setReward(r);
    // Win sequence (Board's reveal, same board — no size or position change): hit-pause + shake, a light sweep
    // across the grid, the picture lands diagonal by diagonal (~0.9 s); then confetti, droplets and, after a beat to
    // look at the painting, the result card.
    setTimeout(() => play("success", 0.7), 140);
    cheerUp("A masterpiece!", true);
    setTimeout(() => {
      play("star3", 0.6);
      haptic("success");
      setBurst((b) => b + 1);
      play("coin", 0.55, 1.2);
    }, REVEAL_MS);
    // A second, wider burst while the gold shimmer glides over the finished painting.
    setTimeout(() => { setBurst((b) => b + 1); play("star2", 0.5); haptic("medium"); }, REVEAL_MS + 650);
    analytics.track("level_complete", { level: info.number, stars: r.stars, hints: s.hints, seconds });
    analytics.track("puzzle_complete", { level: info.number, stars: r.stars, daily: target.kind === "daily" });
    if (target.kind === "level" && info.number >= 2 && !store.get().tutorialDone) {
      store.set({ tutorialDone: true });
      analytics.track("tutorial_done", { level: info.number });
    }
    reportNext(info.number, null);
    // The painting gets a full beat on its own (shimmer, twinkles, two bursts, Mina cheering) before the card.
    setTimeout(() => setShowWin(true), REVEAL_MS + 1300);
  }, [info, target, cheerUp]);

  const commit = useCallback((s: PlayState) => {
    if (!demo) writeSave(info.key, s.cells);
    if (isSolved(p, s.cells)) { onSolved(s); return; }
    if (isLost(p, s, opts)) {
      setLost(true);
      analytics.track("level_fail", { level: info.number, strikes: s.strikes });
    }
    reportQa(s);
  }, [demo, info.key, info.number, p, opts, onSolved, reportQa]);

  // ── painting: one stroke (tap or drag) = one undo step, previewed live from the stroke's base state ──
  // `tapErase`: the stroke started on ink with the Fill tool. Only a lone TAP clears that ink (decided at lift-off); the
  // moment it becomes a drag it fills instead, skipping cells already inked — so a swipe across a part-inked row always
  // completes it, and a second, imprecise tap or swipe never wipes out work that was just placed.
  const stroke = useRef<{ base: PlayState; value: number; changed: number; lines: Set<number>; rejected?: boolean; tapErase?: number } | null>(null);
  /** Multi-line / combo celebration after a stroke: bigger banner + rising sound + success haptic. */
  const celebrate = useCallback((lines: number, n: number) => {
    const multi = lines >= 2;
    const text = lines >= 4 ? `Brilliant! ${lines} lines` : lines === 3 ? "Triple line!" : lines === 2 ? "Double line!" : `Combo ×${n}`;
    // The chip says what fed it: strokes in a row that each sealed a line (Mina's strip spells it out).
    const chip = multi && n >= 2 ? `×${n}` : undefined;
    setBanner((b) => ({ id: (b?.id ?? 0) + 1, text, chip, color: lines >= 3 ? palette.secondary : multi ? "#F2C46A" : palette.primaryLight }));
    const rate = Math.min(1.7, 1 + (Math.max(lines, n) - 2) * 0.09);
    if (multi) { play("success", 0.6, rate); haptic("success"); } else { play("coin", 0.5, rate); haptic("medium"); }
    cheerUp(multi ? `${text} ${lines} lines in one stroke` : `${n} strokes in a row each sealed a line!`, true);
  }, [cheerUp]);
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner((b) => (b?.id === banner.id ? null : b)), COMBO_BANNER_MS);
    return () => clearTimeout(t);
  }, [banner]);
  useEffect(() => {
    if (!warn) return;
    const t = setTimeout(() => setWarn((w) => (w?.id === warn.id ? null : w)), 3200);
    return () => clearTimeout(t);
  }, [warn]);

  const onStroke = useCallback((phase: StrokePhase, run: number[]) => {
    if (won || lost) return;
    if (pick) {
      // The picker is open: the grid itself isn't a target — point the player at the clue numbers.
      if (phase === "start") { play("tap", 0.4); say("Tap a clue number, not a cell", palette.secondaryDark); }
      return;
    }
    if (phase === "start") {
      // The pointing hand steps away while the finger is on the glass (it never sits under or over the stroke).
      if (handBack.current) clearTimeout(handBack.current);
      setFingerDown(true);
      const base = playRef.current;
      const first = run[0];
      if (first == null || locked(p, first)) { stroke.current = null; return; }
      const value = toolValue(base.cells[first], tool, color);
      const tapErase = tool === "fill" && value === BLANK && base.cells[first] > 0 ? first : undefined;
      stroke.current = { base, value: tapErase != null ? color : value, changed: 0, lines: new Set(), tapErase };
      setAdvice(null);
      if (tapErase != null) return; // tap or drag? decided by the next move / the lift-off
    }
    if (phase === "end" || phase === "cancel") {
      if (handBack.current) clearTimeout(handBack.current);
      handBack.current = setTimeout(() => setFingerDown(false), 600);
    }
    const st = stroke.current;
    if (!st) return;
    if (phase === "cancel") { setPlay(st.base); stroke.current = null; return; }
    if (st.tapErase != null && phase === "move") {
      if (run.length < 2) return;
      st.tapErase = undefined; // it's a drag: keep filling
    }
    if (phase === "end") {
      stroke.current = null;
      if (st.tapErase != null) {
        const i = st.tapErase;
        if (tutorialOpen && st.base.cells[i] === p.solution[i]) {
          // Tutorial: correct ink stays put — a soft "already inked" tick (the board's press squash is the visual).
          play("tap", 0.35, 1.25);
          haptic("select");
          return;
        }
        const res = paint(p, st.base, [i], BLANK, opts);
        if (!res.changed.length) return;
        setPlay(res.state);
        playRef.current = res.state;
        analytics.qa("move", { level: info.number });
        play("pop", 0.45, 0.85);
        haptic("select");
      }
      const s = playRef.current;
      if (s !== st.base) {
        if (!isSolved(p, s.cells)) {
          // Lines this stroke completed (and that are still complete at lift-off) feed the combo.
          const lines = [...st.lines].filter((l) => lineSatisfied(p, s.cells, l)).length;
          combo.current = lines > 0 ? combo.current + 1 : 0;
          if (lines >= 2 || combo.current >= 2) celebrate(lines, combo.current);
          else if (lines === 1) cheerUp(["Nice line!", "Sealed!", "Clean!", "That's it!"][(s.moves + lines) % 4]);
          // Tutorial levels: flag a wrong ink gently (coral ring + Mina names what the line needs) — no penalty.
          if (tutorial && s.slips > st.base.slips) {
            const bad = s.cells.map((v, i) => (v > 0 && v !== st.base.cells[i] && v !== p.solution[i] ? i : -1)).filter((i) => i >= 0);
            if (bad.length) {
              const i = bad[0], r = Math.floor(i / p.w), c = i % p.w;
              const need = (l: number) => clueOf(p, l).blocks.reduce((a, b) => a + b.len, 0);
              const inked = (l: number) => lineIndices(p.w, p.h, l).filter((k) => s.cells[k] > 0).length;
              const over = inked(r) > need(r) ? r : inked(p.h + c) > need(p.h + c) ? p.h + c : -1;
              const what = over >= 0
                ? `${lineName(p, over)[0].toUpperCase()}${lineName(p, over).slice(1)} only needs ${need(over)} inked cell${need(over) === 1 ? "" : "s"}`
                : "That cell stays paper — its clues can't reach it";
              setWarn((w) => ({ id: (w?.id ?? 0) + 1, cells: bad, text: `${what}. Tap the ringed cell again to clear it.` }));
              play("pop", 0.35, 0.8);
            }
          }
        }
        commit(s);
      }
      return;
    }
    const res = paint(p, st.base, run, st.value, opts);
    const ink = res.changed.filter((i) => st.base.cells[i] !== res.state.cells[i]);
    if (res.rejected.length && !st.rejected) { st.rejected = true; play("error", 0.5); haptic("warning"); shake(); }
    if (ink.length !== st.changed) {
      const grew = ink.length > st.changed;
      st.changed = ink.length;
      if (grew) {
        const last = run[run.length - 1];
        if (st.value > 0) {
          // Brush pitch climbs along the drag (a pentatonic-ish step per cell, capped an octave up).
          play("move", Math.min(1, 0.45 + run.length * 0.05), Math.min(2, Math.pow(1.06, Math.max(0, ink.length - 1))));
          setBloom((b) => ({ i: last, n: (b?.n ?? 0) + 1, color: p.palette.length === 1 && p.palette[0] === INK ? boardSkinOf(player).ink : (p.palette[st.value - 1] ?? INK) }));
        } else play(st.value === X ? "tap" : "pop", 0.5, Math.min(1.6, Math.pow(1.04, Math.max(0, ink.length - 1))));
        haptic(st.value > 0 && ink.length === 1 ? "light" : "select");
      }
    }
    const fresh = res.completedLines.filter((l) => !st.lines.has(l));
    if (fresh.length) {
      // Live per-line feedback (sweep + tick + rising chime); the big banner comes at lift-off (celebrate).
      fresh.forEach((l) => st.lines.add(l));
      play("unlock", 0.45, Math.min(1.5, 1 + (st.lines.size - 1) * 0.12));
      setFlash((f) => ({ lines: fresh, n: (f?.n ?? 0) + 1 }));
    }
    const next = res.changed.length ? res.state : st.base;
    if (next !== playRef.current) {
      setPlay(next);
      playRef.current = next;
      analytics.qa("move", { level: info.number });
    }
  }, [won, lost, pick, p, tool, color, opts, commit, info.number, say, shake, celebrate, cheerUp, tutorial, tutorialOpen]);

  const doUndo = () => {
    if (won) return;
    if (!play_.undo.length) { say("Nothing to undo yet", palette.inkSoft); haptic("light"); return; }
    const s = undoState(play_);
    combo.current = 0;
    setPlay(s);
    play("whoosh", 0.4);
    haptic("select");
    analytics.track("undo_used", { level: info.number });
    analytics.qa("move", { level: info.number });
    commit(s);
  };
  const doRedo = () => {
    if (won) return;
    if (!play_.redo.length) { say(play_.undo.length ? "Redo brings back what Undo took" : "Nothing to redo yet", palette.inkSoft); haptic("light"); return; }
    const s = redoState(play_);
    combo.current = 0;
    setPlay(s);
    play("whoosh", 0.4, 1.15);
    haptic("select");
    analytics.qa("move", { level: info.number });
    commit(s);
  };
  const restart = () => {
    setPaused(false);
    const s = newPlay(p);
    combo.current = 0;
    setWarn(null);
    setPlay(s);
    setLost(false);
    setConfirmRestart(false);
    started.current = Date.now();
    if (!demo) writeSave(info.key, null);
    feedback("whoosh", "medium");
    analytics.qa("move", { level: info.number });
    reportQa(s);
  };

  // ── hints ──
  const startHint = () => {
    if (won) return;
    setAdvice(null);
    if ((player.brushes ?? 0) <= 0) { setBrushShop(true); return; }
    setPick((v) => !v);
  };
  const onClueTap = useCallback((line: number) => {
    if (!pick || won) return;
    if (lineIndices(p.w, p.h, line).every((i) => locked(p, i) || (p.solution[i] > 0 ? playRef.current.cells[i] === p.solution[i] : playRef.current.cells[i] === X))) {
      play("error", 0.4);
      haptic("warning");
      shake();
      say("That line is already finished", palette.inkSoft);
      return; // already complete — don't spend a brush on it
    }
    if (!spendBrush()) { setPick(false); setBrushShop(true); return; }
    // Why this line: the solver's reading of it from the player's marks (when that is the line it would read
    // next), otherwise what the brush did and where to look next.
    const before = playRef.current.cells;
    const why = nextDeduction(p, before);
    const name = lineName(p, line);
    const lc = clueOf(p, line);
    const nums = lc.tally ? `tally ${tallyOf(lc.blocks).map((t) => t.count).join(" + ") || "0"}` : lc.blocks.map((b) => (b.hidden ? "?" : String(b.len))).join(" ") || "0";
    const res = hintLine(p, playRef.current, line, opts);
    setPick(false);
    setPlay(res.state);
    playRef.current = res.state;
    feedback("star2", "medium");
    say(`Hint Brush painted ${name}`, palette.secondaryDark);
    setAdviceTitle(`Hint Brush · ${name}`);
    setAdvice({
      line,
      cells: [],
      text: why && why.line === line
        ? `${why.text} The brush painted it for you.`
        : `Painted ${name} (clue ${nums}). Its ink and ✕s are new clues for the crossing ${line < p.h ? "columns" : "rows"}.`,
    });
    setFlash((f) => ({ lines: [line, ...res.completedLines], n: (f?.n ?? 0) + 1 }));
    analytics.track("hint_used", { level: info.number, line });
    analytics.qa("move", { level: info.number });
    commit(res.state);
  }, [pick, won, p, opts, info.number, commit, shake, say]);
  const showTip = () => {
    if (won) return;
    const a = nextDeduction(p, play_.cells);
    setPick(false);
    setAdviceTitle("Mina's tip");
    setAdvice(a ?? { line: -1, cells: [], text: "Every remaining cell is already decided by your marks — check the lines that don't match their clues yet." });
    play("pop", 0.5);
  };

  const exit = () => {
    if (!won && play_.moves > 0) analytics.track("puzzle_abandon", { level: info.number, progress: Math.round(play_.cells.filter((v, i) => v > 0 && v === p.solution[i]).length) });
    onExit();
  };
  const pause = () => {
    if (won) return;
    pausedAt.current = Date.now();
    setPaused(true);
    setPick(false);
    play("pop", 0.5);
    analytics.track("pause", { level: info.number });
  };
  const resume = () => {
    started.current += Date.now() - pausedAt.current;
    setPaused(false);
    feedback("tap", "select");
  };
  const strikesLeft = strikeLimit(p) - play_.strikes;
  // How much of the picture is inked correctly. Wrong ink counts against it (correct / (needed + wrong)), so the
  // read-out can never say 100% while a stray cell is still inked.
  const painted = useMemo(() => {
    let need = 0, ok = 0, wrong = 0;
    p.solution.forEach((v, i) => {
      if (p.given[i]) return;
      const c = play_.cells[i];
      if (v > 0) { need++; if (c === v) ok++; }
      if (c > 0 && c !== v) wrong++;
    });
    return { value: need + wrong ? ok / (need + wrong) : 1, ok, need };
  }, [p, play_.cells]);
  // Lines whose clues are satisfied (the play strip's "sealed" count).
  const sealed = useMemo(() => {
    let n = 0;
    for (let l = 0; l < p.w + p.h; l++) if (lineSatisfied(p, play_.cells, l)) n++;
    return n;
  }, [p, play_.cells]);
  // Space left under the framed board: when there is room, Mina's play strip lives there (reactions, lines sealed,
  // combo) instead of an empty band between the board and the tools.
  const boardSize = area ? framedSize(p, area.w - 28, area.h - 28) : null;
  const STRIP_H = 64;
  const showStrip = !!area && !!boardSize && area.h - boardSize.h >= STRIP_H + 30;
  // The framed board on screen (root coordinates): it sits centred in its slot, above Mina's strip when that shows.
  const boardRect = useMemo(() => {
    if (!boardSize) return { x: 0, y: 0, w: 0, h: 0 };
    const stack = boardSize.h + (showStrip ? STRIP_H + 10 : 0);
    return { x: boardBox.x + (boardBox.w - boardSize.w) / 2, y: boardBox.y + (boardBox.h - stack) / 2, w: boardSize.w, h: boardSize.h };
  }, [boardBox, boardSize?.w, boardSize?.h, showStrip]); // eslint-disable-line react-hooks/exhaustive-deps
  const best = starsOf(info.key);
  const isl = ISLANDS[info.island];
  const nextTarget: PlayTarget | null = target.kind === "level" ? (info.number < LEVELS.length ? { kind: "level", n: info.number + 1 } : null) : null;
  const leaving = useRef(false);
  const goNext = () => {
    if (leaving.current) return;
    leaving.current = true;
    // The pressed Next plate (sunk + darkened) stays on screen for a beat before the card closes.
    setTimeout(() => {
      setShowWin(false);
      ads.showInterstitial();
      onNext(nextTarget);
    }, 160);
  };
  const remind = async () => {
    const ok = await notify.ask("A gentle reminder for your daily puzzle");
    if (ok) {
      setOpt("reminders", true);
      notify.daily("daily-puzzle", { hour: 19, minute: 0 }, { title: "Your daily puzzle is ready", body: "A fresh picture is waiting in the atelier — keep your streak going." });
    }
  };

  const toolbar = (
    <View style={[styles.toolRow, opts.leftHand && { flexDirection: "row-reverse" }]}>
      <IconButton icon="undo" size={50} onPress={doUndo} muted={!play_.undo.length || won} accessibilityLabel="Undo" />
      <ToolTray tool={tool} onTool={(t) => { setTool(t); analytics.track("tool_switch", { tool: t }); }} refs={toolRefs.current} colorHex={p.palette[color - 1] ?? INK} />
      <IconButton icon="redo" size={50} onPress={doRedo} muted={!play_.redo.length || won} accessibilityLabel="Redo" />
    </View>
  );

  return (
    <View ref={root} style={styles.root}>
      <Background wash={isl ? `${isl.hue}14` : undefined} />
      {/* HUD */}
      <Animated.View style={[styles.hud, { paddingTop: insets.top + 4 }, hudStyle, winHide]}>
        <IconButton icon="back" size={46} onPress={exit} accessibilityLabel="Back" />
        {/* The title steps aside while a toast holds the HUD band, so the two never print over each other. */}
        <Animated.View style={[styles.titleWrap, titleStyle]}>
          <Text style={[styles.title, opts.dark && { color: "#F6EEDC" }]} numberOfLines={1}>{won || best > 0 ? info.title : hiddenTitle}</Text>
          <Text style={[styles.sub, opts.dark && { color: "#C9B8A0" }]} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>{info.subtitle}</Text>
          <MiniStars count={best} size={14} />
        </Animated.View>
        {/* On the win the result card pins its Pigments balance top-right: the pause button steps out (an equal
            spacer keeps the title centred), so the two never stack on each other. */}
        {won ? <View style={styles.hudSpacer} /> : <IconButton icon="pause" size={46} onPress={pause} accessibilityLabel="Pause" />}
      </Animated.View>
      <Animated.View style={[styles.chips, hudStyle, winHide]}>
        {opts.strikes ? (
          <View style={styles.strikes}>
            <Text style={styles.strikesText}>Strikes left {Math.max(0, strikesLeft)}</Text>
          </View>
        ) : <PaintedMeter value={painted.value} ok={painted.ok} need={painted.need} />}
        {/* While the win card is up its own balance pill (top right) takes the pigments; one balance on screen. */}
        <View style={won ? { opacity: 0 } : null}><CurrencyPill image={art.icon_pigment} value={player.coins} /></View>
      </Animated.View>

      {/* Callout lane: combo banners and toasts pop here — between the HUD and the board, never over the title,
          the clues or the cells. */}
      <View pointerEvents="none" style={styles.lane}>
        {floats.map((f) => (
          <Toast key={f.id} text={f.text} color={f.color} />
        ))}
        {banner ? <ComboBanner key={banner.id} text={banner.text} chip={banner.chip} color={banner.color} /> : null}
      </View>

      {/* board */}
      <View
        style={styles.boardArea}
        onLayout={(e) => {
          // Frozen once the picture is solved: the board keeps exactly its size and place through the whole win.
          if (wonRef.current) return;
          const l = e.nativeEvent.layout;
          const a = { w: Math.floor(l.width), h: Math.floor(l.height) };
          lastArea = a;
          setArea((o) => (o && o.w === a.w && o.h === a.h ? o : a));
          setBoardBox({ x: l.x, y: l.y, w: l.width, h: l.height });
        }}
      >
        {/* Until the slot is measured (one frame) a small easel spinner holds the space — the screen is never empty.
            No layout `entering` on the board: it shares the screen's ease-in, and the shake is its only transform. */}
        {!area ? <BoardPlaceholder /> : null}
        {area ? (
          <Animated.View style={[boardEnter, winHide]}>
          <Animated.View style={shakeStyle}>
          <Board
            skin={boardSkinOf(player)}
            ref={board}
            puzzle={p}
            cells={play_.cells}
            width={area.w - 28}
            height={area.h - 28}
            opts={opts}
            onStroke={onStroke}
            onClueTap={onClueTap}
            focusLine={advice && advice.line >= 0 ? advice.line : cueLine}
            targetCells={stepTargets}
            warnCells={warnCells}
            pickMode={pick}
            bloom={bloom}
            flash={flash}
            revealed={won}
            hue={isl?.hue ?? palette.primary}
            autoZoom={!qa.level && !demo}
            onReady={() => {
              if (demo?.zoom) setZoomed(!!board.current?.toggleZoom());
              setTimeout(() => reportQa(playRef.current), 450); // after the screen's enter animation settles
            }}
          />
          </Animated.View>
          </Animated.View>
        ) : null}
        {/* One Mina voice at a time: while a tutorial card is open, the play strip steps aside. */}
        {showStrip && !tutorialOpen ? (
          <PlayStrip height={STRIP_H} sealed={sealed} total={p.w + p.h} combo={combo.current} cheer={cheer} won={won} dark={opts.dark} />
        ) : null}
      </View>


      {/* thumb zone */}
      <Animated.View pointerEvents={won ? "none" : "auto"} style={[styles.bottom, { paddingBottom: insets.bottom + bannerH + 8 }, bottomStyle]}>
        {/* Message slot: on tutorial levels it keeps the tallest height it has shown, so the board never jumps under
            the player's finger when a tip changes length or closes. On the win its height is frozen, so the board
            keeps exactly its size and place while the picture is revealed. */}
        <View
          style={[tutorialOpen ? { minHeight: tipH, marginBottom: 6 } : null, won ? { height: slotH.current, overflow: "hidden" } : null]}
          onLayout={(e) => {
            const h = Math.ceil(e.nativeEvent.layout.height);
            if (!wonRef.current) slotH.current = h;
            if (tutorialOpen && h > tipH) setTipH(h);
          }}
        >
        {won ? null : pick ? (
          <Animated.View entering={FadeInUp.duration(200)} style={styles.pickBar}>
            <Image source={art.icon_hint_brush} style={{ width: 30, height: 32 }} resizeMode="contain" />
            <Text style={styles.pickText}>Tap a row or column clue — the Hint Brush paints that whole line.</Text>
            {/* More brushes (Pigments or an opt-in rewarded ad) — reachable any time, not only at zero. */}
            <Pressable accessibilityRole="button" accessibilityLabel="Get more Hint Brushes" hitSlop={6} onPress={() => { feedback("tap", "light"); setPick(false); setBrushShop(true); }} style={({ pressed }) => [styles.moreBrushes, pressed && styles.pressed]}>
              <Text style={styles.moreBrushesText}>+ More</Text>
            </Pressable>
            <IconButton icon="close" size={44} onPress={() => setPick(false)} accessibilityLabel="Cancel hint" />
          </Animated.View>
        ) : advice ? (
          <MinaSays title={adviceTitle} text={advice.text} style={styles.say} compact={compact}>
            <Pressable onPress={() => { feedback("tap", "select"); setAdvice(null); }} hitSlop={14} style={({ pressed }) => pressed && styles.pressed}><Text style={styles.gotIt}>Got it</Text></Pressable>
          </MinaSays>
        ) : warn && warnCells.length ? (
          <MinaSays key={`w${warn.id}`} title="Mina · almost" text={warn.text} style={styles.say} compact={compact} />
        ) : tutorial && tutorialOpen && step ? (
          <MinaSays
            title={tutNice ? "Mina" : tutorial.length > 1 ? `Mina · step ${tutStep + 1}/${tutorial.length}` : "Mina"}
            text={tutNice ? "Nice! That's exactly it." : step.text}
            style={styles.say}
            compact={compact}
          >
            {tutNice ? null : (
              <View style={styles.tipRow}>
                {stepProgress ? (
                  <View style={styles.tipProgress} accessibilityLabel={`${stepProgress.done} of ${stepProgress.need} cells inked`}>
                    <View style={styles.tipTrack}><View style={[styles.tipFill, { width: `${Math.max(6, (100 * stepProgress.done) / stepProgress.need)}%` }]} /></View>
                    <Text style={styles.tipHint}>{stepProgress.done === 0 ? `Start at the ring` : stepProgress.need - stepProgress.done === 1 ? "Last one!" : `${stepProgress.done}/${stepProgress.need} · ${stepProgress.need - stepProgress.done} to go`}</Text>
                  </View>
                ) : <View />}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={step.until === "win" || step.until === "move" ? "Got it" : "Skip the tutorial"}
                  hitSlop={8}
                  onPress={() => { setTutStep(tutorial.length); feedback("tap", "select"); }}
                  style={({ pressed }) => [styles.skipBtn, pressed && { transform: [{ scale: 0.96 }] }]}
                >
                  <Text style={styles.skipText}>{step.until === "win" || step.until === "move" ? "Got it" : "Skip tips"}</Text>
                </Pressable>
              </View>
            )}
          </MinaSays>
        ) : null}
        </View>
        {colored ? (
          <View style={[styles.swatches, opts.leftHand && { flexDirection: "row-reverse" }]}>
            {p.palette.map((hex, k) => (
              <Pressable
                key={k}
                ref={(v) => { swatchRefs.current[k] = v; }}
                accessibilityLabel={`Colour ${k + 1}`}
                onPressIn={() => { setColor(k + 1); setTool("fill"); feedback("tap", "select"); analytics.track("tool_switch", { tool: `color${k + 1}` }); }}
                style={({ pressed }) => [styles.swatchHit, pressed && styles.pressed]}
              >
                <Animated.View style={[styles.swatch, { backgroundColor: hex }, color === k + 1 && styles.swatchOn]}>
                  {color === k + 1 ? <Icon name="check" size={18} color={lightColor(hex) ? palette.ink : "#fff"} /> : null}
                </Animated.View>
              </Pressable>
            ))}
          </View>
        ) : null}
        {toolbar}
        <View style={[styles.actions, opts.leftHand && { flexDirection: "row-reverse" }]}>
          <View style={[styles.smallRow, opts.leftHand && { flexDirection: "row-reverse" }]}>
            {Math.max(p.w, p.h) >= 10 ? (
              <IconButton icon={zoomed ? "zoomOut" : "zoomIn"} size={44} active={zoomed} label="Zoom" onPress={() => { const z = !!board.current?.toggleZoom(); setZoomed(z); analytics.track("zoom_used", { on: z }); }} />
            ) : null}
            <IconButton icon="bulb" size={44} label="Tip" onPress={showTip} disabled={won} />
            <IconButton icon="restart" size={44} label="Restart" onPress={() => setConfirmRestart(true)} disabled={won} />
          </View>
          <HintBrushButton count={player.brushes ?? 0} onPress={startHint} active={pick} />
        </View>
      </Animated.View>

      {/* Win confetti fires from the frame's two top corners (alternating) and is clipped OFF the framed board: pieces
          pass behind the finished painting, so they never cover the picture or its clue numbers. */}
      <Confetti trigger={burst} count={44} origin={{ x: boardRect.x + (burst % 2 ? 0.06 : 0.94) * boardRect.w, y: boardRect.y + 4 }} avoid={boardRect} />
      <Confetti trigger={tutBurst.n} count={22} origin={{ x: tutBurst.x, y: tutBurst.y }} avoid={boardRect} />

      {/* The hand is drawn over everything: its fingertip sits ON the target cell / clue / tool, so it is never hidden
          under Mina's card (only its wrist can brush the card's top margin). */}
      {hand && !fingerDown && !won ? <TutorialHand key={`${hand.onBoard ? "b" : ""}${hand.from.x},${hand.from.y},${hand.to?.x ?? ""}`} from={hand.from} to={hand.to} ring={!hand.onBoard} flip={hand.flip} /> : null}

      {reward ? (
        <WinPopup
          visible={showWin}
          puzzle={p}
          hue={isl?.hue ?? palette.primary}
          title={info.title}
          stars={reward.stars}
          goals={[
            { label: "Solved", met: true },
            { label: "No Hint Brush", met: play_.hints === 0, why: "a Hint Brush was used" },
            { label: "Steady hand", met: play_.slips === 0, why: `${play_.slips} cell${play_.slips === 1 ? " was" : "s were"} inked by mistake` },
          ]}
          pigments={reward.pigments.total}
          balance={player.coins}
          bonus={[
            `${reward.pigments.base} for the painting`,
            reward.pigments.noHint ? `+${reward.pigments.noHint} bonus: no Hint Brush used` : "",
            reward.pigments.speed ? `+${reward.pigments.speed} bonus: solved under par time` : "",
            reward.brushBonus ? `+${reward.brushBonus} Hint Brush${reward.brushBonus > 1 ? "es" : ""} earned` : "",
          ].filter(Boolean).join(" · ")}
          extra={reward.streak ? `Daily streak: ${reward.streak} day${reward.streak > 1 ? "s" : ""}${reward.frozeDay ? " (a Streak Freeze saved it)" : ""}` : info.masterwork ? `Masterwork! The ${isl?.room ?? "atelier"} can now be renovated.` : undefined}
          nextLabel={nextTarget ? "Next Puzzle" : "Continue"}
          onNext={goNext}
          onGallery={onGallery ? () => { setShowWin(false); onGallery(); } : undefined}
          onHome={() => { setShowWin(false); onExit(); }}
          onAtelier={onAtelier ? () => { setShowWin(false); onAtelier(); } : undefined}
        >
          {target.kind === "daily" && !opts.reminders ? (
            <GameButton style={{ marginTop: 10 }} size="sm" variant="secondary" label="Remind me tomorrow" onPress={remind} />
          ) : null}
        </WinPopup>
      ) : null}

      <FailPopup
        visible={lost}
        message={`Strikes mode is on and this board allows ${strikeLimit(p)} misplaced inks. Start fresh, or keep your work and switch strikes off.`}
        onRetry={restart}
        onContinue={() => { setOpt("strikes", false); setLost(false); }}
        onHome={() => { setLost(false); onExit(); }}
      />

      <Popup visible={confirmRestart} title="Clear the canvas?" onClose={() => setConfirmRestart(false)}>
        <Text style={styles.popText}>All your marks on this picture will be wiped. Undo stays free if you change your mind mid-puzzle.</Text>
        <GameButton label="Clear and restart" variant="primary" onPress={restart} />
        <GameButton style={{ marginTop: 10 }} size="sm" variant="light" label="Keep painting" onPress={() => setConfirmRestart(false)} />
      </Popup>

      <Popup visible={paused} title="Paused" onClose={resume}>
        <View style={styles.pauseArt}>
          <PictureThumb puzzle={p} cells={play_.cells} size={96} background="#FFFBF0" />
          <View style={{ flex: 1 }}>
            <Text style={styles.pauseTitle}>{best > 0 ? info.title : hiddenTitle}</Text>
            <Text style={styles.pauseSub}>{pct(painted.value)}% painted · the clock is stopped</Text>
          </View>
        </View>
        {/* Star goals: what each of the three stars asks for, lit while this solve is still on track for it. */}
        <View style={styles.goals} accessibilityLabel="Star goals: solve the picture, no Hint Brush, no wrong ink">
          {[
            { on: true, label: "solve" },
            { on: play_.hints === 0, label: "no Hint Brush" },
            { on: play_.slips === 0, label: "no wrong ink" },
          ].map((g) => (
            <View key={g.label} style={styles.goal}>
              <Text style={[styles.goalStar, { color: g.on ? palette.star : "rgba(31,42,58,0.25)" }]}>★</Text>
              <Text style={[styles.goalText, !g.on && { color: palette.inkSoft, textDecorationLine: "line-through" }]}>{g.label}</Text>
            </View>
          ))}
        </View>
        <GameButton label="Resume" variant="primary" size="lg" onPress={resume} />
        <View style={styles.pauseToggles}>
          <Toggle label="Sound effects" value={player.sound !== false} onChange={(v) => { store.set({ sound: v }); analytics.track("settings_changed", { key: "sound", value: v }); }} />
          <Toggle label="Haptics" value={player.haptics !== false} onChange={(v) => { store.set({ haptics: v }); analytics.track("settings_changed", { key: "haptics", value: v }); }} />
        </View>
        <View style={styles.pauseRow}>
          <GameButton style={{ flex: 1 }} size="sm" variant="secondary" label="Restart" onPress={() => { setPaused(false); setConfirmRestart(true); }} />
          <GameButton style={{ flex: 1 }} size="sm" variant="light" label="Settings" onPress={() => { resume(); onSettings(); }} />
        </View>
        <GameButton style={{ marginTop: 10 }} size="sm" variant="light" label="Home" onPress={() => { setPaused(false); exit(); }} />
      </Popup>

      <BrushShop visible={brushShop} onClose={() => setBrushShop(false)} onGot={() => { setBrushShop(false); setPick(true); say("Brushes added — now tap a clue", palette.secondaryDark); }} />
    </View>
  );
}

/** The board slot's last measured size: the next puzzle's first frame draws the board at once at this size. */
let lastArea: { w: number; h: number } | null = null;

/** Holds the board's slot for the single frame before it is measured: a calm, empty paper card (no spinner, no copy). */
function BoardPlaceholder() {
  return <View style={styles.placeholder} accessibilityLabel="Canvas" />;
}

/** Segmented cream tray with a sliding teal thumb — the active tool is never ambiguous. */
function ToolTray({ tool, onTool, refs, colorHex }: { tool: Tool; onTool: (t: Tool) => void; refs: Record<string, React.ComponentRef<typeof View> | null>; colorHex: string }) {
  const tools: Tool[] = ["fill", "x", "dot"];
  const idx = tools.indexOf(tool);
  const [w, setW] = useState(0);
  const seg = (w - 8) / 3;
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: withSpring(idx * seg, springs.press) }] }), [idx, seg]);
  return (
    <View style={[styles.tray, softShadow]} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w ? <Animated.View style={[styles.thumb, { width: seg }, thumb]} /> : null}
      {tools.map((t) => {
        const on = t === tool;
        return (
          <Pressable
            key={t}
            ref={(v) => { refs[t] = v; }}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={t === "fill" ? "Fill tool" : t === "x" ? "X tool" : "Dot tool"}
            style={styles.seg}
            onPressIn={() => { feedback("tap", "select"); onTool(t); }}
          >
            {t === "fill" ? (
              <>
                <View style={[styles.fillChip, { backgroundColor: on ? "#fff" : colorHex }]} />
                <Text style={[styles.segText, on && styles.segOn]}>Fill</Text>
              </>
            ) : t === "x" ? (
              <Icon name="x" size={24} color={on ? "#fff" : palette.coral} weight={3} />
            ) : (
              <>
                <View style={[styles.dot, { backgroundColor: on ? "#fff" : "#8A8590" }]} />
                <Text style={[styles.segText, on && styles.segOn]}>Dot</Text>
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Mina's play strip (in the band under the board when the screen has room): she hops and says something when a
 * line is sealed, a combo lands or the picture is finished; between reactions it shows how many lines are sealed,
 * with a teal bar that grows, and the live combo.
 */
function PlayStrip({ height, sealed, total, combo, cheer, won, dark }: {
  height: number; sealed: number; total: number; combo: number; cheer: { id: number; text: string; big?: boolean } | null; won: boolean; dark?: boolean;
}) {
  const hop = useSharedValue(0);
  const bub = useSharedValue(1);
  const [live, setLive] = useState<string | null>(null);
  useEffect(() => {
    if (!cheer) return;
    setLive(cheer.text);
    hop.value = withSequence(withTiming(cheer.big ? -16 : -10, { duration: 140, easing: Easing.out(Easing.quad) }), withSpring(0, { damping: 6, stiffness: 260 }));
    bub.value = withSequence(withTiming(cheer.big ? 1.12 : 1.06, { duration: 110 }), withSpring(1, { damping: 7, stiffness: 260 }));
    if (won) return;
    const t = setTimeout(() => setLive(null), 1800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cheer?.id]);
  useEffect(() => {
    // The win: Mina keeps bouncing with joy while the painting is on show.
    if (won) hop.value = withDelay(500, withRepeat(withSequence(withTiming(-12, { duration: 180, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 260, easing: Easing.bounce })), 8));
  }, [won, hop]);
  const hopSt = useAnimatedStyle(() => ({ transform: [{ translateY: hop.value }] }));
  const bubSt = useAnimatedStyle(() => ({ transform: [{ scale: bub.value }] }));
  const frac = total ? sealed / total : 0;
  const fv = useSharedValue(frac);
  useEffect(() => { fv.value = withTiming(frac, { duration: 320, easing: Easing.out(Easing.cubic) }); }, [frac, fv]);
  const barSt = useAnimatedStyle(() => ({ width: `${Math.max(3, fv.value * 100)}%` }));
  const idle = sealed === 0 ? "Start with a clue that fills most of its line" : `${sealed} of ${total} lines sealed`;
  return (
    <View style={[styles.strip, { height }]} accessibilityLabel={`${sealed} of ${total} lines sealed`}>
      <Animated.View style={hopSt}><MinaAvatar size={48} bob={false} /></Animated.View>
      <Animated.View style={[styles.stripBubble, dark && { backgroundColor: "rgba(40,36,48,0.85)" }, bubSt]}>
        <View style={styles.stripTail} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={[styles.stripText, live ? styles.stripCheer : null, dark && !live && { color: "#F6EEDC" }]} numberOfLines={1}>{live ?? idle}</Text>
          {combo >= 2 && !won ? (
            <View style={styles.comboChip}><Text style={styles.comboText}>Combo ×{combo}</Text></View>
          ) : null}
        </View>
        <View style={styles.stripTrack}><Animated.View style={[styles.stripFill, barSt]} /></View>
      </Animated.View>
    </View>
  );
}

/** Percent for display: rounds down, so only a truly finished picture reads 100%. */
const pct = (v: number) => (v >= 1 ? 100 : Math.floor(v * 100));

/** "Painted 54%" pill: the teal wash eases (never springs past and back) and the pill gives a little bounce per step. */
/** Ink progress: "5/11 inked" — whole cells, so one finished row never reads as a puzzling percentage. */
function PaintedMeter({ value, ok, need }: { value: number; ok: number; need: number }) {
  const [w, setW] = useState(0);
  const fill = useAnimatedStyle(() => ({ width: withTiming(Math.max(0.04, value) * w, { duration: 260, easing: Easing.out(Easing.cubic) }) }), [value, w]);
  const pop = useSharedValue(1);
  const last = useRef(value);
  useEffect(() => {
    if (value > last.current) pop.value = withSequence(withTiming(1.09, { duration: 90 }), withSpring(1, { damping: 8, stiffness: 320 }));
    last.current = value;
  }, [value, pop]);
  const popSt = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  return (
    <Animated.View style={[styles.meter, softShadow, popSt]} accessibilityLabel={`${ok} of ${need} ink cells painted`}>
      <View style={styles.meterTrack} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        <Animated.View style={[styles.meterFill, fill]} />
      </View>
      <Text style={styles.meterText}>{ok}/{need}<Text style={styles.meterUnit}> inked</Text></Text>
    </Animated.View>
  );
}

function HintBrushButton({ count, onPress, active }: { count: number; onPress: () => void; active: boolean }) {
  const st = useAnimatedStyle(() => ({ transform: [{ scale: withSpring(active ? 1.06 : 1, springs.pop) }] }), [active]);
  // Idle life: the brush gives a little flick every few seconds while brushes are available.
  const wig = useSharedValue(0);
  useEffect(() => {
    wig.value = count > 0
      ? withRepeat(withSequence(withDelay(4200, withTiming(1, { duration: 160 })), withTiming(-1, { duration: 200 }), withTiming(0.5, { duration: 160 }), withTiming(0, { duration: 180, easing: Easing.out(Easing.quad) })), -1)
      : withTiming(0, { duration: 150 });
  }, [count, wig]);
  const brushSt = useAnimatedStyle(() => ({ transform: [{ rotate: `${-20 + wig.value * 14}deg` }, { translateY: -Math.abs(wig.value) * 3 }] }));
  // The badge visibly ticks when the count changes: a squash-pop, and a "−1" that floats off when a brush is spent.
  const bump = useSharedValue(1);
  const prev = useRef(count);
  const [spent, setSpent] = useState(0);
  useEffect(() => {
    if (count !== prev.current) {
      bump.value = withSequence(withTiming(1.45, { duration: 110 }), withSpring(1, { damping: 7, stiffness: 260 }));
      if (count < prev.current) setSpent((n) => n + 1);
    }
    prev.current = count;
  }, [count, bump]);
  const badgeSt = useAnimatedStyle(() => ({ transform: [{ scale: bump.value }] }));
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Hint Brush" onPress={() => { feedback("tap", "light"); onPress(); }} hitSlop={6} style={({ pressed }) => pressed && styles.pressed}>
      <Animated.View style={[styles.brushPlate, active && styles.brushOn, st]}>
        <Image source={art.btn_secondary_gold} style={{ position: "absolute", left: 0, top: 0, width: 128, height: 56 }} resizeMode="stretch" />
        <Animated.Image source={art.icon_hint_brush} style={[styles.brushIcon, brushSt]} resizeMode="contain" />
        <Text style={styles.brushLabel}>Hint</Text>
        <Animated.View style={[styles.badge, badgeSt]}><Text style={styles.badgeText}>{count}</Text></Animated.View>
        {spent ? <SpentTag key={spent} /> : null}
      </Animated.View>
    </Pressable>
  );
}

/** "−1" lifting off the Hint badge when a brush is spent. */
function SpentTag() {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }); }, [t]);
  const st = useAnimatedStyle(() => ({ opacity: t.value < 0.6 ? 1 : 1 - (t.value - 0.6) / 0.4, transform: [{ translateY: -26 * t.value }] }));
  return <Animated.Text pointerEvents="none" style={[styles.spent, st]}>−1</Animated.Text>;
}

/** Out of Hint Brushes: buy with Pigments, or an opt-in rewarded ad. Declining never leads to another ad. */
function BrushShop({ visible, onClose, onGot }: { visible: boolean; onClose: () => void; onGot: () => void }) {
  const player = usePlayer();
  const [msg, setMsg] = useState("");
  useEffect(() => { if (visible) { setMsg(""); analytics.track("ad_rewarded_offered", { place: "hint" }); } }, [visible]);
  return (
    <Popup visible={visible} title="Hint Brushes" onClose={onClose}>
      <Text style={styles.popText}>A Hint Brush paints one whole row or column of your choice — correctly, with the logic explained. You get 3 free every day.</Text>
      {BRUSH_PACKS.map((pk) => (
        <GameButton
          key={pk.id}
          style={{ marginBottom: 10 }}
          variant="secondary"
          label={`+${pk.brushes} brushes · ${pk.cost} Pigments`}
          disabled={player.coins < pk.cost}
          onPress={() => { if (buyBrushes(pk.id)) { feedback("coin", "success"); onGot(); } }}
        />
      ))}
      {/* Always offered (opt-in): if no ad has loaded yet the player is told so — never blocked, never forced. */}
      <GameButton
        variant="primary"
        label="Watch an ad for a brush · +1"
        onPress={() => {
          const shown = ads.showRewarded(() => { addBrushes(1); feedback("coin", "success"); analytics.track("ad_rewarded_completed", { place: "hint" }); onGot(); });
          if (!shown) setMsg("No ad is ready — your game is never blocked by one. Try again later.");
        }}
      />
      {msg ? <Text style={[styles.popText, { marginTop: 10, marginBottom: 0 }]}>{msg}</Text> : null}
      <Text style={styles.small}>You have {player.coins} Pigments · {player.brushes ?? 0} brushes</Text>
    </Popup>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hud: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8 },
  hudSpacer: { width: 46, height: 46 },
  goals: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", columnGap: 10, rowGap: 2, marginBottom: 12 },
  goal: { flexDirection: "row", alignItems: "center", gap: 3 },
  goalStar: { fontFamily: fonts.display, fontSize: 16, includeFontPadding: false },
  goalText: { fontFamily: fonts.body, fontSize: 13, color: palette.ink },
  titleWrap: { flex: 1, alignItems: "center" },
  title: { fontFamily: fonts.display, fontSize: 24, color: palette.ink, includeFontPadding: false },
  sub: { fontFamily: fonts.body, fontSize: 12.5, color: palette.inkSoft, marginBottom: 2 },
  chips: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, marginTop: 2 },
  strikes: { backgroundColor: "rgba(255,248,232,0.9)", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1.5, borderColor: "rgba(31,42,58,0.2)" },
  strikesText: { fontFamily: fonts.body, fontSize: 13, color: palette.ink },
  meter: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,250,238,0.95)", borderRadius: 16, paddingLeft: 12, paddingRight: 10, height: 34, borderWidth: 1.5, borderColor: "rgba(182,128,31,0.4)" },
  meterTrack: { width: 92, height: 10, borderRadius: 5, backgroundColor: "#E5D8BC", overflow: "hidden" },
  meterFill: { height: "100%", borderRadius: 5, backgroundColor: palette.primary },
  meterText: { fontFamily: fonts.display, fontSize: 15, color: palette.primaryDark, minWidth: 38, textAlign: "right", includeFontPadding: false, fontVariant: ["tabular-nums"] },
  meterUnit: { fontFamily: fonts.body, fontSize: 12, color: palette.inkSoft },
  boardArea: { flex: 1, alignItems: "center", justifyContent: "center" },
  lane: { height: CALLOUT_LANE, marginBottom: -6 },
  placeholder: { width: "86%", aspectRatio: 1, maxHeight: "92%", borderRadius: 6, backgroundColor: "rgba(255,251,241,0.7)", borderWidth: 6, borderColor: "rgba(182,110,40,0.35)" },
  strip: { flexDirection: "row", alignItems: "center", gap: 10, width: "100%", maxWidth: 480, paddingHorizontal: 16, marginTop: 10 },
  stripBubble: { flex: 1, backgroundColor: "rgba(255,251,241,0.95)", borderRadius: 16, borderWidth: 1.5, borderColor: "rgba(182,128,31,0.45)", paddingHorizontal: 12, paddingVertical: 7 },
  stripTail: { position: "absolute", left: -6, top: 16, width: 11, height: 11, backgroundColor: "#FFFBF1", borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderColor: "rgba(182,128,31,0.45)", transform: [{ rotate: "45deg" }] },
  stripText: { flexShrink: 1, fontFamily: fonts.body, fontSize: 14, color: palette.ink, includeFontPadding: false },
  stripCheer: { fontFamily: fonts.display, fontSize: 16, color: palette.primaryDark },
  stripTrack: { height: 7, borderRadius: 4, backgroundColor: "#E5D8BC", marginTop: 6, overflow: "hidden" },
  stripFill: { height: "100%", borderRadius: 4, backgroundColor: palette.primary },
  comboChip: { marginLeft: "auto", backgroundColor: palette.secondary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, borderBottomWidth: 2, borderBottomColor: palette.secondaryDark },
  comboText: { fontFamily: fonts.display, fontSize: 13, color: "#4A3010", includeFontPadding: false },
  bottom: { paddingHorizontal: 12, gap: 8 },
  say: { marginBottom: 2 },
  pressed: { transform: [{ scale: 0.93 }], opacity: 0.85 },
  tipRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4, gap: 8 },
  tipHint: { fontFamily: fonts.display, fontSize: 13.5, color: palette.primaryDark },
  tipProgress: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  tipTrack: { flex: 1, maxWidth: 110, height: 8, borderRadius: 4, backgroundColor: "rgba(46,140,138,0.16)", overflow: "hidden" },
  tipFill: { height: 8, borderRadius: 4, backgroundColor: palette.primary },
  skipBtn: { minHeight: 36, paddingHorizontal: 14, borderRadius: 18, backgroundColor: "#EFE3C6", borderWidth: 1.5, borderColor: "rgba(182,128,31,0.5)", alignItems: "center", justifyContent: "center" },
  skipText: { fontFamily: fonts.display, fontSize: 15, color: palette.primaryDark, includeFontPadding: false },
  gotIt: { fontFamily: fonts.display, fontSize: 14, color: palette.primary, alignSelf: "flex-end", marginTop: 2 },
  moreBrushes: { minHeight: 44, minWidth: 64, paddingHorizontal: 10, borderRadius: 22, backgroundColor: palette.secondary, borderBottomWidth: 3, borderBottomColor: palette.secondaryDark, alignItems: "center", justifyContent: "center" },
  moreBrushesText: { fontFamily: fonts.display, fontSize: 15, color: palette.ink },
  pickBar: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FFF4D8", borderRadius: 16, borderWidth: 2, borderColor: palette.secondary, paddingLeft: 10, paddingRight: 4, paddingVertical: 4 },
  pickText: { flex: 1, fontFamily: fonts.body, fontSize: 13.5, color: palette.ink },
  swatches: { flexDirection: "row", justifyContent: "center", gap: 10 },
  swatchHit: { padding: 3 },
  swatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: "rgba(31,42,58,0.35)", alignItems: "center", justifyContent: "center" },
  swatchOn: { borderWidth: 3.5, borderColor: palette.ink, transform: [{ scale: 1.12 }] },
  toolRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tray: { flex: 1, height: 52, borderRadius: 18, backgroundColor: "#F7EEDA", borderWidth: 2, borderColor: "rgba(31,42,58,0.18)", flexDirection: "row", padding: 4 },
  thumb: { position: "absolute", left: 4, top: 4, bottom: 4, borderRadius: 14, backgroundColor: palette.primary, borderBottomWidth: 3, borderBottomColor: palette.primaryDark },
  seg: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  segText: { fontFamily: fonts.display, fontSize: 17, color: palette.ink, includeFontPadding: false },
  segOn: { color: "#fff" },
  fillChip: { width: 16, height: 16, borderRadius: 4, borderWidth: 1, borderColor: "rgba(0,0,0,0.2)" },
  dot: { width: 11, height: 11, borderRadius: 6 },
  actions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  smallRow: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  brushPlate: { width: 128, height: 56, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  brushOn: { opacity: 0.85 },
  brushIcon: { width: 34, height: 36 },
  brushLabel: { fontFamily: fonts.display, fontSize: 19, color: "#4A3010", includeFontPadding: false },
  badge: { position: "absolute", right: -2, top: -6, minWidth: 26, height: 26, borderRadius: 13, backgroundColor: palette.coral, borderWidth: 2, borderColor: "#FFF8E8", alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  spent: { position: "absolute", right: 0, top: -12, fontFamily: fonts.display, fontSize: 18, color: palette.coral, textShadowColor: "#FFF8E8", textShadowRadius: 4, includeFontPadding: false },
  badgeText: { fontFamily: fonts.display, fontSize: 14, color: "#fff", includeFontPadding: false },
  pauseArt: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14, backgroundColor: "#F6ECD6", borderRadius: 16, padding: 10 },
  pauseTitle: { fontFamily: fonts.display, fontSize: 20, color: palette.ink },
  pauseSub: { fontFamily: fonts.body, fontSize: 13, color: palette.inkSoft, marginTop: 2 },
  pauseToggles: { marginTop: 12 },
  pauseRow: { flexDirection: "row", gap: 12, marginTop: 10 },
  popText: { fontFamily: fonts.bodyRegular, fontSize: 15, lineHeight: 21, color: palette.ink, textAlign: "center", marginBottom: 14 },
  small: { fontFamily: fonts.bodyRegular, fontSize: 13, color: palette.inkSoft, textAlign: "center", marginTop: 12 },
});
