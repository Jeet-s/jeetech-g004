import { INK } from "../../src/game/types";
const S=(art:string)=>({ id: "sandcastle", title: "Castle and Parasol", palette: [INK], role: "practise", mechanics: ["overlap","x-marks"], aha: "", art });
export const A = [
S(`
.......###..
#.#.#.#####.
#####.#.#.#.
#.#.#...#...
#####...#...
##.##...#.##
##.##...#.##
############`),
S(`
.......###..
#.#.#.#####.
#####.#.#.#.
#.#.#...#...
#####...#...
##.##...#..#
##.##...#.##
############`),
];
