import { ISL05 } from "../../src/game/islands/isl05";
const s = ISL05[11];
export const A = [s, { ...s, art: s.art.replace(/,/g, ".").replace(/[A-F]/g, (c) => c.toLowerCase()) }];
