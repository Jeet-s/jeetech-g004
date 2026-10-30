import { ISL09 } from "../../src/game/islands/isl09";
export const A = ISL09.filter((s) => ["stargazer-hat", "tailed-comet", "moon-rover"].includes(s.id)).map((s) => ({ ...s, tally: [] }));
