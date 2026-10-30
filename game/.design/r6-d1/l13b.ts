import { INK } from "../../src/game/types";
const t = (title: string, tally: string[], art: string) => ({ id: "toadstools", title, palette: [INK], role: "teach", mechanics: ["tally"], tally, aha: "", art });
export const A = [t("T1r6", ["r5"], `
.####....
##.###...
######.#.
..##..###
..##.####
..##...#.
#########`), t("T1r5", ["r4"], `
.####....
##.###...
######.#.
..##..###
..##.####
..##...#.
#########`)];
