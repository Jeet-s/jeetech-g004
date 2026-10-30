import { ISL09 } from "../../src/game/islands/isl09";
const c = ISL09.find((s) => s.id === "tailed-comet")!;
export const A = [{ ...c, id: "oc", tally: [] }];
