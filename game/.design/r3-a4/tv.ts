import { ISL10 } from "../../src/game/islands/isl10";
const base = ISL10.find((l) => l.id === "exhibit-old-painter")!;
export const A = Array.from({ length: 12 }, (_, r) => ({ ...base, id: "op-r" + (r + 1), tally: ["r" + r] }));
