import { ISL08 } from "../../src/game/islands/isl08";
import { ISL10 } from "../../src/game/islands/isl10";
export const A = [...ISL08, ...ISL10].filter((s) => ["kiln-tea-bowl", "exhibit-pocket-watch", "exhibit-penguin"].includes(s.id));
