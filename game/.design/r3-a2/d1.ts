import { INK } from "../../src/game/types";
const L = (id: string, art: string, tally: string[] = []) => ({ id, title: id, palette: [INK], role: "teach", mechanics: [], aha: "", art, tally });
export const A = [
L("toadstools", `
.####...
######..
######..
..##.###
..##.###
..##..#.
########`),
L("toadstools2", `
..####..
.######.
########
#.#..#.#
...##...
...##...
..####..`),
L("sleeping-fox", `
#.......#
##.....##
###...###
#########
#.##.##.#
.#######.
..#####..
...###...
....#....`),
];
