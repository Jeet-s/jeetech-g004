import { INK } from "../../src/game/types";
const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", UMBER = "#8A5A3C", CREAM = "#C9B8A0", NIGHT = "#2B3A67";
export const A = [
{ id: "paper-lantern", title: "Paper Lantern", palette: [INK], role: "teach", mechanics: ["smudged"], smudge: ["r3"], aha: "", art: `
...#...
.#####.
##.#.##
#######
##.#.##
.#####.
...#...
..###..` },
{ id: "firefly-jar", palette: [NIGHT, GOLD, UMBER], smudge: ["c1"], art: `
b.........
...cccc..b
...cccc...
..aaaaaa..
.aaaaaaaa.
aabaaaaaaa
aaaaabaaaa
abaaaaaaba
aaaabaaaaa
.aaaaaaaa.
..aaaaaa..` },
{ id: "paper-boat", palette: [CORAL, GOLD, UMBER], smudge: ["r3","r4"], art: `
......c......
......cb.....
......cbb....
.cc...cbbb...
.ca...cbbbb..
.ca...cbbbbb.
.c....c......
ccccccccccccc
.ccccccccccc.
..b.b.b.b.b..` },
{ id: "lantern-pinwheel", palette: [CORAL, GOLD, UMBER], smudge: ["c2"], art: `
a....bbbb
aa...bbb.
aaa..bb..
aaaa.b...
....c....
...bcaaaa
..bbc.aaa
.bbbc..aa
bbbbc...a
....c....
....c....
...ccc...` },
{ id: "kiln-teapot", palette: [TEAL], crack: ["r6.0"], art: `
.....#.....
...#####...
#.#########
.########.#
..#######.#
..#########
..#######..
...#####...` },
{ id: "kiln-heart-mug", palette: [TEAL], crack: ["r8.0"], art: `
.#..#....
..#..#...
#######..
##.#.####
#.....#.#
##...##.#
###.#####
#######..
.#####...` },
{ id: "kiln-willow-plate", palette: [CREAM, NIGHT], crack: ["r3.1"], art: `
...bbbbb...
.bbaaaaabb.
.baaaaaaab.
baaaaaaaaab
baabbbaabab
babbabbbbab
baabbbaabab
baaaaaaaaab
.baaaaaaab.
.bbaaaaabb.
...bbbbb...` },
{ id: "kiln-glazed-tile", palette: [TEAL, CORAL, CREAM], crack: ["r5.1"], art: `
aaaaaaaaaaaa
a.c........a
a.....bb...a
a...bbbbb.ba
a.b.bcbbbbba
a.bbbbbccbba
a...bbbbb.ba
a......b...a
aaaaaaaaaaaa` },
{ id: "kiln-noodle-bowl", palette: [NIGHT, GOLD, UMBER, CREAM], crack: ["r6.0","r3.0"], art: `
..d...d...d
.d...d...d.
..d...d...d
cccccccccc.
..b.b.b....
..b.b.b....
.bbbbbbbbb.
aaaaaaaaaaa
.aacaacaaa.
..aaaaaaa..
...aaaaa...` },
].map((s: any) => ({ title: s.id, role: "practise", mechanics: [], aha: "", ...s }));
