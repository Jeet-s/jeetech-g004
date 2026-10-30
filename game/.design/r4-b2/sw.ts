import { INK } from "../../src/game/types";
const S = (art: string) => ({ id: "acorn", title: "Swallow", palette: [INK], role: "breather", mechanics: ["fill"], aha: "", art });
export const A = [S(`
...###...
##.###.##
.########
.#######.
..##.##..
..#...#..
.#.....#.`), S(`
...####..
##.###.##
.########
.#######.
..##.##..
..#...#..
.#.....#.`), S(`
..####...
##.###.##
#########
.#######.
..##.##..
..#...#..
.#.....#.`)];
