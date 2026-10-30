import { INK } from "../../src/game/types";
const M = (title: string, tally: string[], art: string) => ({ id: "acorn", title, palette: [INK], role: "breather", mechanics: ["tally"], tally, aha: "", art });
export const A = [
M("m1", ["c7"], `
..##....
.####..#
#.####.#
######.#
.#######
..#..#..`),
M("m2", ["r5"], `
..##....
.####..#
#.####.#
######.#
.#######
..#..#..`),
M("m3", ["r1"], `
.##....#
####...#
#.####.#
######.#
.#######
..#..#..
.##.##..`),
M("m4", ["c8"], `
..##...#
.####..#
#.####.#
######.#
.######.
.#...#..
##..##..`),
];
