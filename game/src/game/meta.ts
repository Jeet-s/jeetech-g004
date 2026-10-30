/**
 * The atelier meta layer: Pigments, Hint Brushes, autosaves, the daily puzzle and its forgiving streak,
 * room renovation, gallery frames and stats. Everything persists through src/modules/store.ts.
 * Nothing here ever gates a puzzle: every level is open from the first launch.
 */
import { useEffect, useState } from "react";
import { store, type DailyState, type Design, type GameOptions, type PlayerState } from "../modules/store";
import { analytics } from "../modules/analytics";
import { ISLANDS, LEVELS, type Level } from "./levels";
import { buildPuzzle, inkProgress, logicSolve, pigmentsFor, starsFor, type Puzzle } from "./nonogram";
import { INK } from "./types";

// ───────────────────────────── hooks ─────────────────────────────

export function usePlayer(): PlayerState {
  const [s, setS] = useState(store.get());
  useEffect(() => store.subscribe(setS), []);
  return s;
}

export const DEFAULT_OPTS: GameOptions = {
  autoX: true, greyClues: true, strikes: false, leftHand: false, dark: false, contrast: false, patterns: false, hideMeta: false, reminders: false,
};
export const optsOf = (s: PlayerState = store.get()): GameOptions => ({ ...DEFAULT_OPTS, ...(s.opts ?? {}) });

export function useSettings(): GameOptions {
  return optsOf(usePlayer());
}

export function setOpt<K extends keyof GameOptions>(k: K, v: GameOptions[K]): void {
  store.set({ opts: { ...optsOf(), [k]: v } });
  analytics.track(k === "hideMeta" ? "meta_hidden_toggle" : "settings_changed", { key: k, value: v as boolean });
}

// ───────────────────────────── days ─────────────────────────────

export function dayKey(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

// ───────────────────────────── currencies ─────────────────────────────

export const FREE_BRUSHES_PER_DAY = 3;
export const WELCOME_PIGMENTS = 60;
export const BRUSH_PACKS = [
  { id: "brush3", brushes: 3, cost: 90 },
  { id: "brush10", brushes: 10, cost: 250 },
];

/** First launch gift + the free daily Hint Brushes (topped up to 3, never taken away). */
export function bootMeta(): void {
  const s = store.get();
  const today = dayKey();
  const patch: Partial<PlayerState> = {};
  if (!s.firstDay) patch.firstDay = today;
  if (!s.welcomed) { patch.welcomed = true; patch.coins = s.coins + WELCOME_PIGMENTS; patch.brushes = FREE_BRUSHES_PER_DAY; patch.brushDay = today; }
  else if (s.brushDay !== today) { patch.brushDay = today; patch.brushes = Math.max(s.brushes ?? 0, FREE_BRUSHES_PER_DAY); }
  if (Object.keys(patch).length) store.set(patch);
}

export const brushesOf = () => store.get().brushes ?? 0;
export function spendBrush(): boolean {
  const b = brushesOf();
  if (b <= 0) return false;
  const st = statsOf();
  store.set({ brushes: b - 1, stats: { ...st, brushesUsed: st.brushesUsed + 1 } });
  return true;
}
export function addBrushes(n: number): void { store.set({ brushes: brushesOf() + n }); }
export function buyBrushes(packId: string): boolean {
  const pack = BRUSH_PACKS.find((p) => p.id === packId);
  if (!pack || store.get().coins < pack.cost) return false;
  store.set({ coins: store.get().coins - pack.cost, brushes: brushesOf() + pack.brushes });
  return true;
}

export const statsOf = () => store.get().stats ?? { solved: 0, pigments: 0, brushesUsed: 0, seconds: 0 };

// ───────────────────────────── what is being played ─────────────────────────────

export type PlayTarget =
  | { kind: "level"; n: number }
  | { kind: "daily"; day: string }
  /** Weekly Exhibition piece k (0..2) of the week starting `week` (a Monday). */
  | { kind: "event"; week: string; k: number }
  /** A Creator Studio design. */
  | { kind: "custom"; id: string };

/** Stable key for a play target (screen keys, autosaves). */
export const targetKey = (t: PlayTarget) =>
  t.kind === "level" ? `level-${t.n}` : t.kind === "daily" ? `daily-${t.day}` : t.kind === "event" ? `event-${t.week}-${t.k}` : `design-${t.id}`;

export interface PlayInfo {
  key: string;
  puzzle: Puzzle;
  title: string;
  subtitle: string;
  level?: Level;
  island: number;
  masterwork: boolean;
  number: number;
}

const DAILY_POOL = LEVELS.filter((l) => l.puzzle.w * l.puzzle.h <= 15 * 15 && !l.spec.smudge?.length && !l.spec.crack?.length && !l.masterwork && l.number > 3);

function hashDay(day: string): number {
  let h = 2166136261;
  for (const c of day) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Today's puzzle: a campaign picture drawn mirror-wise (a new board, same line-logic proof: mirroring keeps every clue's logic). */
export function dailyPuzzle(day: string): { puzzle: Puzzle; base: Level } {
  const base = DAILY_POOL[hashDay(day) % Math.max(1, DAILY_POOL.length)] ?? LEVELS[0];
  const art = base.spec.art.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => l.split("").reverse().join("")).join("\n");
  const puzzle = buildPuzzle({ id: `daily-${day}`, title: base.spec.title, palette: base.spec.palette, art });
  return { puzzle, base };
}

export function playInfo(t: PlayTarget): PlayInfo {
  if (t.kind === "event") {
    const { puzzle, base } = eventPuzzle(t.week, t.k);
    return { key: puzzle.id, puzzle, title: puzzle.title, subtitle: `Exhibition ${t.k + 1}/${EVENT_SIZE} · ${puzzle.w}×${puzzle.h}`, island: base.island, masterwork: false, number: 0 };
  }
  if (t.kind === "custom") {
    const d = designOf(t.id);
    const puzzle = designPuzzle(d ?? { id: t.id, title: "My design", art: "#", created: "" });
    return { key: puzzle.id, puzzle, title: puzzle.title, subtitle: `Your design · ${puzzle.w}×${puzzle.h}`, island: 0, masterwork: false, number: 0 };
  }
  if (t.kind === "daily") {
    const { puzzle, base } = dailyPuzzle(t.day);
    return { key: puzzle.id, puzzle, title: "Daily Puzzle", subtitle: `${puzzle.w}×${puzzle.h} · ${prettyDay(t.day)}`, island: base.island, masterwork: false, number: 0 };
  }
  const level = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, t.n - 1))];
  const isl = ISLANDS[level.island];
  return {
    key: level.spec.id, puzzle: level.puzzle, level, island: level.island, masterwork: level.masterwork, number: level.number,
    title: level.spec.title,
    subtitle: `${level.masterwork ? "Masterwork · " : ""}${level.puzzle.w}×${level.puzzle.h} · ${isl.name}`,
  };
}

export function prettyDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ───────────────────────────── autosave ─────────────────────────────

const enc = (cells: number[]) => cells.map((v) => String.fromCharCode(52 + v)).join("");
const dec = (s: string) => Array.from(s, (c) => c.charCodeAt(0) - 52);

export function loadSave(key: string, n: number): number[] | null {
  const s = store.get().saves?.[key];
  if (!s || s.length !== n) return null;
  return dec(s);
}
export function writeSave(key: string, cells: number[] | null): void {
  const saves = { ...(store.get().saves ?? {}) };
  if (cells) saves[key] = enc(cells);
  else delete saves[key];
  store.set({ saves });
}
export function saveProgress(key: string, p: Puzzle): number {
  const c = loadSave(key, p.w * p.h);
  return c ? inkProgress(p, c) : 0;
}

// ───────────────────────────── progress ─────────────────────────────

export const starsOf = (id: string) => store.get().stars?.[id] ?? 0;
export const isSolved = (id: string) => starsOf(id) > 0;
export const solvedCount = () => LEVELS.filter((l) => isSolved(l.spec.id)).length;
export const totalStars = () => LEVELS.reduce((a, l) => a + starsOf(l.spec.id), 0);
export function islandSolved(k: number): number {
  return LEVELS.filter((l) => l.island === k && isSolved(l.spec.id)).length;
}
export const islandSize = (k: number) => LEVELS.filter((l) => l.island === k).length;

/** The level "Play" continues: the first unsolved level after the furthest one reached, else the first unsolved anywhere. */
export function nextLevel(): number {
  const from = Math.max(1, Math.min(LEVELS.length, store.get().level || 1));
  for (let n = from; n <= LEVELS.length; n++) if (!isSolved(LEVELS[n - 1].spec.id)) return n;
  for (let n = 1; n <= LEVELS.length; n++) if (!isSolved(LEVELS[n - 1].spec.id)) return n;
  return LEVELS.length;
}

export interface Reward {
  stars: number;
  pigments: { base: number; noHint: number; speed: number; total: number };
  brushBonus: number;
  firstSolve: boolean;
  bestStars: number;
  streak?: number;
  frozeDay?: string;
}

/** Book a solved puzzle: stars, Pigments, stats, the daily streak. Returns what the win card shows. */
export function completePuzzle(info: PlayInfo, r: { hints: number; slips: number; seconds: number }, target: PlayTarget): Reward {
  const s = store.get();
  const stars = starsFor(r);
  const firstSolve = !((s.stars?.[info.key] ?? 0) > 0);
  const full = pigmentsFor(info.puzzle, r, info.masterwork);
  // Replays still pay a little, so practising an old favourite never feels wasted. Your own designs pay nothing (no farming).
  const pigments = target.kind === "custom" ? { base: 0, noHint: 0, speed: 0, total: 0 }
    : firstSolve ? full : { base: Math.round(full.base * 0.25), noHint: 0, speed: 0, total: Math.round(full.base * 0.25) };
  const brushBonus = firstSolve && info.masterwork ? 2 : 0;
  const prevBest = s.stars?.[info.key] ?? 0;
  const st = statsOf();
  const patch: Partial<PlayerState> = {
    stars: { ...(s.stars ?? {}), [info.key]: Math.max(prevBest, stars) },
    coins: s.coins + pigments.total,
    brushes: (s.brushes ?? 0) + brushBonus,
    stats: { ...st, solved: st.solved + (firstSolve ? 1 : 0), pigments: st.pigments + pigments.total, seconds: st.seconds + r.seconds },
  };
  if (target.kind === "level") patch.level = Math.max(s.level, info.number + 1);
  // Studio Season: every first solve (campaign, daily, exhibition — never your own designs) moves the free track on.
  if (firstSolve && target.kind !== "custom") { const se = seasonOf(s); patch.season = { id: se.id, solved: se.solved + 1, claimed: se.claimed }; }
  const reward: Reward = { stars, pigments, brushBonus, firstSolve, bestStars: Math.max(prevBest, stars) };
  if (target.kind === "daily" && target.day !== dayKey()) {
    // Catch-up on a missed day this month: the painting and Pigments are recovered; the streak is left as it was.
    const d = s.daily ?? emptyDaily();
    if (!d.done.includes(target.day)) patch.daily = { ...d, done: [...d.done, target.day].slice(-120) };
    analytics.track("daily_puzzle_complete", { catchUp: true });
  } else if (target.kind === "daily") {
    const d = streakAfter(s.daily, target.day);
    patch.daily = d.daily;
    reward.streak = d.daily.streak;
    reward.frozeDay = d.froze;
    analytics.track("daily_puzzle_complete", { streak: d.daily.streak });
    analytics.track("streak_update", { streak: d.daily.streak });
    if (d.froze) analytics.track("streak_freeze_used", {});
  }
  store.set(patch);
  writeSave(info.key, null);
  if (firstSolve && target.kind === "level") analytics.track("artwork_collected", { level: info.number });
  return reward;
}

// ───────────────────────────── daily streak ─────────────────────────────

export const emptyDaily = (): DailyState => ({ streak: 0, best: 0, done: [], frozen: [] });
export const dailyOf = () => store.get().daily ?? emptyDaily();

/** One free Streak Freeze per calendar month bridges a single missed day. */
export function freezeAvailable(d: DailyState, day: string): boolean {
  const month = day.slice(0, 7);
  return !d.frozen.some((f) => f.slice(0, 7) === month);
}

function streakAfter(prev: DailyState | undefined, day: string): { daily: DailyState; froze?: string } {
  const d = prev ?? emptyDaily();
  if (d.done.includes(day)) return { daily: d };
  let streak = 1, froze: string | undefined;
  if (d.last === addDays(day, -1)) streak = d.streak + 1;
  else if (d.last === addDays(day, -2) && freezeAvailable(d, day)) { froze = addDays(day, -1); streak = d.streak + 1; }
  const daily: DailyState = {
    streak, best: Math.max(d.best, streak), last: day,
    done: [...d.done, day].slice(-120), frozen: froze ? [...d.frozen, froze].slice(-24) : d.frozen,
  };
  return { daily, froze };
}

/** The streak as it stands today (a gap a freeze can still bridge keeps it alive). */
export function currentStreak(d: DailyState = dailyOf(), today = dayKey()): number {
  if (!d.last) return 0;
  if (d.last === today || d.last === addDays(today, -1)) return d.streak;
  if (d.last === addDays(today, -2) && freezeAvailable(d, today)) return d.streak;
  return 0;
}

// ───────────────────────────── the atelier (rooms + story) ─────────────────────────────

export interface Room { index: number; name: string; island: string; cost: number; needArt: number; story: { who: "Mina" | "Ostrava"; line: string }[] }

const ROOM_COST = [50, 140, 240, 360, 480, 620, 780, 950, 1150, 1400];
const STORY: [string, string][] = [
  ["The entryway breathes again! Visitors will see your teacup first.", "Every atelier begins with a door left open. Welcome, apprentice."],
  ["Sketches pinned to every beam — the loft smells of graphite.", "A good sketch is a promise. You keep yours."],
  ["The old press is inked and turning. Pigment everywhere — even on my paws.", "Colour is just ink that learned to sing."],
  ["The statues are dusted. One of them looks a bit like me.", "Shape is what remains when you take away the noise."],
  ["Tiles sorted, grout gleaming. The Conservatory catches the morning sun.", "A mosaic forgives one tile — never a careless one."],
  ["The kiln is warm. I've claimed the bench beside it.", "Fire tests the glaze, as clues test the picture."],
  ["Lanterns lit along the gallery. The visitors stay past closing time.", "Light the smallest lantern first; the rest will follow."],
  ["The telescope is aligned. I counted forty stars, then fell asleep.", "Patience is the brush that paints the night."],
  ["Herbs and paint pots on the roof. The view reaches the islands.", "From up here, every puzzle you solved is a window."],
  ["The Grand Exhibit is open. Every frame on these walls is yours.", "You came as an apprentice. You leave as a master of the atelier."],
];

export const ROOMS: Room[] = ISLANDS.map((isl, k) => ({
  index: k, name: isl.room, island: isl.name, cost: ROOM_COST[k] ?? 1500,
  // Framed artworks the room needs on its walls: the entryway opens after two pictures, later rooms after a whole island each.
  needArt: k === 0 ? 2 : LEVELS.filter((l) => l.island < k).length + Math.min(2, islandSize(k)),
  story: [{ who: "Mina", line: STORY[k]?.[0] ?? "" }, { who: "Ostrava", line: STORY[k]?.[1] ?? "" }],
}));

export const roomsDone = () => store.get().rooms ?? [];
export function roomState(r: Room): "done" | "ready" | "needArt" | "needPigments" {
  if (roomsDone().includes(r.index)) return "done";
  if (solvedCount() < r.needArt) return "needArt";
  if (store.get().coins < r.cost) return "needPigments";
  return "ready";
}
export function renovate(r: Room): boolean {
  if (roomState(r) !== "ready") return false;
  store.set({ coins: store.get().coins - r.cost, rooms: [...roomsDone(), r.index] });
  analytics.track("room_renovated", { room: r.index });
  return true;
}

// ───────────────────────────── gallery frames (cosmetics) ─────────────────────────────

export interface Frame { id: string; name: string; cost: number; outer: string; inner: string; accent: string }
export const FRAMES: Frame[] = [
  { id: "oak", name: "Warm Oak", cost: 0, outer: "#9A6A3A", inner: "#C89A63", accent: "#D4A94A" },
  { id: "ink", name: "Sumi Ink", cost: 120, outer: "#1F2A3A", inner: "#3A4558", accent: "#C9B8A0" },
  { id: "teal", name: "Teal Tile", cost: 180, outer: "#1F6867", inner: "#2E8C8A", accent: "#E3A83B" },
  { id: "coral", name: "Coral Lacquer", cost: 220, outer: "#A84A34", inner: "#D9694F", accent: "#F2B35E" },
  { id: "gold", name: "Gold Leaf", cost: 400, outer: "#B6801F", inner: "#E3A83B", accent: "#FFF1B8" },
];
export const framesOwned = () => ["oak", ...(store.get().frames ?? [])];
export const frameInUse = (): Frame => FRAMES.find((f) => f.id === (store.get().frame ?? "oak")) ?? FRAMES[0];
export function buyFrame(id: string): boolean {
  const f = FRAMES.find((x) => x.id === id);
  if (!f || framesOwned().includes(id) || store.get().coins < f.cost) return false;
  store.set({ coins: store.get().coins - f.cost, frames: [...(store.get().frames ?? []), id], frame: id });
  return true;
}
export function selectFrame(id: string): void {
  if (framesOwned().includes(id)) store.set({ frame: id });
}

// ───────────────────────────── studio cosmetics: "Paper & Ink" board skins ─────────────────────────────

/** A board skin: the puzzle card's paper tint, and the ink single-colour puzzles are painted with. */
export interface BoardSkin { id: string; name: string; cost: number; paper: string; ink: string; blurb: string }
export const BOARD_SKINS: BoardSkin[] = [
  { id: "cream", name: "Classic Cream", cost: 0, paper: "#FBF6EA", ink: INK, blurb: "Cold-press cream, sumi ink" },
  { id: "indigo", name: "Indigo Night Paper", cost: 150, paper: "#E7E9F3", ink: "#2C3A7C", blurb: "Blue-grey paper, indigo ink" },
  { id: "sage", name: "Sage Wash", cost: 150, paper: "#EDF3E6", ink: "#2F5040", blurb: "Green wash, forest ink" },
  { id: "terracotta", name: "Terracotta Sketch", cost: 200, paper: "#F8E9DC", ink: "#8A3A27", blurb: "Warm blush, terracotta ink" },
];
export const skinsOwned = (s: PlayerState = store.get()) => ["cream", ...(s.skins ?? [])];
/** The equipped board skin ({ paper, ink } + name). Board: paper tints the grid card; ink paints single-colour puzzles. */
export function boardSkinOf(s: PlayerState = store.get()): BoardSkin {
  const id = s.skin && skinsOwned(s).includes(s.skin) ? s.skin : "cream";
  return BOARD_SKINS.find((k) => k.id === id) ?? BOARD_SKINS[0];
}
/** Buy a skin with Pigments and equip it. */
export function buySkin(id: string): boolean {
  const k = BOARD_SKINS.find((x) => x.id === id);
  const s = store.get();
  if (!k || skinsOwned(s).includes(id) || s.coins < k.cost) return false;
  store.set({ coins: s.coins - k.cost, skins: [...(s.skins ?? []), id], skin: id });
  analytics.track("cosmetic_bought", { kind: "board_skin", id });
  return true;
}
export function equipSkin(id: string): void {
  if (skinsOwned().includes(id)) store.set({ skin: id });
}

// ───────────────────────────── where the Pigments go next (win card teaser) ─────────────────────────────

/** The next room to renovate and how close `coins` gets you (null when every room is restored). */
export function nextRenovation(s: PlayerState = store.get()): { room: Room; have: number; cost: number; needArt: number; ready: boolean } | null {
  const done = s.rooms ?? [];
  const room = ROOMS.find((r) => !done.includes(r.index));
  if (!room) return null;
  const needArt = Math.max(0, room.needArt - solvedCount());
  return { room, have: Math.min(s.coins, room.cost), cost: room.cost, needArt, ready: needArt === 0 && s.coins >= room.cost };
}

// ───────────────────────────── Studio Season (free reward track) ─────────────────────────────

/** Fixed, known rewards — no purchase, nothing random. A tier opens every SEASON_STEP puzzles solved this season. */
export type SeasonReward = { pigments?: number; brushes?: number; frame?: string };
export const SEASON_STEP = 5;
export const SEASON_TIERS: SeasonReward[] = [
  { pigments: 40 }, { brushes: 2 }, { pigments: 60 }, { frame: "ink" }, { pigments: 80 }, { brushes: 3 }, { pigments: 120 }, { frame: "teal" },
];
const SEASON_NAMES = ["Winter Wash", "Winter Wash", "Spring Bloom", "Spring Bloom", "Spring Bloom", "Summer Gouache", "Summer Gouache", "Summer Gouache", "Autumn Ink", "Autumn Ink", "Autumn Ink", "Winter Wash"];
/** A frame you already own pays this many Pigments instead (still fixed and shown up front). */
export const frameRewardFallback = (id: string) => FRAMES.find((f) => f.id === id)?.cost ?? 100;

export function seasonOf(s: PlayerState = store.get(), today = dayKey()): { id: string; name: string; ends: string; solved: number; claimed: number; unlocked: number } {
  const id = today.slice(0, 7);
  const [y, m] = id.split("-").map(Number);
  const cur = s.season?.id === id ? s.season : { id, solved: 0, claimed: 0 };
  const month = new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: "long" });
  return {
    id, name: `${SEASON_NAMES[m - 1]} · ${month}`, ends: dayKey(new Date(y, m, 0)),
    solved: cur.solved, claimed: Math.min(cur.claimed, SEASON_TIERS.length),
    unlocked: Math.min(SEASON_TIERS.length, Math.floor(cur.solved / SEASON_STEP)),
  };
}
export function seasonRewardLabel(r: SeasonReward): string {
  if (r.frame) return `${FRAMES.find((f) => f.id === r.frame)?.name ?? "Gallery"} frame`;
  if (r.brushes) return `${r.brushes} Hint Brushes`;
  return `${r.pigments ?? 0} Pigments`;
}
/** Grant every tier reached but not yet claimed. Returns what was granted (empty when nothing was claimable). */
export function claimSeason(): SeasonReward[] {
  const s = store.get();
  const se = seasonOf(s);
  if (se.unlocked <= se.claimed) return [];
  const got = SEASON_TIERS.slice(se.claimed, se.unlocked);
  let coins = s.coins, brushes = s.brushes ?? 0;
  const frames = [...(s.frames ?? [])];
  for (const r of got) {
    coins += r.pigments ?? 0;
    brushes += r.brushes ?? 0;
    if (r.frame) { if (r.frame === "oak" || frames.includes(r.frame)) coins += frameRewardFallback(r.frame); else frames.push(r.frame); }
  }
  store.set({ coins, brushes, frames, season: { id: se.id, solved: se.solved, claimed: se.unlocked } });
  analytics.track("season_claimed", { season: se.id, tiers: se.unlocked });
  return got;
}

// ───────────────────────────── weekly exhibition (events) ─────────────────────────────

export const EVENT_SIZE = 3;
export const EVENT_REWARD = { pigments: 150, brushes: 2 };

/** Monday (day key) of the week containing `day`. */
export function weekOf(day = dayKey()): string {
  const [y, m, d] = day.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dayKey(new Date(y, m - 1, d - ((dt.getDay() + 6) % 7)));
}

/**
 * This week's Exhibition: three campaign pictures hung upside down — a new board each (flipping keeps every
 * clue's line logic, so each is still proven solvable), a fixed, known reward when all three are painted.
 */
export function eventPuzzle(week: string, k: number): { puzzle: Puzzle; base: Level } {
  const pool = DAILY_POOL.length ? DAILY_POOL : LEVELS;
  const h = hashDay(`exhibit-${week}`);
  const base = pool[(h + k * Math.max(1, Math.floor(pool.length / EVENT_SIZE))) % pool.length];
  const rows = base.spec.art.split("\n").map((l) => l.trim()).filter(Boolean).reverse();
  const puzzle = buildPuzzle({ id: `event-${week}-${k}`, title: base.spec.title, palette: base.spec.palette, art: rows.join("\n") });
  return { puzzle, base };
}
export const eventSolved = (week: string, k: number) => (store.get().stars?.[`event-${week}-${k}`] ?? 0) > 0;
export const eventProgress = (week = weekOf()) => Array.from({ length: EVENT_SIZE }, (_, k) => eventSolved(week, k)).filter(Boolean).length;
export const eventClaimed = (week = weekOf()) => (store.get().eventsClaimed ?? []).includes(week);
export function claimEvent(week = weekOf()): boolean {
  if (eventClaimed(week) || eventProgress(week) < EVENT_SIZE) return false;
  const s = store.get();
  store.set({ coins: s.coins + EVENT_REWARD.pigments, brushes: (s.brushes ?? 0) + EVENT_REWARD.brushes, eventsClaimed: [...(s.eventsClaimed ?? []), week].slice(-60) });
  analytics.track("event_reward_claimed", { week });
  return true;
}

// ───────────────────────────── creator studio (local designs) ─────────────────────────────

export const designsOf = (): Design[] => store.get().designs ?? [];
export const designOf = (id: string) => designsOf().find((d) => d.id === id);
export const designPuzzle = (d: Design): Puzzle => buildPuzzle({ id: `design-${d.id}`, title: d.title, palette: [INK], art: d.art });
export const artOf = (cells: number[], w: number) =>
  Array.from({ length: cells.length / w }, (_, r) => cells.slice(r * w, r * w + w).map((v) => (v ? "#" : ".")).join("")).join("\n");

/** Can these cells be a fair puzzle? Unique by line logic alone (no guessing). `stuck` = cells logic can't decide. */
export function checkDesign(cells: number[], w: number): { ok: boolean; reason?: string; stuck: number[] } {
  const ink = cells.filter(Boolean).length;
  if (ink < 4) return { ok: false, reason: "Paint at least four cells first.", stuck: [] };
  const p = buildPuzzle({ id: "check", title: "", palette: [INK], art: artOf(cells, w) });
  const r = logicSolve(p);
  if (r.unique) return { ok: true, stuck: [] };
  const stuck = r.masks.map((m, i) => ((m & (m - 1)) !== 0 ? i : -1)).filter((i) => i >= 0);
  return { ok: false, reason: "These clues fit more than one picture, so it would need guessing. Add or remove a cell or two near the highlighted ones.", stuck };
}

export function saveDesign(cells: number[], w: number): Design | null {
  if (!checkDesign(cells, w).ok) return null;
  const list = designsOf();
  const n = list.reduce((a, d) => Math.max(a, Number(d.id.split("-")[0]) || 0), 0) + 1;
  const d: Design = { id: `${n}-${Date.now().toString(36)}`, title: `My Design ${n}`, art: artOf(cells, w), created: dayKey() };
  store.set({ designs: [d, ...list].slice(0, 40) });
  analytics.track("design_saved", { size: w });
  return d;
}
export function deleteDesign(id: string): void {
  store.set({ designs: designsOf().filter((d) => d.id !== id) });
}
