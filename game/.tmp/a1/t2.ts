import { chk, trace } from "./chk";
import { ISL02 } from "../../src/game/islands/isl02";
const INK = "#1F2A3A";
const s = (id: string, art: string, palette = [INK]) => ({ id, title: id, palette, art });
const R = "#D9694F", G = "#2E8C8A", B = "#8A5A3C";
for (const sp of [
s("mush13", `
...####...
.######.#.
#####.###.
##.#######
.########.
....##....
....##....
...####...`),
ISL02[3],
s("straw9", `
...bbb...
.bb.b.bb.
..aaaaa..
.aaa.aaa.
aa.aaaa.a
aaaaa.aaa
.a.aaaaa.
..aaa.a..
...aaa...`, [R, G]),
s("cherry10", `
.......bb.
.....bb.b.
....b...b.
...b....b.
..b.....b.
.aaa...b..
aaaaa.aaa.
aa.aaaaaaa
aaaaa.a.aa
.aaa..aaa.`, [R, B]),
]) { try { chk(sp as any); trace(sp as any, 6); } catch (e) { console.log(sp.id, String(e)); } }
