import { INK } from "../../src/game/types";
const L = (id: string, art: string) => ({ id, title: id, palette: [INK], role: "combine", mechanics: ["overlap"], aha: "", art });
export const A = [
L("turtle", `
....###....
....#.#....
##...#...##
###.###.###
..#######..
..##.#.##..
..#.###.#..
..##.#.##..
..#######..
..#.###.#..
.##..#..##.`),
];
