import { INK } from "../../src/game/types";
const S = (title: string, art: string) => ({ id: "red-squirrel", title, palette: [INK], role: "twist", mechanics: ["tally"], tally: ["r5"], aha: "", art });
export const A = [
S("t1", `
.......###.
.#....##..#
##....#...#
#.#...#..#.
###...##.#.
####.######
.#######.#.
.#.#...##..`),
S("t2", `
.......###.
.#....##.##
###...#..##
#.##..#.##.
####..####.
.###.######
..######.#.
.##.####...`),
];
