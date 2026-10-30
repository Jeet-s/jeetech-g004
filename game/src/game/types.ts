import type { PuzzleSpec } from "./nonogram";

export type Role = "teach" | "practise" | "twist" | "combine" | "boss" | "breather" | "finale";

/** One handcrafted campaign level: the picture + what it is for (docs/LEVELS.md keeps the same lines). */
export interface LevelSpec extends PuzzleSpec {
  role: Role;
  /** The insight the player must find on this board. */
  aha: string;
  /** Mechanics / techniques in play (see MECHANICS in levels.ts). */
  mechanics: string[];
}

export const INK = "#1F2A3A";
