import { INK } from "../../src/game/types";
const art = `
...###...
##.###.##
.########
.#######.
..##.##..
..#...#..
.#.....#.`;
export const A = [["r5", "r6"], ["r4", "r6"], ["r3", "r6"]].map((t, i) => ({ id: "acorn" + i, title: "Swallow", palette: [INK], role: "breather", mechanics: ["tally"], aha: "", tally: t, art }));
