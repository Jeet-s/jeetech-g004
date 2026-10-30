import { INK } from "../../src/game/types";
const L = (art: string) => ({ id: "whale", title: "Harbour Whale", palette: [INK], role: "finale", mechanics: ["overlap", "exact-fit"], aha: "", art });
export const A = [
L(`
.#.#......#.#
..#.#.#...###
..#..#.....#.
.####......#.
#######...##.
##.######.#..
###########..
#.#########..
.#########...
###.###.###.#
#..#...#...##`)
];
