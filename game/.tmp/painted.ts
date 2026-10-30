import { LEVELS, ISLANDS } from "../src/game/levels";
import { writeFileSync, readFileSync } from "fs";


import { paintedColors as fn } from "../src/ui/paint";
const out: Record<string, unknown> = {};
for (const n of [1, 2, 12, 24, 30, 60, 120]) { const L = LEVELS[n - 1]; out[n] = { w: L.puzzle.w, h: L.puzzle.h, c: fn(L.puzzle, ISLANDS[L.island].hue) }; }
writeFileSync(".tmp/painted.json", JSON.stringify(out));
