import { ISL09 } from "../../src/game/islands/isl09";
const c = ISL09.find((s) => s.id === "tailed-comet")!;
export const A = [["r1"], ["r5"], ["r0"], ["r6"], ["r7"]].map((t) => ({ ...c, id: "com-" + t.join(""), tally: t }));
