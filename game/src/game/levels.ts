/**
 * The campaign: 10 islands × 12 handcrafted pictures. Each island introduces (or twists) one
 * mechanic, practises it, combines it with what came before, and ends with a Masterwork that
 * renovates one room of the atelier. docs/LEVELS.md is the design plan these follow.
 */
import { buildPuzzle, type Puzzle } from "./nonogram";
import type { LevelSpec, Role } from "./types";
import { ISL01 } from "./islands/isl01";
import { ISL02 } from "./islands/isl02";
import { ISL03 } from "./islands/isl03";
import { ISL04 } from "./islands/isl04";
import { ISL05 } from "./islands/isl05";
import { ISL06 } from "./islands/isl06";
import { ISL07 } from "./islands/isl07";
import { ISL08 } from "./islands/isl08";
import { ISL09 } from "./islands/isl09";
import { ISL10 } from "./islands/isl10";

export interface Island {
  name: string;
  room: string;
  /** Wash hue for the island's map art and UI tint. */
  hue: string;
  /** The mechanic this island introduces or twists. */
  mechanic: string;
  levels: LevelSpec[];
}

export const ISLANDS: Island[] = [
  { name: "Sketchbook Shore", room: "Entryway", hue: "#6FA8DC", mechanic: "fill", levels: ISL01 },
  { name: "Inkwell Woods", room: "Sketch Loft", hue: "#3E8E94", mechanic: "tally", levels: ISL02 },
  { name: "Pigment Market", room: "Print Press", hue: "#E98F7A", mechanic: "color", levels: ISL03 },
  { name: "Sculpture Hall", room: "Sculpture Hall", hue: "#C9B8A0", mechanic: "void", levels: ISL04 },
  { name: "Mosaic Hall", room: "Conservatory", hue: "#2E8C8A", mechanic: "stamp", levels: ISL05 },
  { name: "Conservatory", room: "Kiln Room", hue: "#8DB48E", mechanic: "color-cross", levels: ISL06 },
  { name: "Lantern Gallery", room: "Lantern Gallery", hue: "#E3A83B", mechanic: "smudged", levels: ISL07 },
  { name: "Kiln Room", room: "Observatory Studio", hue: "#D9694F", mechanic: "cracked", levels: ISL08 },
  { name: "Observatory Studio", room: "Rooftop Garden", hue: "#8C6BB1", mechanic: "color-tally", levels: ISL09 },
  { name: "Grand Exhibit", room: "Grand Exhibit", hue: "#D4A94A", mechanic: "combine", levels: ISL10 },
];

export const MECHANICS: Record<string, string> = {
  fill: "Ink cells to match the clues; a clue as long as the line fills it",
  "x-marks": "Cross out cells that must stay paper; finished lines auto-X",
  "exact-fit": "Runs plus their gaps fill the line exactly — only one placement",
  overlap: "Slide a long run to both ends: the cells it always covers are ink",
  tally: "A ringed number counts ALL the ink in its line, in any number of pieces: once that many are found, the rest is paper",
  color: "Coloured clues: same colours need a gap, different colours may touch",
  void: "Shaped canvas: cells outside the frame are always paper",
  stamp: "Stamped cells are given; they split lines and anchor runs",
  "color-cross": "A cell can only take a colour its row AND column both contain",
  smudged: "A smudged clue is unreadable — paint that line from its crossings",
  cracked: "A cracked number '?' keeps its colour but hides its length",
  "color-tally": "Coloured tallies: one ringed count per colour, in no order — the crossings decide where each colour sits",
  combine: "The exam — no new rule: two or three earlier twists (tally, void, stamp, smudged, cracked, colour-cross) on one canvas",
};

export interface Level {
  number: number; // 1-based
  island: number; // 0-based
  slot: number; // 1..12 within the island
  spec: LevelSpec;
  puzzle: Puzzle;
  role: Role;
  masterwork: boolean;
}

export const LEVELS: Level[] = ISLANDS.flatMap((isl, k) =>
  isl.levels.map((spec, j) => {
    const puzzle = buildPuzzle(spec);
    return {
      number: 0, island: k, slot: j + 1, spec, puzzle, role: spec.role,
      masterwork: j === isl.levels.length - 1,
    };
  }),
).map((l, i) => ({ ...l, number: i + 1 }));

export const levelById = (id: string) => LEVELS.find((l) => l.spec.id === id);
