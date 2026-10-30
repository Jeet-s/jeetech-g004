import { ISL01 } from "../../src/game/islands/isl01";
import { ISL02 } from "../../src/game/islands/isl02";
export const A = [...ISL01, ...ISL02].filter((s) => s.id === "meadow-rabbit");
