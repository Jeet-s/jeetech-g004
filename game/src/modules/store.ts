import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Tiny persisted player state (entitlements + currency). Loaded once at boot;
 * reads are synchronous afterwards so gameplay code stays simple.
 */
export interface PlayerState {
  adsRemoved: boolean;
  coins: number;
  level: number;
  /** Settings — default on. */
  sound?: boolean;
  music?: boolean;
  haptics?: boolean;
  /** Best stars per level id (progress map). */
  stars?: Record<string, number>;
  tutorialDone?: boolean;
  // ── Nonogram Atelier (src/game/meta.ts) ──
  /** Hint Brushes (coins = Pigments). */
  brushes?: number;
  /** Day (YYYY-MM-DD) the free daily Hint Brushes were last topped up. */
  brushDay?: string;
  /** Autosave: player marks per puzzle id (encoded), restored exactly on reopen. */
  saves?: Record<string, string>;
  /** Gameplay / accessibility options. */
  opts?: Partial<GameOptions>;
  /** Renovated atelier rooms (island index). */
  rooms?: number[];
  daily?: DailyState;
  /** Owned gallery frames and the one in use. */
  frames?: string[];
  frame?: string;
  welcomed?: boolean;
  /** Day of the first launch (the streak calendar never counts days before it as missed). */
  firstDay?: string;
  stats?: { solved: number; pigments: number; brushesUsed: number; seconds: number };
  /** Weekly Exhibition (src/game/meta.ts): weeks whose reward was claimed (Monday day keys). */
  eventsClaimed?: string[];
  /** Creator Studio: the player's own pictures (local only). */
  designs?: Design[];
  /** Level opened most recently (Home's Play continues the next unsolved one). */
  lastLevel?: number;
  /** Studio cosmetics (src/game/meta.ts): owned "Paper & Ink" board skins and the one equipped. */
  skins?: string[];
  skin?: string;
  /** Studio Season (free reward track): the season id (YYYY-MM), puzzles solved in it, tiers claimed. */
  season?: { id: string; solved: number; claimed: number };
}

export interface Design {
  id: string;
  title: string;
  /** Picture rows, '.' paper / '#' ink (same format as the campaign art). */
  art: string;
  created: string;
}

export interface GameOptions {
  autoX: boolean;
  greyClues: boolean;
  strikes: boolean;
  leftHand: boolean;
  dark: boolean;
  contrast: boolean;
  patterns: boolean;
  hideMeta: boolean;
  reminders: boolean;
}

export interface DailyState {
  streak: number;
  best: number;
  /** Last day a daily puzzle was solved. */
  last?: string;
  done: string[];
  /** Days bridged by a Streak Freeze. */
  frozen: string[];
}

const KEY = "player_state_v1";
let state: PlayerState = { adsRemoved: false, coins: 0, level: 1, sound: true, music: true, haptics: true, stars: {}, tutorialDone: false };
const listeners = new Set<(s: PlayerState) => void>();

export const store = {
  async load(): Promise<PlayerState> {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) state = { ...state, ...(JSON.parse(raw) as Partial<PlayerState>) };
    } catch {
      // first launch / corrupted → defaults
    }
    return state;
  },
  get(): PlayerState {
    return state;
  },
  set(patch: Partial<PlayerState>): void {
    state = { ...state, ...patch };
    listeners.forEach((l) => l(state));
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  },
  subscribe(l: (s: PlayerState) => void): () => void {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
