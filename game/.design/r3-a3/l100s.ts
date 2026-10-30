import { A as B } from "./l100";
export const A = [["r5"],["c6"],["r6"],["c7"],["r5","c6"]].map((t) => ({ ...B[0], id: t.join("_"), tally: t }));
