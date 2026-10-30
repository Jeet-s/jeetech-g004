import { INK } from "../../src/game/types";
const art = `
.#....##.
#########
#.......#
#.##.##.#
#...#...#
.#.....#.
########.
#########
###.#####
...#.##.#`;
export const A = ["c4","r0","r1","r2","r3","r4","r5","r6","r7","r8","r9","c0","c1","c2","c3","c4","c5","c6","c7","c8"].map((t) => ({ id: "owl-" + t, title: "Barn Owl", palette: [INK], role: "practise", mechanics: ["tally"], aha: "", tally: [t], art }));
