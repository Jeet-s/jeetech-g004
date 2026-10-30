import { INK } from "../../src/game/types";
const m = (id: string, tally: string[], art: string) => ({ id: "toadstools", title: id, palette: [INK], role: "teach", mechanics: ["tally"], aha: "", tally, art });
export const A = [
m("a", ["r4"], `
..###..
.##.##.
##.###.
###.#.#
#######
..###..
..###..
#######`),
m("b", ["r4"], `
..###..
.##.##.
##.###.
###.#.#
#######
..##...
..###..
.#####.`),
m("c", ["r5"], `
..###..
.#.###.
##.##.#
######.
#######
..##...
..###..
.#####.`),
m("d", ["r5"], `
...###.
.##.###
##.##.#
#######
..###..
..##...
..###..
#######`),
];
