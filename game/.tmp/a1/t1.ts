import { chk, trace } from "./chk";
const INK = "#1F2A3A";
const s = (id: string, art: string, palette = [INK]) => ({ id, title: id, palette, art });
for (const sp of [
s("fish", `
.###..#
#.###.#
######.
#####.#
.###..#`),
s("fish2", `
..###...
.#.####.#
`.replace(/\n.*\n$/, "\n")),
s("mush10", `
...####...
.########.
###.##.###
##########
.#####.##.
....##....
....##....
...####...`),
s("fox", `
#.......#
##.....##
#.#####.#
#########
##.###.##
.#######.
..#####..
...###...
....#....`),
]) { try { chk(sp); trace(sp, 5); } catch (e) { console.log(sp.id, String(e)); } }
