import { INK } from "../../src/game/types";
const L = (id: string, art: string, tally: string[] = []) => ({ id, title: id, palette: [INK], role: "breather", mechanics: [], aha: "", art, tally });
export const A = [
L("s1", `
....#....
#..###..#
##.###.##
#########
.#######.
...###...
..#...#..`),
L("s2", `
....#....
##.###.##
#########
.#######.
..##.##..
..#...#..
.#.....#.`),
L("s3", `
#...#...#
##.###.##
.#######.
..#####..
...###...
...#.#...
..#...#..`),
];
