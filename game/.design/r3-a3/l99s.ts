import { A as B } from "./l99";
const h3 = B[2];
export const A = [["r6","c3"],["r6","c8"],["r6","c2"],["r5","c6"],["r6","c6"],["r3","c6"],["r5","c4"]].map((t) => ({ ...h3, id: t.join("_"), tally: t }));
