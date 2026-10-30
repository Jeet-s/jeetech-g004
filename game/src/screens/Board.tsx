import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Image as RNImage, StyleSheet, Text, View } from "react-native";
import { Atlas, Canvas, Group, Image as SkImage, LinearGradient, Path, Rect, RoundedRect, Skia, useImage, vec, type SkImage as SkImageT, type SkPath, type SkRect } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming, type SharedValue } from "react-native-reanimated";
import { LinearGradient as Gradient } from "expo-linear-gradient";
import { art } from "../art";
import { fonts, palette } from "../ui/theme";
import { INK } from "../game/types";
import { mix, paintedColors } from "../ui/raster";
import { clueDone, DOT, tallyOf, X, type Block, type LineClue, type Puzzle } from "../game/nonogram";
import type { GameOptions } from "../modules/store";
import { qa } from "../modules/qa";
import { play } from "../audio/sfx";

/**
 * The nonogram board: an oak-framed paper card with sticky clue gutters and a Skia-drawn grid.
 *
 * Everything drawn derives from `cells` (the engine's PlayState) — the board never keeps its own copy.
 * Input: tap = one cell; hold-and-drag paints a straight run (the axis locks after 8 px) with a live "+N"
 * counter; tapping a clue reports the line (hint picker); pinch zooms and pans (two fingers), and when
 * zoomed a one-finger drag on the clue gutters pans too. Clues stay pinned while the grid moves.
 */

export type StrokePhase = "start" | "move" | "end" | "cancel";
export interface BoardHandle {
  /** Window-pixel centre of cell i (QA replay, tutorial hand) — measured fresh, so screen transitions can't skew it. */
  cellCenter(i: number): Promise<{ x: number; y: number } | null>;
  /** Window-pixel centre of a line's clue. */
  clueCenter(line: number): { x: number; y: number } | null;
  toggleZoom(): boolean;
  zoomed(): boolean;
  /**
   * QA replay on boards with small cells: zoom/pan so these cells are on screen at a readable size (each painted
   * cell then visibly changes the screen). Resolves once the camera is set; cellCenter() then reports the new spot.
   */
  focusCells(cells: number[]): Promise<void>;
}

interface Props {
  puzzle: Puzzle;
  /** Equipped Paper & Ink set (Shop cosmetics): paper tint, and ink for single-ink pictures. */
  skin?: { paper: string; ink: string };
  cells: number[];
  width: number;
  height: number;
  opts: GameOptions;
  onStroke: (phase: StrokePhase, run: number[]) => void;
  onClueTap?: (line: number) => void;
  /** Line outlined in gold (hint explanation / hint picker). */
  focusLine?: number | null;
  /** All lines glow softly — "pick a row or column". */
  pickMode?: boolean;
  bloom?: { i: number; n: number; color: string } | null;
  flash?: { lines: number[]; n: number } | null;
  revealed?: boolean;
  /** Island hue the finished picture is painted with (see paintedColors). */
  hue?: string;
  autoZoom?: boolean;
  onReady?: () => void;
  /** Tutorial: cells the current step asks for (soft teal pulsing ring). */
  targetCells?: number[];
  /** Tutorial: freshly inked wrong cells (gentle coral ring — a nudge, never a penalty). */
  warnCells?: number[];
}

/**
 * Win reveal timeline (ms from the solving move): a short hit-pause, a tiny board shake, a light sweep across the
 * grid, then the picture washes in cell by cell along a diagonal wave. GameScreen opens the result card after it.
 */
export const REVEAL = { pause: 120, sweepAt: 140, sweepMs: 420, waveAt: 200, waveMs: 600 };
export const REVEAL_MS = REVEAL.waveAt + REVEAL.waveMs;

const MAX_CELL = 54;
const FILL_FX_MS = 620; // pop + gloss + in-cell rim; short, so a dragged run never leaves a trail of effects behind
const RIPPLE_MS = 300;
const X_STAGGER = 32; // ms per cell of distance in the auto-✕ cascade
const X_POP_MS = 170;
/** Space (dp) between the innermost clue number and the grid edge. */
const CLUE_GAP = 5;
const MIN_FONT = 8;

interface Geo { font: number; G: number; Ch: number; base: number; slotW: number; slotH: number }

const digitsOf = (b: Block) => (b.hidden ? 1 : String(b.len).length);
/** What a clue shows: its runs, or (tally) one ringed count per colour. */
const shownBlocks = (c: LineClue): Block[] => (c.tally ? tallyOf(c.blocks).map((t) => ({ len: t.count, color: t.color })) : c.blocks);
/** Horizontal room (dp) a row clue needs at font f: rings are wider than bare numbers. */
const rowClueWidth = (c: LineClue, f: number) => {
  const bs = shownBlocks(c);
  if (c.tally) return bs.reduce((a, b) => a + f * (0.6 * digitsOf(b) + 1.1), 0) || f * 1.6;
  return bs.reduce((a, b) => a + f * (0.6 * digitsOf(b) + 0.62), 0) || f * 1.2;
};

/** Oak frame thickness for a board given width × height. */
const frameOf = (width: number, height: number) => Math.max(10, Math.min(18, Math.round(Math.min(width, height) * 0.04)));
/** Paper margin between the grid's right/bottom edge and the frame (the clue gutters already pad top/left). */
const marginOf = (width: number, height: number) => Math.max(6, Math.min(12, Math.round(Math.min(width, height) * 0.022)));

/** Outer size (dp) of the framed board Board draws for width × height — lets the screen use the space left below it. */
export function framedSize(p: Puzzle, width: number, height: number): { w: number; h: number } {
  const fr = frameOf(width, height), M = marginOf(width, height);
  const g = boardGeometry(p, width - fr * 2 - M, height - fr * 2 - M);
  return { w: g.G + g.base * p.w + M + fr * 2, h: g.Ch + g.base * p.h + M + fr * 2 };
}

/** Fit clue gutters + grid in width×height: the largest clue font whose grid cells still hold a two-digit number. */
export function boardGeometry(p: Puzzle, width: number, height: number): Geo {
  const rowSlots = (f: number) => Math.max(1, ...p.rows.map((r) => rowClueWidth(r, f)));
  // A ring is ~1.3 number-heights tall.
  const colSlots = Math.max(1, ...p.cols.map((c) => Math.max(1, c.tally ? shownBlocks(c).length * 1.3 : c.blocks.length)));
  let best: Geo | null = null;
  // Phones keep the 54 dp cell cap; tablets let small boards grow (and their clues with them).
  const cap = Math.max(MAX_CELL, Math.min(88, Math.floor(Math.min(width, height) / 8.5)));
  const fMax = Math.min(28, Math.max(20, Math.floor(cap * 0.36)));
  for (let f = fMax; f >= MIN_FONT; f -= 0.5) {
    // + CLUE_GAP: the clue numbers keep a little air from the grid edge (they never touch the heavy line).
    const G = Math.ceil(rowSlots(f) + 8 + CLUE_GAP);
    const Ch = Math.ceil(colSlots * f * 1.22 + 8 + CLUE_GAP);
    const base = Math.min(cap, Math.floor(Math.min((width - G) / p.w, (height - Ch) / p.h)));
    best = { font: f, G, Ch, base, slotW: f * 0.6, slotH: f * 1.22 };
    if (f <= base * 0.66) break;
  }
  return best!;
}

/** Colourblind-safe pattern glyph per colour index (1 = plain). */
function glyphPath(k: number, x: number, y: number, s: number, b: ReturnType<typeof Skia.PathBuilder.Make>) {
  const cx = x + s / 2, cy = y + s / 2, r = s * 0.16;
  switch ((k - 1) % 6) {
    case 1: b.addCircle(cx, cy, r); break;
    case 2: b.moveTo(x + s * 0.28, y + s * 0.72); b.lineTo(x + s * 0.72, y + s * 0.28); b.lineTo(x + s * 0.78, y + s * 0.34); b.lineTo(x + s * 0.34, y + s * 0.78); b.close(); break;
    case 3: b.addRect(Skia.XYWHRect(cx - r * 1.2, cy - r * 0.35, r * 2.4, r * 0.7)); b.addRect(Skia.XYWHRect(cx - r * 0.35, cy - r * 1.2, r * 0.7, r * 2.4)); break;
    case 4: b.moveTo(cx, cy - r * 1.3); b.lineTo(cx + r * 1.3, cy + r); b.lineTo(cx - r * 1.3, cy + r); b.close(); break;
    case 5: b.addRect(Skia.XYWHRect(cx - r, cy - r, r * 2, r * 2)); break;
    default: break;
  }
}

const ClueRow = memo(function ClueRow({ blocks, done, smudged, tally, font, colored, palette: pal, vertical, contrast, greyOut, slot }: {
  blocks: Block[]; done: string; smudged?: boolean; tally?: boolean; font: number; colored: boolean; palette: string[]; vertical: boolean; contrast: boolean; greyOut: boolean;
  /** Column width: vertical clue numbers are centred on exactly this width, so they sit over their column. */
  slot?: number;
}) {
  const ink = contrast ? "#000" : palette.ink;
  if (smudged) {
    return (
      <View style={[styles.smudgeWrap, vertical ? { width: font * 1.6, height: font * 2.4 } : { width: font * 2.6, height: font * 1.5 }]}>
        <RNImage source={art.fx_ink_bloom} style={{ position: "absolute", left: 0, top: 0, width: vertical ? font * 1.6 : font * 2.6, height: vertical ? font * 2.4 : font * 1.5, opacity: 0.42, tintColor: "#6B6A72" }} resizeMode="stretch" />
        <Text style={[styles.clue, { fontSize: font * 0.9, color: "#fff" }]}>≈</Text>
      </View>
    );
  }
  if (tally) {
    // Tally: one ringed count per colour — "this many cells, in any number of pieces". A ring (not a bare number)
    // so it never reads as a run length; it greys like any clue once the line is complete.
    const counts = tallyOf(blocks);
    const list = counts.length ? counts : [{ color: 1, count: 0 }];
    const allDone = greyOut && done.length > 0 && !done.includes("0");
    const d = font * 1.3;
    return (
      <View style={vertical ? styles.colStack : styles.rowStack} accessibilityLabel={`tally ${list.map((t) => t.count).join(" and ")}`}>
        {list.map((t, k) => {
          const col = colored ? pal[t.color - 1] ?? INK : ink;
          return (
            <View key={k} style={[styles.ring, { width: d, height: d, borderRadius: d / 2, borderWidth: Math.max(2, font * 0.13), borderColor: col, opacity: allDone ? 0.32 : 1, margin: 1 }]}>
              <Text style={[styles.clue, { fontSize: font * 0.88, lineHeight: font * 1.05, color: colored ? (lightColor(col) ? palette.ink : col) : ink, fontFamily: fonts.display }]}>{t.count}</Text>
            </View>
          );
        })}
      </View>
    );
  }
  const list = blocks.length ? blocks : [{ len: 0, color: 1 } as Block];
  return (
    <View style={vertical ? styles.colStack : styles.rowStack}>
      {list.map((b, k) => {
        const isDone = greyOut && done[k] === "1";
        const label = b.hidden ? "?" : String(b.len);
        if (colored && blocks.length) {
          const bg = pal[b.color - 1] ?? INK;
          return (
            <View key={k} style={[styles.chip, { minWidth: font * 1.15, height: font * 1.12, backgroundColor: bg, opacity: isDone ? 0.3 : 1, marginVertical: vertical ? 1 : 0, marginHorizontal: vertical ? 0 : 1 }]}>
              <Text style={[styles.clue, { fontSize: font * 0.86, color: lightColor(bg) ? palette.ink : "#fff" }]}>{label}</Text>
            </View>
          );
        }
        return (
          <Text
            key={k}
            style={[styles.clue, { fontSize: font, lineHeight: font * 1.22, color: isDone ? (contrast ? "rgba(0,0,0,0.3)" : palette.inkFaint) : ink, marginHorizontal: vertical ? 0 : font * 0.16 }, vertical && slot ? { width: slot } : null, b.hidden && styles.cracked]}
          >
            {label}
          </Text>
        );
      })}
    </View>
  );
});

export function lightColor(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 168;
}

export const Board = forwardRef<BoardHandle, Props>(function Board(props, ref) {
  const { puzzle: p, cells, width, height, opts, onStroke, onClueTap, focusLine, pickMode, bloom, flash, revealed, hue, autoZoom, onReady, targetCells, warnCells, skin } = props;
  // The oak frame and the paper margin right/below the grid are reserved BEFORE the grid is sized, so the whole
  // framed board (not just its card) fits width × height — the last column never runs into the frame.
  const fr = frameOf(width, height);
  const M = marginOf(width, height);
  const geo = useMemo(() => boardGeometry(p, width - fr * 2 - M, height - fr * 2 - M), [p, width, height, fr, M]);
  const { font, G, Ch, base } = geo;
  const VW = base * p.w, VH = base * p.h; // grid viewport (fixed); the camera moves the content inside it
  const zMax = Math.max(1, Math.min(3.2, 46 / base));
  const [cam, setCam] = useState({ z: 1, ox: 0, oy: 0 });
  const camRef = useRef(cam);
  camRef.current = cam;
  const cell = base * cam.z;
  const [focus, setFocus] = useState<{ r: number; c: number } | null>(null);
  const [counter, setCounter] = useState<{ n: number; x: number; y: number } | null>(null);
  const container = useRef<React.ComponentRef<typeof View>>(null);
  // Latest callbacks/flags in refs, so the gesture objects stay stable while the parent re-renders mid-drag.
  const cb = useRef({ onStroke, onClueTap, revealed });
  cb.current = { onStroke, onClueTap, revealed };
  const origin = useRef({ x: 0, y: 0 });

  const imgFill = useImage(art.cell_filled);
  const imgX = useImage(art.cell_x_mark);
  const imgDot = useImage(art.cell_dot_mark);

  const clamp = useCallback((z: number, ox: number, oy: number) => {
    const c = base * z;
    return { z, ox: Math.min(0, Math.max(VW - c * p.w, ox)), oy: Math.min(0, Math.max(VH - c * p.h, oy)) };
  }, [base, VW, VH, p.w, p.h]);

  // Big canvases open zoomed onto the top-left working region (≥ ~7 mm cells); QA/screenshot boards stay fitted.
  // Only on the puzzle's first layout: later size changes (a tip bubble opening under the board) keep the
  // player's view — re-clamped to the new size — instead of zooming into a corner and hiding the line just painted.
  const zoomedFor = useRef<Puzzle | null>(null);
  useEffect(() => {
    if (zoomedFor.current !== p) {
      zoomedFor.current = p;
      // Only real big canvases (10+ cells a side): a small board in a short slot (a tip open on a 360x640 phone)
      // is shown whole at a smaller cell — zooming it would crop its last rows and columns off screen.
      setCam(autoZoom && base < 22 && Math.max(p.w, p.h) >= 10 ? clamp(Math.min(zMax, 26 / base), 0, 0) : { z: 1, ox: 0, oy: 0 });
    } else setCam((c) => (c.z > 1.01 && Math.max(p.w, p.h) >= 10 ? clamp(Math.min(zMax, c.z), c.ox, c.oy) : { z: 1, ox: 0, oy: 0 }));
  }, [autoZoom, base, zMax, clamp, p]);

  // The win reveal paints the whole picture: a zoomed camera returns to the fitted view (the board's frame,
  // size and position never change — only the camera inside it).
  useEffect(() => {
    if (revealed && camRef.current.z > 1.01) setCam({ z: 1, ox: 0, oy: 0 });
  }, [revealed]);

  // ── tap feel, derived from the play state: every cell that just became ink pops + splashes once ──
  const [fills, setFills] = useState<{ id: number; i: number; color: string; cross?: boolean }[]>([]);
  const [ripples, setRipples] = useState<{ id: number; i: number }[]>([]);
  // Touch-down: the cell under the finger sinks at once (before any state change), so every tap is answered < 0.1 s.
  const [press, setPress] = useState<{ id: number; i: number } | null>(null);
  // Auto-✕ of a finished line: the ✕s cascade outward from the cell that sealed it (cover fades + pop, staggered).
  const [xWave, setXWave] = useState<{ id: number; cells: { i: number; d: number }[] } | null>(null);
  const prevCells = useRef<number[] | null>(null);
  const fxId = useRef(0);
  useEffect(() => {
    const prev = prevCells.current;
    prevCells.current = cells;
    if (!prev || prev.length !== cells.length || revealed) return;
    const fresh: number[] = [];
    // Player marks only: ink, and ✕ placed by hand (auto-✕ of a finished line gets the line sweep instead).
    for (let i = 0; i < cells.length; i++) if (cells[i] !== prev[i] && (cells[i] > 0 || (cells[i] === X && prev[i] !== X))) fresh.push(i);
    const inks = fresh.filter((i) => cells[i] > 0);
    const marks = inks.length ? inks : fresh.length <= 3 ? fresh : [];
    if (!marks.length || marks.length > 40) return; // a restore / redo of a huge step is not a "fill"
    // Auto-✕ (only alongside fresh ink): stagger by distance from the last inked cell.
    const autoX = inks.length && !qa.level ? fresh.filter((i) => cells[i] === X) : [];
    if (autoX.length) {
      const o = inks[inks.length - 1], or = Math.floor(o / p.w), oc = o % p.w;
      const list = autoX.map((i) => ({ i, d: Math.abs(Math.floor(i / p.w) - or) + Math.abs((i % p.w) - oc) }));
      const id = ++fxId.current;
      setXWave({ id, cells: list });
      const far = Math.max(...list.map((c) => c.d));
      [0, 1, 2].filter((k) => k === 0 || far > k * 2).forEach((k) => setTimeout(() => play("tap", 0.22, 1.35 + k * 0.12), X_STAGGER * (k * 2 + 1)));
      setTimeout(() => setXWave((w) => (w?.id === id ? null : w)), X_STAGGER * far + X_POP_MS + 80);
    }
    const add = marks.slice(-14).map((i) => ({ id: ++fxId.current, i, color: cells[i] > 0 ? p.palette[cells[i] - 1] ?? INK : palette.coral, cross: cells[i] === X }));
    const ids = new Set(add.map((a) => a.id));
    setFills((f) => [...f.slice(-20), ...add]);
    setTimeout(() => setFills((f) => f.filter((k) => !ids.has(k.id))), FILL_FX_MS + 60);
  }, [cells, revealed, p.palette]);
  const ripple = (i: number) => {
    const id = ++fxId.current;
    setRipples((r) => [...r.slice(-5), { id, i }]);
    setTimeout(() => setRipples((r) => r.filter((k) => k.id !== id)), RIPPLE_MS + 60);
  };

  const measure = useCallback(() => {
    container.current?.measureInWindow((x, y) => {
      origin.current = { x, y };
      onReady?.();
    });
  }, [onReady]);

  useImperativeHandle(ref, () => ({
    cellCenter(i: number) {
      return new Promise((resolve) => {
        const done = () => {
          const c = camRef.current, s = base * c.z;
          const x = G + c.ox + (i % p.w) * s + s / 2, y = Ch + c.oy + Math.floor(i / p.w) * s + s / 2;
          resolve(x < G || x > G + VW || y < Ch || y > Ch + VH ? null : { x: origin.current.x + x, y: origin.current.y + y });
        };
        if (!container.current) return done();
        container.current.measureInWindow((x, y) => { origin.current = { x, y }; done(); });
      });
    },
    clueCenter(line: number) {
      const c = camRef.current, s = base * c.z;
      if (line < p.h) return { x: origin.current.x + G / 2, y: origin.current.y + Ch + c.oy + line * s + s / 2 };
      return { x: origin.current.x + G + c.ox + (line - p.h) * s + s / 2, y: origin.current.y + Ch / 2 };
    },
    toggleZoom() {
      const c = camRef.current;
      if (c.z > 1.01) { setCam({ z: 1, ox: 0, oy: 0 }); return false; }
      const z = Math.min(zMax, Math.max(1.6, 30 / base));
      const f = focus ?? { r: Math.floor(p.h / 2), c: Math.floor(p.w / 2) };
      setCam(clamp(z, VW / 2 - (f.c + 0.5) * base * z, VH / 2 - (f.r + 0.5) * base * z));
      return true;
    },
    zoomed: () => camRef.current.z > 1.01,
    focusCells(list: number[]) {
      return new Promise<void>((resolve) => {
        if (!list.length || base >= 24) return resolve();
        const rs = list.map((i) => Math.floor(i / p.w)), cs = list.map((i) => i % p.w);
        const r0 = Math.min(...rs), r1 = Math.max(...rs), c0 = Math.min(...cs), c1 = Math.max(...cs);
        const z = Math.max(1, Math.min(zMax, 26 / base, (VW * 0.92) / ((c1 - c0 + 1) * base), (VH * 0.92) / ((r1 - r0 + 1) * base)));
        const next = z <= 1.01 ? { z: 1, ox: 0, oy: 0 } : clamp(z, VW / 2 - ((c0 + c1 + 1) / 2) * base * z, VH / 2 - ((r0 + r1 + 1) / 2) * base * z);
        const c = camRef.current;
        if (Math.abs(c.z - next.z) < 0.001 && Math.abs(c.ox - next.ox) < 0.5 && Math.abs(c.oy - next.oy) < 0.5) return resolve();
        camRef.current = next;
        setCam(next);
        setTimeout(resolve, 160); // let the moved grid draw before its cells are measured
      });
    },
  }), [base, G, Ch, VW, VH, p.w, p.h, zMax, focus, clamp]);

  // ── gestures ──
  // "clue": a touch that started on a clue gutter of an unzoomed board — a tap there picks that line (Hint Brush).
  // (Zoomed boards use "pan" for the gutters; a motionless pan is a tap too.)
  const drag = useRef<{ mode: "paint" | "pan" | "clue" | "none"; r0: number; c0: number; x0: number; y0: number; axis: "row" | "col" | null; last: string; ox: number; oy: number }>({
    mode: "none", r0: 0, c0: 0, x0: 0, y0: 0, axis: null, last: "", ox: 0, oy: 0,
  });
  const cellAt = (x: number, y: number) => {
    const c = camRef.current, s = base * c.z;
    return { r: Math.floor((y - Ch - c.oy) / s), c: Math.floor((x - G - c.ox) / s) };
  };
  const inGrid = (x: number, y: number) => x >= G && x < G + VW && y >= Ch && y < Ch + VH;
  /** The line whose clue is under (x, y), or null (corner / outside). */
  const gutterLine = (x: number, y: number): number | null => {
    const c = camRef.current, s = base * c.z;
    if (x < G && y >= Ch && y < Ch + VH) { const r = Math.floor((y - Ch - c.oy) / s); return r >= 0 && r < p.h ? r : null; }
    if (y < Ch && x >= G && x < G + VW) { const k = Math.floor((x - G - c.ox) / s); return k >= 0 && k < p.w ? p.h + k : null; }
    return null;
  };

  const runFrom = (r: number, c: number) => {
    const d = drag.current;
    const rr = Math.max(0, Math.min(p.h - 1, r)), cc = Math.max(0, Math.min(p.w - 1, c));
    const out: number[] = [];
    if (d.axis === "row") { const a = Math.min(d.c0, cc), b = Math.max(d.c0, cc); for (let k = a; k <= b; k++) out.push(d.r0 * p.w + k); if (cc < d.c0) out.reverse(); }
    else if (d.axis === "col") { const a = Math.min(d.r0, rr), b = Math.max(d.r0, rr); for (let k = a; k <= b; k++) out.push(k * p.w + d.c0); if (rr < d.r0) out.reverse(); }
    else out.push(d.r0 * p.w + d.c0);
    return out;
  };

  const begin = (x: number, y: number) => {
    const d = drag.current;
    d.x0 = x; d.y0 = y; d.axis = null; d.last = "";
    if (cb.current.revealed) { d.mode = "none"; return; }
    if (inGrid(x, y)) {
      const { r, c } = cellAt(x, y);
      d.mode = "paint"; d.r0 = Math.max(0, Math.min(p.h - 1, r)); d.c0 = Math.max(0, Math.min(p.w - 1, c));
      setFocus({ r: d.r0, c: d.c0 });
      setPress({ id: ++fxId.current, i: d.r0 * p.w + d.c0 });
      const run = runFrom(d.r0, d.c0);
      d.last = run.join(",");
      cb.current.onStroke("start", run);
    } else if (camRef.current.z > 1.01) {
      d.mode = "pan"; d.ox = camRef.current.ox; d.oy = camRef.current.oy;
    } else d.mode = gutterLine(x, y) != null ? "clue" : "none";
  };
  const update = (x: number, y: number) => {
    const d = drag.current;
    if (d.mode === "pan") { setCam((c) => clamp(c.z, d.ox + x - d.x0, d.oy + y - d.y0)); return; }
    if (d.mode !== "paint") return;
    const dx = x - d.x0, dy = y - d.y0;
    if (!d.axis && Math.hypot(dx, dy) > 8) d.axis = Math.abs(dx) >= Math.abs(dy) ? "row" : "col";
    if (!d.axis) return;
    // The cell under the finger, leaning a little (12% of a cell) in the direction of travel: a finger that has
    // nearly reached the last cell of a run takes it, so drags no longer stop one cell short.
    const c0 = camRef.current, s = base * c0.z;
    const lean = 0.12;
    const fr = (y - Ch - c0.oy) / s, fc = (x - G - c0.ox) / s;
    const r = Math.floor(fr + (d.axis === "col" ? Math.sign(dy) * lean : 0));
    const c = Math.floor(fc + (d.axis === "row" ? Math.sign(dx) * lean : 0));
    const run = runFrom(r, c);
    const key = run.join(",");
    const endCell = run[run.length - 1];
    setFocus({ r: Math.floor(endCell / p.w), c: endCell % p.w });
    setCounter(run.length > 1 ? { n: run.length, x, y } : null);
    if (key === d.last) return;
    d.last = key;
    ripple(endCell);
    cb.current.onStroke("move", run);
  };
  const finish = (x: number, y: number) => {
    const d = drag.current;
    const tap = Math.hypot(x - d.x0, y - d.y0) < 10;
    const onClueTap = cb.current.onClueTap;
    if (d.mode === "paint") {
      // The last onUpdate can lag the lift-off point: extend the run to where the finger actually left the glass.
      update(x, y);
      cb.current.onStroke("end", []);
    } else if (tap && (d.mode === "clue" || d.mode === "pan") && onClueTap) {
      // A tap on a clue gutter picks that line — judged where the finger went down (immune to lift-off jitter).
      const line = gutterLine(d.x0, d.y0);
      if (line != null) onClueTap(line);
    }
    setCounter(null);
    setPress(null);
    d.mode = "none";
  };

  const pinch0 = useRef({ z: 1, ox: 0, oy: 0, fx: 0, fy: 0 });
  const gesture = useMemo(() => {
    // The stroke starts on touch-down (onBegin), not on activation: a short, motionless tap never activates a pan
    // on some devices, and it must still ink its cell. onFinalize closes the stroke whichever way the touch ended.
    const paint = Gesture.Pan()
      .runOnJS(true)
      .minDistance(0)
      .maxPointers(1)
      .onBegin((e) => begin(e.x, e.y))
      .onUpdate((e) => update(e.x, e.y))
      // Every touch mode (paint, pan, clue) ends here — a clue tap must reach finish() to call onClueTap.
      .onFinalize((e) => { if (drag.current.mode !== "none") finish(e.x, e.y); });
    const pinch = Gesture.Pinch()
      .runOnJS(true)
      .onStart((e) => {
        if (drag.current.mode === "paint") { cb.current.onStroke("cancel", []); drag.current.mode = "none"; setCounter(null); setPress(null); }
        const c = camRef.current;
        pinch0.current = { z: c.z, ox: c.ox, oy: c.oy, fx: e.focalX, fy: e.focalY };
      })
      .onUpdate((e) => {
        const s0 = pinch0.current;
        const z = Math.max(1, Math.min(zMax, s0.z * e.scale));
        // Keep the picture point under the fingers under the fingers (zoom + two-finger pan in one).
        const px = (s0.fx - G - s0.ox) / (base * s0.z), py = (s0.fy - Ch - s0.oy) / (base * s0.z);
        setCam(clamp(z, e.focalX - G - px * base * z, e.focalY - Ch - py * base * z));
      });
    return Gesture.Simultaneous(paint, pinch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, base, G, Ch, VW, VH, zMax, clamp]);

  // ── drawing (all derived from `cells`) ──
  const colored = p.palette.length > 1 || p.palette[0] !== INK;
  const paperCol = skin?.paper ?? palette.paper;
  const inkCol = !colored && skin ? skin.ink : INK;
  const done = useMemo(() => {
    const out: string[] = [];
    for (let l = 0; l < p.w + p.h; l++) out.push(clueDone(p, cells, l).map((d) => (d ? "1" : "0")).join(""));
    return out;
  }, [p, cells]);

  const draw = useMemo(() => {
    const s = cell, ox = G + cam.ox, oy = Ch + cam.oy;
    const pad = Math.max(1, s * 0.07);
    const inkSprites: ReturnType<typeof Skia.XYWHRect>[] = [], inkXf: ReturnType<typeof Skia.RSXform>[] = [];
    const xSprites: typeof inkSprites = [], xXf: typeof inkXf = [];
    const dSprites: typeof inkSprites = [], dXf: typeof inkXf = [];
    const colorPaths = p.palette.map(() => Skia.PathBuilder.Make());
    const gloss = Skia.PathBuilder.Make(), edge = Skia.PathBuilder.Make(), glyphs = Skia.PathBuilder.Make(), rim = Skia.PathBuilder.Make();
    const voids = Skia.PathBuilder.Make(), stampX = Skia.PathBuilder.Make(), stampDots = Skia.PathBuilder.Make();
    const fillW = imgFill?.width() ?? 511, xW = imgX?.width() ?? 510, dW = imgDot?.width() ?? 512;
    const c0 = Math.max(0, Math.floor(-cam.ox / s)), c1 = Math.min(p.w - 1, Math.ceil((VW - cam.ox) / s));
    const r0 = Math.max(0, Math.floor(-cam.oy / s)), r1 = Math.min(p.h - 1, Math.ceil((VH - cam.oy) / s));
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
      const i = r * p.w + c, v = cells[i];
      const x = ox + c * s, y = oy + r * s;
      if (p.void[i]) { voids.addRect(Skia.XYWHRect(x, y, s, s)); continue; }
      if (v > 0) {
        const col = p.palette[v - 1] ?? INK;
        if (col === INK && inkCol === INK) {
          const k = (s - pad * 2) / fillW;
          inkSprites.push(Skia.XYWHRect(0, 0, fillW, imgFill?.height() ?? 512));
          inkXf.push(Skia.RSXform(k, 0, x + pad, y + pad));
        } else {
          colorPaths[v - 1].addRRect(Skia.RRectXY(Skia.XYWHRect(x + pad, y + pad, s - pad * 2, s - pad * 2), s * 0.14, s * 0.14));
          // A dark rim: even pale colours read as "painted" against the paper at a glance (value, not just hue).
          rim.addRRect(Skia.RRectXY(Skia.XYWHRect(x + pad, y + pad, s - pad * 2, s - pad * 2), s * 0.14, s * 0.14));
          gloss.addRRect(Skia.RRectXY(Skia.XYWHRect(x + pad * 2, y + pad * 1.6, s - pad * 4, (s - pad * 2) * 0.3), s * 0.1, s * 0.1));
          edge.addRect(Skia.XYWHRect(x + pad * 1.5, y + s - pad - s * 0.1, s - pad * 3, s * 0.1));
        }
        if (opts.patterns) glyphPath(v, x, y, s, glyphs);
        if (p.given[i]) stampDots.addCircle(x + s * 0.8, y + s * 0.2, Math.max(1.2, s * 0.06));
      } else if (v === X) {
        if (p.given[i]) {
          stampX.moveTo(x + s * 0.32, y + s * 0.32); stampX.lineTo(x + s * 0.68, y + s * 0.68);
          stampX.moveTo(x + s * 0.68, y + s * 0.32); stampX.lineTo(x + s * 0.32, y + s * 0.68);
        } else {
          const k = (s * 0.62) / xW;
          xSprites.push(Skia.XYWHRect(0, 0, xW, imgX?.height() ?? 512));
          xXf.push(Skia.RSXform(k, 0, x + s * 0.19, y + s * 0.19));
        }
      } else if (v === DOT) {
        const k = (s * 0.3) / dW;
        dSprites.push(Skia.XYWHRect(0, 0, dW, imgDot?.height() ?? 492));
        dXf.push(Skia.RSXform(k, 0, x + s * 0.35, y + s * 0.35));
      }
    }
    // Grid lines: hairlines per cell, heavier ink every 5 cells.
    const thin = Skia.PathBuilder.Make(), heavy = Skia.PathBuilder.Make();
    for (let c = 0; c <= p.w; c++) { const x = ox + c * s; (c % 5 === 0 || c === p.w ? heavy : thin).moveTo(x, oy).lineTo(x, oy + p.h * s); }
    for (let r = 0; r <= p.h; r++) { const y = oy + r * s; (r % 5 === 0 || r === p.h ? heavy : thin).moveTo(ox, y).lineTo(ox + p.w * s, y); }
    // Void hatch: diagonal strokes so outside-the-frame reads as "not canvas" at a glance.
    const hatch = Skia.PathBuilder.Make();
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
      const i = r * p.w + c;
      if (!p.void[i]) continue;
      const x = ox + c * s, y = oy + r * s;
      hatch.moveTo(x + s * 0.15, y + s * 0.85).lineTo(x + s * 0.85, y + s * 0.15);
    }
    return {
      inkSprites, inkXf, xSprites, xXf, dSprites, dXf,
      colorPaths: colorPaths.map((b) => b.detach()), gloss: gloss.detach(), edge: edge.detach(), glyphs: glyphs.detach(), rim: rim.detach(),
      voids: voids.detach(), hatch: hatch.detach(), stampX: stampX.detach(), stampDots: stampDots.detach(), thin: thin.detach(), heavy: heavy.detach(),
    };
  }, [cells, cam, cell, G, Ch, p, VW, VH, imgFill, imgX, imgDot, opts.patterns, inkCol]);

  const bandColor = "rgba(46,140,138,0.17)";
  const W = G + VW, H = Ch + VH;
  const focusRect = (line: number) => (line < p.h
    ? { x: 0, y: Ch + cam.oy + line * cell, w: W, h: cell }
    : { x: G + cam.ox + (line - p.h) * cell, y: 0, w: cell, h: H });
  const contrast = opts.contrast;
  const gridRect = useMemo(() => Skia.XYWHRect(G, Ch, VW, VH), [G, Ch, VW, VH]);
  const cx0 = G + cam.ox, cy0 = Ch + cam.oy;
  // Tutorial targets still to ink (an inked target reads as plain ink — the two states never look alike).
  const openTargets = useMemo(() => (targetCells ?? []).filter((i) => cells[i] <= 0), [targetCells, cells]);
  const cellX = (i: number) => cx0 + (i % p.w) * cell, cellY = (i: number) => cy0 + Math.floor(i / p.w) * cell;
  // Live "+N" run counter: above the finger when there is room inside the grid, otherwise beside it — it never
  // covers the clue numbers.
  const counterPos = counter ? (() => {
    const cw = 64, chh = 34;
    let left = counter.x - cw / 2, top = counter.y - 64;
    if (top < Ch + 2) {
      top = Math.max(Ch + 2, Math.min(H - chh - 2, counter.y - chh / 2));
      left = counter.x + 40 + cw <= W ? counter.x + 40 : counter.x - 40 - cw;
    }
    return { left: Math.max(G + 2, Math.min(W - cw - 2, left)), top: Math.max(Ch + 2, Math.min(H - chh - 2, top)) };
  })() : null;

  return (
    <RevealShake revealed={!!revealed} style={{ width: W + M + fr * 2, height: H + M + fr * 2 }}>
      <RNImage source={art.board_frame} style={{ position: "absolute", left: 0, top: 0, width: W + M + fr * 2, height: H + M + fr * 2 }} resizeMode="stretch" />
      <View style={[styles.card, { left: fr, top: fr, width: W + M, height: H + M, backgroundColor: paperCol }]}>
        <View ref={container} onLayout={measure} collapsable={false} style={{ width: W, height: H }}>
          <GestureDetector gesture={gesture}>
            <View style={{ width: W, height: H }}>
              {/* Plain-view paper + grid under the Skia canvas: the board's first frames are never a blank cream box
                  while the GPU surface comes up (QA 2026-10-29: "puzzle start shows an empty board with no grid"). */}
              <GridUnderlay w={p.w} h={p.h} G={G} Ch={Ch} VW={VW} VH={VH} ox={cx0} oy={cy0} s={cell} paper={paperCol} contrast={!!contrast} />
              <Canvas style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} pointerEvents="none">
                {/* clue gutters on a parchment strip */}
                <Rect x={0} y={Ch} width={G} height={VH} color="rgba(222,203,160,0.38)" />
                <Rect x={G} y={0} width={VW} height={Ch} color="rgba(222,203,160,0.38)" />
                <Group clip={gridRect}>
                  <Rect x={G} y={Ch} width={VW} height={VH} color={paperCol} />
                  {focus && !revealed ? (
                    <>
                      <Rect x={G} y={Ch + cam.oy + focus.r * cell} width={VW} height={cell} color={bandColor} />
                      <Rect x={G + cam.ox + focus.c * cell} y={Ch} width={cell} height={VH} color={bandColor} />
                    </>
                  ) : null}
                  <Path path={draw.voids} color="#E4D8BE" />
                  <Path path={draw.hatch} color="rgba(122,102,80,0.35)" style="stroke" strokeWidth={Math.max(1, cell * 0.06)} />
                  <Path path={draw.thin} color={contrast ? "#8F7C62" : "#D9C9AA"} style="stroke" strokeWidth={1} />
                  {draw.colorPaths.map((path: SkPath, k: number) => <Path key={k} path={path} color={p.palette[k] === INK ? inkCol : p.palette[k]} />)}
                  <Path path={draw.edge} color="rgba(0,0,0,0.16)" />
                  <Path path={draw.gloss} color="rgba(255,255,255,0.26)" />
                  <Path path={draw.rim} color="rgba(31,42,58,0.55)" style="stroke" strokeWidth={Math.max(1.2, cell * 0.06)} />
                  {imgFill && draw.inkSprites.length ? <Atlas image={imgFill} sprites={draw.inkSprites} transforms={draw.inkXf} /> : null}
                  {imgX && draw.xSprites.length ? <Atlas image={imgX} sprites={draw.xSprites} transforms={draw.xXf} /> : null}
                  {imgDot && draw.dSprites.length ? <Atlas image={imgDot} sprites={draw.dSprites} transforms={draw.dXf} /> : null}
                  <Path path={draw.glyphs} color="rgba(255,255,255,0.78)" />
                  <Path path={draw.stampX} color="rgba(94,90,102,0.55)" style="stroke" strokeWidth={Math.max(1, cell * 0.07)} strokeCap="round" />
                  <Path path={draw.stampDots} color="#E3A83B" />
                  <Path path={draw.heavy} color={contrast ? "#2B2A33" : palette.lineHeavy} style="stroke" strokeWidth={Math.max(1.5, cell * 0.06)} />
                  {/* tap feel (clipped to the grid): drag-head ripples, the inked cell's pop and its ink splash */}
                  {!revealed ? ripples.map((rp) => <Ripple key={rp.id} cx={cellX(rp.i) + cell / 2} cy={cellY(rp.i) + cell / 2} s={cell} />) : null}
                  {!revealed ? fills.map((f) => <FillFx key={f.id} x={cellX(f.i)} y={cellY(f.i)} s={cell} color={f.color} img={imgFill} seed={f.i} cross={f.cross} />) : null}
                </Group>
                {focus && !revealed ? (
                  <>
                    <Group clip={Skia.XYWHRect(0, Ch, G, VH)}><Rect x={0} y={Ch + cam.oy + focus.r * cell} width={G} height={cell} color={bandColor} /></Group>
                    <Group clip={Skia.XYWHRect(G, 0, VW, Ch)}><Rect x={G + cam.ox + focus.c * cell} y={0} width={cell} height={Ch} color={bandColor} /></Group>
                  </>
                ) : null}
                {revealed ? <RevealPaint puzzle={p} hue={hue ?? "#2E8C8A"} ox={cx0} oy={cy0} s={cell} rect={gridRect} /> : null}
                <Rect x={G} y={Ch} width={VW} height={VH} color={contrast ? "#1F2A3A" : palette.lineHeavy} style="stroke" strokeWidth={2} />
              </Canvas>

              {/* Pulsing tutorial / warning rings loop forever, so they get their own small canvas: an endless animation
                  inside the board canvas would re-record every cell sprite and path on the UI thread each frame. */}
              {(openTargets.length || warnCells?.length || press || xWave) && !revealed ? (
                <Canvas style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} pointerEvents="none">
                  <Group clip={gridRect}>
                    {xWave ? xWave.cells.map((c) => <XPop key={`${xWave.id}-${c.i}`} x={cellX(c.i)} y={cellY(c.i)} s={cell} delay={c.d * X_STAGGER} paper={paperCol} img={imgX} />) : null}
                    {openTargets.length ? <TargetCells cells={openTargets} w={p.w} ox={cx0} oy={cy0} s={cell} /> : null}
                    {warnCells?.length ? <CellRings cells={warnCells} w={p.w} ox={cx0} oy={cy0} s={cell} color={palette.coral} width={Math.max(3, cell * 0.1)} /> : null}
                    {press ? <PressCell key={press.id} x={cellX(press.i)} y={cellY(press.i)} s={cell} /> : null}
                  </Group>
                </Canvas>
              ) : null}

              {/* sticky clues: rows move only vertically, columns only horizontally; they stay crisp through the win */}
              <View pointerEvents="none" style={StyleSheet.absoluteFill}>
              <View pointerEvents="none" style={[styles.clip, { left: 0, top: Ch, width: G, height: VH }]}>
                {p.rows.map((rc, r) => (
                  <PopOnDone key={r} done={!revealed && !done[r].includes("0")} style={[styles.rowClue, { top: cam.oy + r * cell, height: cell, width: G - CLUE_GAP - 3 }]}>
                    <ClueRow blocks={rc.blocks} done={done[r]} smudged={rc.smudged} tally={rc.tally} font={font} colored={colored} palette={p.palette} vertical={false} contrast={contrast} greyOut={opts.greyClues && !revealed} />
                  </PopOnDone>
                ))}
              </View>
              <View pointerEvents="none" style={[styles.clip, { left: G, top: 0, width: VW, height: Ch }]}>
                {p.cols.map((cc, c) => (
                  <PopOnDone key={c} done={!revealed && !done[p.h + c].includes("0")} style={[styles.colClue, { left: cam.ox + c * cell, width: cell, height: Ch - CLUE_GAP - 2 }]}>
                    <ClueRow blocks={cc.blocks} done={done[p.h + c]} smudged={cc.smudged} tally={cc.tally} font={font} colored={colored} palette={p.palette} vertical contrast={contrast} greyOut={opts.greyClues && !revealed} slot={cell} />
                  </PopOnDone>
                ))}
              </View>
              </View>

              {G > 26 && Ch > 26 ? (
                <View pointerEvents="none" style={[styles.corner, { width: G, height: Ch }]}>
                  <MiniPreview puzzle={p} cells={cells} maxW={G - 12} maxH={Ch - 12} ink={inkCol} />
                </View>
              ) : null}
              {pickMode && !revealed ? <PickGlow G={G} Ch={Ch} VW={VW} VH={VH} /> : null}
              {focusLine != null && !revealed ? (
                <View pointerEvents="none" style={[styles.focusLine, (() => { const f = focusRect(focusLine); return { left: f.x, top: f.y, width: f.w, height: f.h }; })()]} />
              ) : null}
              {flash && !revealed ? flash.lines.map((l) => {
                // The sweep runs over the grid only — the clue numbers stay clear and readable.
                const f = focusRect(l);
                const g = l < p.h ? { x: G, y: f.y, w: VW, h: f.h } : { x: f.x, y: Ch, w: f.w, h: VH };
                return <Sweep key={`${flash.n}-${l}`} x={g.x} y={g.y} w={g.w} h={g.h} />;
              }) : null}
              {/* the ink bloom spreads inside the grid only (clipped) — never over the clue gutters */}
              {bloom && !revealed ? (
                <View pointerEvents="none" style={[styles.clip, { left: G, top: Ch, width: VW, height: VH }]}>
                  <Bloom key={bloom.n} x={cellX(bloom.i) - G + cell / 2} y={cellY(bloom.i) - Ch + cell / 2} size={cell} color={bloom.color} />
                </View>
              ) : null}
              {counter && counterPos ? (
                <View pointerEvents="none" style={[styles.counter, counterPos]}>
                  <CounterText n={counter.n} />
                </View>
              ) : null}
            </View>
          </GestureDetector>
        </View>
      </View>
      {/* line-complete ticks pop on the oak frame beside their line, never on top of the clue numbers */}
      {flash && !revealed ? flash.lines.map((l, k) => {
        const vis = l < p.h ? Ch + cam.oy + l * cell + cell / 2 : G + cam.ox + (l - p.h) * cell + cell / 2;
        if (l < p.h ? vis < Ch || vis > H : vis < G || vis > W) return null;
        const t = Math.max(10, Math.min(20, fr * 1.15));
        return <LineTick key={`t${flash.n}-${l}`} x={l < p.h ? fr / 2 : fr + vis} y={l < p.h ? fr + vis : fr / 2} size={t} delay={k * 70} />;
      }) : null}
    </RevealShake>
  );
});

/** A clue that just became fully satisfied pops (1 → 1.28 → 1) — every finished line is a small, visible reward. */
function PopOnDone({ done, style, children }: { done: boolean; style: object[]; children: React.ReactNode }) {
  const k = useSharedValue(1);
  const prev = useRef(done);
  useEffect(() => {
    if (done && !prev.current) k.value = withSequence(withTiming(1.28, { duration: 110, easing: Easing.out(Easing.quad) }), withSpring(1, { damping: 7, stiffness: 260 }));
    prev.current = done;
  }, [done, k]);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: k.value }] }));
  // A teal flash behind the clue as it seals (fades with the pop).
  const fl = useAnimatedStyle(() => ({ opacity: Math.max(0, Math.min(1, (k.value - 1) / 0.28)) * 0.9 }));
  return (
    <Animated.View style={[...style, st]}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.clueFlash, fl]} />
      {children}
    </Animated.View>
  );
}

/**
 * Win hit: after a short hit-pause the board gives one small shake; once the colour wave has landed the whole framed
 * painting pops (1 → 1.04 → 1) while a warm flash washes over it and the gilt frame glows — the climax before the card.
 */
function RevealShake({ revealed, style, children }: { revealed: boolean; style: { width: number; height: number }; children: React.ReactNode }) {
  const x = useSharedValue(0), y = useSharedValue(0), pop = useSharedValue(0), glow = useSharedValue(0);
  useEffect(() => {
    if (!revealed) return;
    const d = REVEAL.pause;
    x.value = withDelay(d, withSequence(withTiming(3.5, { duration: 35 }), withTiming(-3, { duration: 45 }), withTiming(2, { duration: 45 }), withTiming(-1, { duration: 45 }), withTiming(0, { duration: 40 })));
    y.value = withDelay(d, withSequence(withTiming(-2, { duration: 40 }), withTiming(1.5, { duration: 50 }), withTiming(-0.5, { duration: 50 }), withTiming(0, { duration: 50 })));
    pop.value = withDelay(REVEAL_MS - 40, withSequence(withTiming(1, { duration: 120, easing: Easing.out(Easing.quad) }), withSpring(0, { damping: 7, stiffness: 200 })));
    glow.value = withDelay(REVEAL_MS - 40, withSequence(withTiming(1, { duration: 120 }), withTiming(0, { duration: 700, easing: Easing.out(Easing.quad) })));
  }, [revealed, x, y, pop, glow]);
  const st = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { translateY: y.value }, { scale: 1 + 0.04 * pop.value }] }));
  const flashSt = useAnimatedStyle(() => ({ opacity: 0.38 * glow.value }));
  const rimSt = useAnimatedStyle(() => ({ opacity: glow.value }));
  return (
    <Animated.View style={[style, st]}>
      {children}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.winFlash, flashSt]} />
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.winRim, rimSt]} />
    </Animated.View>
  );
}

/** Ink bloom: a drop of ink soaks into the cell that was just filled (it grows to the cell's own size, never past it). */
function Bloom({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }); }, [t]);
  const st = useAnimatedStyle(() => ({ opacity: 0.55 * (1 - t.value), transform: [{ scale: 0.5 + t.value * 0.5 }] }));
  const d = size;
  return <Animated.Image pointerEvents="none" source={art.fx_ink_bloom} style={[{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, tintColor: color }, st]} />;
}


/**
 * One mark's feel, drawn in the board's Skia canvas over the real cell (which the board already shows from `cells`).
 * Everything stays INSIDE the touched cell — nothing spills onto neighbours, so a dragged run never leaves ghost rings
 * over the cells around it: the tile pops 1.0 → 1.14 → 1.0 (~150 ms) with a white gloss flash, and a thin rim of the
 * ink colour hugs the cell edge and fades (~360 ms). A ✕ gets the same pop with a terracotta rim.
 */
function FillFx({ x, y, s, color, img, cross }: { x: number; y: number; s: number; color: string; img: SkImageT | null; seed: number; cross?: boolean }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withTiming(1, { duration: FILL_FX_MS, easing: Easing.linear }); }, [t]);
  const pad = Math.max(1, s * 0.07);
  const cx = x + s / 2, cy = y + s / 2;
  const popXf = useDerivedValue(() => {
    const ms = t.value * FILL_FX_MS;
    const k = ms < 60 ? 1 + 0.14 * (ms / 60) : ms < 150 ? 1.14 - 0.16 * ((ms - 60) / 90) : ms < 200 ? 0.98 + 0.02 * ((ms - 150) / 50) : 1;
    return [{ translateX: cx }, { translateY: cy }, { scale: k }, { translateX: -cx }, { translateY: -cy }];
  });
  const popOp = useDerivedValue(() => (t.value * FILL_FX_MS < 205 ? 1 : 0));
  const glossOp = useDerivedValue(() => Math.max(0, 0.55 * (1 - (t.value * FILL_FX_MS) / 200)));
  const rimOp = useDerivedValue(() => (cross ? 0.55 : 0.75) * (1 - t.value));
  const rimW = Math.max(1.5, s * 0.08);
  const ink = color === INK ? "#1F2A3A" : color;
  return (
    <>
      {!cross ? (
        <Group transform={popXf} opacity={popOp}>
          {color === INK && img
            ? <SkImage image={img} x={x + pad} y={y + pad} width={s - pad * 2} height={s - pad * 2} fit="fill" />
            : <RoundedRect x={x + pad} y={y + pad} width={s - pad * 2} height={s - pad * 2} r={s * 0.14} color={color} />}
          <RoundedRect x={x + pad} y={y + pad} width={s - pad * 2} height={s - pad * 2} r={s * 0.14} color="#FFFFFF" opacity={glossOp} />
        </Group>
      ) : null}
      <RoundedRect x={x + rimW / 2} y={y + rimW / 2} width={s - rimW} height={s - rimW} r={s * 0.16} color={cross ? palette.coral : ink} style="stroke" strokeWidth={rimW} opacity={rimOp} />
    </>
  );
}

/** Drag trail: the cell under the drag head glows teal for a moment (inside its own square — no spreading ring). */
function Ripple({ cx, cy, s }: { cx: number; cy: number; s: number }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withTiming(1, { duration: RIPPLE_MS, easing: Easing.out(Easing.quad) }); }, [t]);
  const op = useDerivedValue(() => 0.35 * (1 - t.value));
  const pad = Math.max(2, s * 0.1);
  return <RoundedRect x={cx - s / 2 + pad} y={cy - s / 2 + pad} width={s - pad * 2} height={s - pad * 2} r={s * 0.16} color={palette.primary} opacity={op} />;
}

/** Pulsing rounded rings on a set of cells (tutorial target in teal, a wrong ink in coral). */
function CellRings({ cells, w, ox, oy, s, color, width }: { cells: number[]; w: number; ox: number; oy: number; s: number; color: string; width: number }) {
  const t = useSharedValue(0.35);
  useEffect(() => {
    t.value = withRepeat(withSequence(withTiming(1, { duration: 520, easing: Easing.inOut(Easing.sin) }), withTiming(0.35, { duration: 520, easing: Easing.inOut(Easing.sin) })), -1);
  }, [t]);
  const key = cells.join(",");
  const path = useMemo(() => {
    const b = Skia.PathBuilder.Make();
    const inset = Math.max(1.5, width / 2 + 0.5);
    for (const i of cells) b.addRRect(Skia.RRectXY(Skia.XYWHRect(ox + (i % w) * s + inset, oy + Math.floor(i / w) * s + inset, s - inset * 2, s - inset * 2), s * 0.16, s * 0.16));
    return b.detach();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, w, ox, oy, s, width]);
  return <Path path={path} color={color} style="stroke" strokeWidth={width} opacity={t} />;
}

/**
 * Tutorial target cells: each its own inset, rounded teal tile (light tint + thin border, a clear gap to its
 * neighbours) that breathes gently — a row of targets reads as separate cells, never one fused outline.
 */
function TargetCells({ cells, w, ox, oy, s }: { cells: number[]; w: number; ox: number; oy: number; s: number }) {
  const t = useSharedValue(0.45);
  useEffect(() => {
    t.value = withRepeat(withSequence(withTiming(1, { duration: 600, easing: Easing.inOut(Easing.sin) }), withTiming(0.45, { duration: 600, easing: Easing.inOut(Easing.sin) })), -1);
  }, [t]);
  const key = cells.join(",");
  const path = useMemo(() => {
    const b = Skia.PathBuilder.Make();
    const inset = Math.max(3, s * 0.12);
    for (const i of cells) b.addRRect(Skia.RRectXY(Skia.XYWHRect(ox + (i % w) * s + inset, oy + Math.floor(i / w) * s + inset, s - inset * 2, s - inset * 2), s * 0.14, s * 0.14));
    return b.detach();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, w, ox, oy, s]);
  return (
    <>
      <Path path={path} color="rgba(46,140,138,0.2)" />
      <Path path={path} color={palette.primary} style="stroke" strokeWidth={Math.max(1.5, s * 0.05)} opacity={t} />
    </>
  );
}

/** Touch-down: the cell under the finger sinks (squashes to ~0.86 in 60 ms, darkens, teal rim) while the finger is down. */
function PressCell({ x, y, s }: { x: number; y: number; s: number }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withTiming(1, { duration: 60, easing: Easing.out(Easing.quad) }); }, [t]);
  const cx = x + s / 2, cy = y + s / 2;
  const xf = useDerivedValue(() => {
    const k = 1 - 0.14 * t.value;
    return [{ translateX: cx }, { translateY: cy }, { scale: k }, { translateX: -cx }, { translateY: -cy }];
  });
  const pad = Math.max(1, s * 0.06);
  return (
    <Group transform={xf}>
      <RoundedRect x={x + pad} y={y + pad} width={s - pad * 2} height={s - pad * 2} r={s * 0.16} color="rgba(31,42,58,0.2)" />
      <RoundedRect x={x + pad} y={y + pad} width={s - pad * 2} height={s * 0.18} r={s * 0.12} color="rgba(31,42,58,0.18)" />
      <RoundedRect x={x + pad} y={y + pad} width={s - pad * 2} height={s - pad * 2} r={s * 0.16} color={palette.primary} style="stroke" strokeWidth={Math.max(2, s * 0.07)} />
    </Group>
  );
}

/** One auto-✕ of the cascade: paper hides it until its turn, then the ✕ pops in (0.4 → 1.18 → 1). */
function XPop({ x, y, s, delay, paper, img }: { x: number; y: number; s: number; delay: number; paper: string; img: SkImageT | null }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withTiming(1, { duration: delay + X_POP_MS, easing: Easing.linear }); }, [t, delay]);
  const total = delay + X_POP_MS;
  const coverOp = useDerivedValue(() => (t.value * total < delay ? 1 : 0));
  const popOp = useDerivedValue(() => (t.value * total >= delay && t.value < 1 ? 1 : 0));
  const cx = x + s / 2, cy = y + s / 2;
  const xf = useDerivedValue(() => {
    const u = Math.max(0, Math.min(1, (t.value * total - delay) / X_POP_MS));
    const k = u < 0.55 ? 0.4 + (1.18 - 0.4) * (u / 0.55) : 1.18 - 0.18 * ((u - 0.55) / 0.45);
    return [{ translateX: cx }, { translateY: cy }, { scale: k }, { translateX: -cx }, { translateY: -cy }];
  });
  const inset = 1;
  return (
    <>
      <Rect x={x + inset} y={y + inset} width={s - inset * 2} height={s - inset * 2} color={paper} opacity={coverOp} />
      {img ? (
        <Group transform={xf} opacity={popOp}>
          <Rect x={x + inset} y={y + inset} width={s - inset * 2} height={s - inset * 2} color={paper} />
          <SkImage image={img} x={x + s * 0.19} y={y + s * 0.19} width={s * 0.62} height={s * 0.62} fit="fill" />
        </Group>
      ) : null}
    </>
  );
}

/**
 * The clue corner's live preview: the canvas at its true aspect — paper with a faint grid — where every inked cell is
 * a picture pixel. Blank, it still reads as "your painting so far", never as an empty box or a stray dot.
 */
/** The board's paper, gutters and grid lines as plain views (drawn by the native view system in the very first frame). */
const GridUnderlay = memo(function GridUnderlay({ w, h, G, Ch, VW, VH, ox, oy, s, paper, contrast }: {
  w: number; h: number; G: number; Ch: number; VW: number; VH: number; ox: number; oy: number; s: number; paper: string; contrast: boolean;
}) {
  const thin = contrast ? "#8F7C62" : "#D9C9AA", heavy = contrast ? "#2B2A33" : palette.lineHeavy;
  const hw = Math.max(1.5, s * 0.06);
  const lines: React.ReactNode[] = [];
  for (let c = 1; c < w; c++) {
    const x = ox + c * s - G, major = c % 5 === 0;
    if (x <= 0 || x >= VW) continue;
    lines.push(<View key={`c${c}`} style={{ position: "absolute", left: x - (major ? hw / 2 : 0.5), top: 0, width: major ? hw : 1, height: VH, backgroundColor: major ? heavy : thin }} />);
  }
  for (let r = 1; r < h; r++) {
    const y = oy + r * s - Ch, major = r % 5 === 0;
    if (y <= 0 || y >= VH) continue;
    lines.push(<View key={`r${r}`} style={{ position: "absolute", top: y - (major ? hw / 2 : 0.5), left: 0, height: major ? hw : 1, width: VW, backgroundColor: major ? heavy : thin }} />);
  }
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={{ position: "absolute", left: 0, top: Ch, width: G, height: VH, backgroundColor: "rgba(222,203,160,0.38)" }} />
      <View style={{ position: "absolute", left: G, top: 0, width: VW, height: Ch, backgroundColor: "rgba(222,203,160,0.38)" }} />
      <View style={{ position: "absolute", left: G, top: Ch, width: VW, height: VH, backgroundColor: paper, overflow: "hidden", borderWidth: 2, borderColor: contrast ? "#1F2A3A" : palette.lineHeavy }}>
        {lines}
      </View>
    </View>
  );
});

const MiniPreview = memo(function MiniPreview({ puzzle: p, cells, maxW, maxH, ink }: { puzzle: Puzzle; cells: number[]; maxW: number; maxH: number; ink: string }) {
  const px = Math.max(1, Math.floor(Math.min((maxW - 6) / p.w, (maxH - 6) / p.h)));
  const w = px * p.w, h = px * p.h;
  const drawn = useMemo(() => {
    const grid = Skia.PathBuilder.Make();
    if (px >= 3) {
      for (let c = 1; c < p.w; c++) grid.moveTo(c * px + 0.5, 0).lineTo(c * px + 0.5, h);
      for (let r = 1; r < p.h; r++) grid.moveTo(0, r * px + 0.5).lineTo(w, r * px + 0.5);
    }
    const byCol = p.palette.map(() => Skia.PathBuilder.Make());
    cells.forEach((v, i) => { if (v > 0 && byCol[v - 1]) byCol[v - 1].addRect(Skia.XYWHRect((i % p.w) * px, Math.floor(i / p.w) * px, px, px)); });
    const voids = Skia.PathBuilder.Make();
    p.void.forEach((v, i) => { if (v) voids.addRect(Skia.XYWHRect((i % p.w) * px, Math.floor(i / p.w) * px, px, px)); });
    return { grid: grid.detach(), inks: byCol.map((b) => b.detach()), voids: voids.detach() };
  }, [p, cells, px, w, h]);
  if (px < 1 || w < 8 || h < 8) return null;
  return (
    <View style={[styles.cornerCard, { width: w + 6, height: h + 6 }]}>
      <Canvas style={{ width: w, height: h }}>
        <Rect x={0} y={0} width={w} height={h} color="#FFFBF0" />
        <Path path={drawn.voids} color="#E4D8BE" />
        <Path path={drawn.grid} color="rgba(122,102,80,0.3)" style="stroke" strokeWidth={1} />
        {drawn.inks.map((path, k) => <Path key={k} path={path} color={p.palette[k] === INK ? ink : p.palette[k]} />)}
      </Canvas>
    </View>
  );
});

/** "+N" that bumps every time the run grows by a cell. */
function CounterText({ n }: { n: number }) {
  const s = useSharedValue(1);
  useEffect(() => { s.value = withSequence(withTiming(1.22, { duration: 70 }), withSpring(1, { damping: 9, stiffness: 300 })); }, [n, s]);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return <Animated.Text style={[styles.counterText, st]}>+{n}</Animated.Text>;
}

/** A satisfied clue line gets a teal tick that pops on the oak frame at the outer edge of its gutter (clear of the numbers). */
function LineTick({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withSequence(withSpring(1, { damping: 8, stiffness: 260 }), withDelay(420, withTiming(2, { duration: 280 }))));
  }, [t, delay]);
  const st = useAnimatedStyle(() => ({
    opacity: t.value <= 1 ? Math.min(1, t.value * 1.5) : 2 - t.value,
    transform: [{ scale: t.value <= 1 ? 0.4 + 0.6 * t.value : 1 + (t.value - 1) * 0.1 }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[styles.tick, { left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size / 2 }, st]}>
      <Text style={[styles.tickText, { fontSize: size * 0.62 }]}>✓</Text>
    </Animated.View>
  );
}

/**
 * A finished line: a teal wash flashes over it while a bright shine band travels along it from the clue outwards —
 * the line visibly "seals". (Runs over the grid only; the clue numbers stay readable.)
 */
function Sweep({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const t = useSharedValue(0);
  const run = useSharedValue(0);
  useEffect(() => {
    t.value = withSequence(withTiming(1, { duration: 120 }), withDelay(160, withTiming(0, { duration: 380 })));
    run.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) });
  }, [t, run]);
  const horiz = w >= h;
  const len = horiz ? w : h, band = Math.max(28, (horiz ? h : w) * 1.6);
  const wash = useAnimatedStyle(() => ({ opacity: t.value }));
  const shine = useAnimatedStyle(() => {
    const d = -band + run.value * (len + band);
    return { opacity: run.value < 1 ? 1 : 0, transform: horiz ? [{ translateX: d }] : [{ translateY: d }] };
  });
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: 3 }}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(46,140,138,0.3)" }, wash]} />
      <Animated.View style={[{ position: "absolute", left: 0, top: 0 }, horiz ? { width: band, height: h } : { width: w, height: band }, shine]}>
        <Gradient start={horiz ? { x: 0, y: 0.5 } : { x: 0.5, y: 0 }} end={horiz ? { x: 1, y: 0.5 } : { x: 0.5, y: 1 }} colors={["rgba(255,250,230,0)", "rgba(255,250,230,0.85)", "rgba(255,250,230,0)"]} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

/** Hint picker: both clue gutters glow gold and keep pulsing while the picker is open — "tap a clue". */
function PickGlow({ G, Ch, VW, VH }: { G: number; Ch: number; VW: number; VH: number }) {
  const t = useSharedValue(0.3);
  useEffect(() => {
    t.value = withRepeat(withSequence(withTiming(1, { duration: 520, easing: Easing.inOut(Easing.sin) }), withTiming(0.35, { duration: 520, easing: Easing.inOut(Easing.sin) })), -1);
  }, [t]);
  const st = useAnimatedStyle(() => ({ opacity: t.value }));
  return (
    <>
      <Animated.View pointerEvents="none" style={[styles.pick, { left: 0, top: Ch, width: G, height: VH }, st]} />
      <Animated.View pointerEvents="none" style={[styles.pick, { left: G, top: 0, width: VW, height: Ch }, st]} />
    </>
  );
}

/**
 * One diagonal of the reveal wave. Its cells wash to a clean paper mat (covering the player's ✕ marks and the
 * hairlines) and its painted tiles land in the SAME frame — each diagonal switches from "board" to "painting" at
 * once, so no frame ever shows a half-faded tile. Tiles never move or scale (a scaled row of tiles would slide off
 * its cells); the landing reads through a gloss flash on the tiles that settles back to a soft sheen.
 */
function RevealDiag({ k, D, wave, wash, washColor, paints, lip, gloss }: {
  k: number; D: number; wave: SharedValue<number>; wash: SkPath; washColor: string; paints: { c: string; path: SkPath }[]; lip: SkPath; gloss: SkPath;
}) {
  const start = (k / Math.max(1, D - 1)) * 0.95;
  // Binary: a diagonal is either still the board or already the painting — never a half-transparent mix.
  const on = useDerivedValue(() => (wave.value > start ? 1 : 0));
  // Gloss: flashes bright as the diagonal lands, then settles to the resting sheen.
  const glossOp = useDerivedValue(() => {
    const u = (wave.value - start) / 0.16;
    if (u <= 0) return 0;
    return u >= 1 ? 0.24 : 0.24 + 0.5 * Math.sin(Math.min(1, u) * Math.PI);
  });
  return (
    <Group opacity={on}>
      <Path path={wash} color={washColor} />
      {paints.map((pp) => <Path key={pp.c} path={pp.path} color={pp.c} />)}
      <Path path={lip} color="rgba(20,24,36,0.22)" />
      <Path path={gloss} color="#FFFFFF" opacity={glossOp} />
    </Group>
  );
}

/** A gold twinkle that keeps sparkling on the finished painting (four-point star, scale + fade loop). */
function Twinkle({ x, y, r, delay }: { x: number; y: number; r: number; delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 520, easing: Easing.in(Easing.quad) }), withTiming(0, { duration: 700 })), 5));
  }, [t, delay]);
  const path = useMemo(() => {
    const b = Skia.PathBuilder.Make();
    b.moveTo(x, y - r); b.quadTo(x, y, x + r, y); b.quadTo(x, y, x, y + r); b.quadTo(x, y, x - r, y); b.quadTo(x, y, x, y - r); b.close();
    return b.detach();
  }, [x, y, r]);
  const xf = useDerivedValue(() => [{ translateX: x }, { translateY: y }, { scale: 0.3 + 0.7 * t.value }, { translateX: -x }, { translateY: -y }]);
  return <Path path={path} color="#FFE7A3" opacity={t} transform={xf} />;
}

/**
 * Win reveal on the board's own canvas, at the board's own camera (so cells, clues and frame stay exactly aligned):
 * a warm light sweep crosses the grid (clipped to it), then the finished picture lands cell by cell along a diagonal
 * wave — inked outlines and island-hue washes (paintedColors) as separate rounded tiles on a clean paper mat — and a
 * gold-leaf shimmer runs across the finished painting.
 */
function RevealPaint({ puzzle, hue, ox, oy, s, rect }: { puzzle: Puzzle; hue: string; ox: number; oy: number; s: number; rect: SkRect }) {
  const wave = useSharedValue(0), sweep = useSharedValue(0), shimmer = useSharedValue(0);
  useEffect(() => {
    sweep.value = withDelay(REVEAL.sweepAt, withTiming(1, { duration: REVEAL.sweepMs, easing: Easing.inOut(Easing.quad) }));
    wave.value = withDelay(REVEAL.waveAt, withTiming(1, { duration: REVEAL.waveMs, easing: Easing.linear }));
    // Gold-leaf shimmer: crosses the finished painting a few times (~2 s apart). Finite: an endless loop here would
    // re-record the whole board canvas on the UI thread every frame for as long as the win card is open.
    shimmer.value = withDelay(REVEAL.waveAt + REVEAL.waveMs - 120, withRepeat(withSequence(withTiming(1, { duration: 760, easing: Easing.inOut(Easing.quad) }), withTiming(1, { duration: 1300 }), withTiming(0, { duration: 0 })), 4));
  }, [wave, sweep, shimmer]);
  const D = puzzle.w + puzzle.h - 1;
  const diags = useMemo(() => {
    const cols = paintedColors(puzzle, hue);
    const g = Math.max(1, Math.round(s * 0.07));
    const rad = s * 0.16;
    const out = Array.from({ length: D }, () => ({
      wash: Skia.PathBuilder.Make(), lip: Skia.PathBuilder.Make(), gloss: Skia.PathBuilder.Make(),
      by: new Map<string, ReturnType<typeof Skia.PathBuilder.Make>>(),
    }));
    cols.forEach((c, i) => {
      if (puzzle.void[i]) return;
      const r = Math.floor(i / puzzle.w), col = i % puzzle.w, d = out[r + col];
      const x = ox + col * s, y = oy + r * s;
      d.wash.addRect(Skia.XYWHRect(x, y, s, s));
      if (!c) return;
      if (!d.by.has(c)) d.by.set(c, Skia.PathBuilder.Make());
      const tw = s - g * 2;
      d.by.get(c)!.addRRect(Skia.RRectXY(Skia.XYWHRect(x + g, y + g, tw, tw), rad, rad));
      d.lip.addRRect(Skia.RRectXY(Skia.XYWHRect(x + g, y + g + tw * 0.8, tw, tw * 0.2), rad * 0.6, rad * 0.6));
      d.gloss.addRRect(Skia.RRectXY(Skia.XYWHRect(x + g * 2, y + g * 1.6, tw - g * 2, tw * 0.26), rad * 0.6, rad * 0.6));
    });
    return out.map((d) => ({
      wash: d.wash.detach(), lip: d.lip.detach(), gloss: d.gloss.detach(),
      paints: [...d.by.entries()].map(([c, pb]) => ({ c, path: pb.detach() })),
    }));
  }, [puzzle, hue, ox, oy, s, D]);
  // A few twinkles on painted cells (spread over the picture, fixed per puzzle — never random per render).
  const twinkles = useMemo(() => {
    const ink = puzzle.solution.map((v, i) => (v > 0 && !puzzle.void[i] ? i : -1)).filter((i) => i >= 0);
    const n = Math.min(6, ink.length);
    return Array.from({ length: n }, (_, j) => {
      const i = ink[Math.floor(((j + 0.5) / n) * ink.length)];
      return { x: ox + (i % puzzle.w) * s + s * 0.72, y: oy + Math.floor(i / puzzle.w) * s + s * 0.28, r: Math.max(5, s * 0.36), d: j * 330 };
    });
  }, [puzzle, ox, oy, s]);
  const bandW = Math.max(60, rect.width * 0.38);
  // A slanted band (skew about the grid's middle row) travelling from fully left of the grid to fully right of it.
  const angle = 0.35, k = Math.tan(angle), slant = (k * rect.height) / 2;
  const x0 = rect.x - bandW - slant - 4, x1 = rect.x + rect.width + slant + 4, cy = rect.y + rect.height / 2;
  const sweepXf = useDerivedValue(() => [{ translateX: x0 + sweep.value * (x1 - x0) + k * cy }, { skewX: -angle }]);
  const sweepOp = useDerivedValue(() => (sweep.value > 0 && sweep.value < 1 ? 1 : 0));
  const shimXf = useDerivedValue(() => [{ translateX: x0 + shimmer.value * (x1 - x0) + k * cy }, { skewX: -angle }]);
  const shimOp = useDerivedValue(() => (shimmer.value > 0 && shimmer.value < 1 ? 1 : 0));
  const washColor = mix(hue, "#FFFBF0", 0.9);
  const narrow = bandW * 0.45;
  return (
    <Group clip={rect}>
      {diags.map((d, k) => (
        <RevealDiag key={k} k={k} D={D} wave={wave} wash={d.wash} washColor={washColor} paints={d.paints} lip={d.lip} gloss={d.gloss} />
      ))}
      <Group transform={sweepXf} opacity={sweepOp}>
        <Rect x={0} y={rect.y - rect.height} width={bandW} height={rect.height * 3}>
          <LinearGradient start={vec(0, 0)} end={vec(bandW, 0)} colors={["rgba(255,244,214,0)", "rgba(255,244,214,0.62)", "rgba(255,244,214,0)"]} />
        </Rect>
      </Group>
      {twinkles.map((tw, k) => <Twinkle key={k} x={tw.x} y={tw.y} r={tw.r} delay={REVEAL.waveAt + REVEAL.waveMs + tw.d} />)}
      <Group transform={shimXf} opacity={shimOp}>
        <Rect x={0} y={rect.y - rect.height} width={narrow} height={rect.height * 3}>
          <LinearGradient start={vec(0, 0)} end={vec(narrow, 0)} colors={["rgba(246,210,122,0)", "rgba(255,236,170,0.55)", "rgba(246,210,122,0)"]} />
        </Rect>
      </Group>
    </Group>
  );
}

const styles = StyleSheet.create({
  card: { position: "absolute", backgroundColor: palette.paper, overflow: "hidden", borderRadius: 3 },
  clip: { position: "absolute", overflow: "hidden" },
  rowClue: { position: "absolute", left: 0, justifyContent: "center", alignItems: "flex-end" },
  colClue: { position: "absolute", top: 0, justifyContent: "flex-end", alignItems: "center" },
  rowStack: { flexDirection: "row", alignItems: "center" },
  colStack: { flexDirection: "column", alignItems: "center" },
  clue: { fontFamily: fonts.body, textAlign: "center", includeFontPadding: false, fontVariant: ["tabular-nums"] },
  cracked: { color: palette.coral },
  ring: { alignItems: "center", justifyContent: "center", backgroundColor: "#FFFBF1" },
  chip: { borderRadius: 4, alignItems: "center", justifyContent: "center", paddingHorizontal: 2 },
  smudgeWrap: { alignItems: "center", justifyContent: "center", marginRight: 2 },
  focusLine: { position: "absolute", borderWidth: 3, borderColor: palette.secondary, borderRadius: 4, backgroundColor: "rgba(227,168,59,0.14)" },
  pick: { position: "absolute", backgroundColor: "rgba(227,168,59,0.22)", borderWidth: 2, borderColor: palette.secondary, borderRadius: 4 },
  corner: { position: "absolute", left: 0, top: 0, alignItems: "center", justifyContent: "center" },
  cornerCard: { padding: 2, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFBF0", borderWidth: 1.5, borderColor: "rgba(122,102,80,0.45)", borderRadius: 3 },
  clueFlash: { backgroundColor: "rgba(46,140,138,0.28)", borderRadius: 6 },
  winFlash: { backgroundColor: "#FFF6DC", borderRadius: 8 },
  winRim: { borderRadius: 10, borderWidth: 5, borderColor: "#F6D27A" },
  tick: { position: "absolute", backgroundColor: palette.primary, borderWidth: 1.5, borderColor: "#FFF8E8", alignItems: "center", justifyContent: "center" },
  tickText: { fontFamily: fonts.display, color: "#fff", includeFontPadding: false },
  counter: { position: "absolute", width: 64, height: 34, borderRadius: 17, backgroundColor: palette.primary, borderWidth: 2, borderColor: palette.primaryDark, alignItems: "center", justifyContent: "center" },
  counterText: { fontFamily: fonts.display, fontSize: 18, color: "#fff", includeFontPadding: false },
});
