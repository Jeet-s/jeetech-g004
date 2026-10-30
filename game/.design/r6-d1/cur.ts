import { ISL01 } from "../../src/game/islands/isl01";
import { ISL02 } from "../../src/game/islands/isl02";
const want = (process.env.IDS ?? "").split(",");
export const A = [...ISL01, ...ISL02].filter((s) => !process.env.IDS || want.includes(s.id));
