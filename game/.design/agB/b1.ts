import { INK } from "../../src/game/types";
const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", UMBER = "#8A5A3C", CREAM = "#C9B8A0", SKY = "#6FA8DC", NIGHT = "#2B3A67";
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
{ id: "paper-lantern", title: "Paper Lantern", palette: [INK], role: "teach", mechanics: ["smudged"], smudge: ["r4"], aha: "", art: `
...##...
.######.
##.##.##
#.####.#
##.##.##
#.####.#
##.##.##
.######.
...##...` },
{ id: "lantern-pinwheel", title: "Pinwheel", palette: [CORAL, GOLD, UMBER], role: "combine", mechanics: ["smudged","color"], smudge: ["r4"], aha: "", art: `
a....bbbb
aa...bbb.
aaa..bb..
aaaa.b...
....c....
...b.aaaa
..bb..aaa
.bbb...aa
bbbb....a
....c....
....c....
...ccc...` },
{ id: "lantern-pinwheel", title: "Pinwheel", palette: [CORAL, GOLD, UMBER], role: "combine", mechanics: ["smudged","color"], smudge: ["c4"], aha: "", art: `
aaaa.bbbbb.
.aaa.bbbb..
..aa.bbb...
...a.bb....
bbbbccaaaa.
....cc.....
.bbbbb.....
...aa.a....
..aaa.aa...
.aaaa.aaa..
.....c.....
.....c.....` },
{ id: "paper-boat", title: "Lantern Boat", palette: [CORAL, GOLD, UMBER], role: "twist", mechanics: ["smudged","color"], smudge: ["r6"], aha: "", art: `
.....c.......
.....cb......
.....cbb.....
.a...cbbb....
aaa..cbbbb...
.a...cbbbbb..
.c...cbbbbbb.
.c...c.......
ccccccccccccc
.ccccccccccc.
..ccccccccc..` },
{ id: "firefly-jar", title: "Firefly Jar", palette: [NIGHT, GOLD], role: "combine", mechanics: ["smudged","color"], smudge: ["c2"], aha: "", art: `
b........b
...aaaa...
..aaaaaa..
...a..a...
.aa....aa.
a..b..b..a
a....b...a
a.b.....ba
a...b.b..a
a.b......a
.aaaaaaaa.` },
];
export const B = [
{ id: "kiln-teapot", title: "Teapot", palette: [TEAL], role: "teach", mechanics: ["cracked"], crack: ["r6.0"], aha: "", art: `
....##....
..######..
#.######.#
#########.#`.replace("#########.#","##########") + `
.########.
..######..
..######..` },
{ id: "kiln-willow-plate", title: "Fish Plate", palette: [CREAM, NIGHT], role: "practise", mechanics: ["cracked","color"], crack: ["r3.1"], aha: "", art: `
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
];
