import { INK } from "../../src/game/types";
const L = (id: string, art: string) => ({ id, title: id, palette: [INK], role: "practise", mechanics: ["reach"], aha: "", art });
export const A = [
L("hedgehog", `
...#.#.#..
..#.#.#.#.
..#######.
#########.
######.###
.########.
.#######..
##....#...
.#....#...
#.....##..`),
];
