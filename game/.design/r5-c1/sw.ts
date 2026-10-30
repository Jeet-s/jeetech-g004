import { INK } from "../../src/game/types";
const art = `
...###...
##.###.##
.########
.#######.
..##.##..
..#...#..
.#.....#.`;
export const A = ["r4", "r5", "r6", "c2", "c6", "r1"].map((t) => ({ id: "sw-" + t, title: "Swallow", palette: [INK], role: "breather", mechanics: ["tally"], aha: "", tally: [t], art }));
