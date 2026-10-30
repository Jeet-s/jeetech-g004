import { INK } from "../../src/game/types";
const S = (art: string, tally: string[]) => ({ id: "hedgehog", title: "Hedgehog", palette: [INK], role: "practise", mechanics: ["tally"], aha: "", tally, art });
export const A = [S(`
...#.#.#...
.#.#.#.#.#.
.#########.
########.##
###########
.########..
..##...##..`, ["r0"]), S(`
...#.#.#...
.#.#.#.#.#.
.#########.
########.##
###########
.########..
..##...##..`, ["r1"]), S(`
..#..#.#.#.
.#.#.#.#.#.
.#########.
########.##
###########
.########..
..##...##..`, ["r0"])];
