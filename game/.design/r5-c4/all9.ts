import { ISL09 } from "../../src/game/islands/isl09";
import { ISL08 } from "../../src/game/islands/isl08";
export const A = [...ISL09, ...ISL08].map((s) => ({ ...s, tally: [], smudge: [], crack: [] }));
