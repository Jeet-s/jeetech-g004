import { INK } from "../../src/game/types";
const S = (id: string, art: string) => ({ id, title: id, palette: [INK], role: "boss", mechanics: [], aha: "", art });
export const A = [
S("c4", `
........###.
.#.#...##..#
.###...#####
..#.#.#..##.
..#.#.#.##..
.##########.
############
.##########.
.#.#....#.#.
#..#....#..#`),
];
