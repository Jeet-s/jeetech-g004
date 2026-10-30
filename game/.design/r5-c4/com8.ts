import { ISL09 } from "../../src/game/islands/isl09";
const c = ISL09.find((s) => s.id === "tailed-comet")!;
export const A = [{ ...c, id: "t07", tally: ["r0", "r6"] }, { ...c, id: "t7", tally: ["r6"] }, { ...c, id: "t0", tally: ["r0"] }];
