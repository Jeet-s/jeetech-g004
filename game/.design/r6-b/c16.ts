import { INK } from "../../src/game/types";
const art = `
..#..#..#..
.#.#..#.#..
.#########.
########.##
###########
.########..
..##...##..`;
const m = (title: string, tally: string[], a = art) => ({ id: "hedgehog", title, palette: [INK], role: "practise", mechanics: ["tally"], aha: "", tally, art: a });
export const A = [m("c9", ["r1", "c8"]), m("c6", ["r1", "c5"]), m("c4", ["r1", "c3"]), m("c7", ["r1", "c6"]), m("r1r2c9", ["r0", "r1", "c8"]), m("r1r2c6", ["r0", "r1", "c5"])];
