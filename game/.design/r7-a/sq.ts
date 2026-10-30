import { INK } from "../../src/game/types";
const S = (title: string, tally: string[], art: string) => ({ id: "red-squirrel", title, palette: [INK], role: "twist", mechanics: ["tally", "overlap"], tally, aha: "", art });
const cur = `
.......###.
.#....#####
###...#####
#.##..####.
####..###..
.###.###...
..######...
.###.###...`;
export const A = [S("a", ["r5"], cur), S("b", ["r5", "r6"], cur), S("c", ["r6"], cur), S("d", ["r5","r7"], cur)];
