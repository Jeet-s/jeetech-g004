import { ISL01 } from "../../src/game/islands/isl01";
import { ISL02 } from "../../src/game/islands/isl02";
const ids = ["starfish", "anchor", "whale", "meadow-rabbit"];
export const A = [...ISL01, ...ISL02].filter((s) => ids.includes(s.id));
