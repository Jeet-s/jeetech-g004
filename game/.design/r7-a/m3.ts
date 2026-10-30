import { INK } from "../../src/game/types";
const M = (title: string, tally: string[], art: string) => ({ id: "acorn", title, palette: [INK], role: "breather", mechanics: ["tally"], tally, aha: "", art });
export const A = [
M("d", [], `
..##....
.####...
##.####.
########
.#######
..#.#..#
......##`),
M("d2", [], `
..##....
.####...
##.####.
#######.
.#######
..#.#..#
.....##.`),
];
