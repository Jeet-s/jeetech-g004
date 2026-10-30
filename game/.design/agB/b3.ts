const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", UMBER = "#8A5A3C", CREAM = "#C9B8A0", SKY = "#6FA8DC", NIGHT = "#2B3A67";
const mug = `
.#..#....
..#..#...
#######..
##.#.####
#.....#.#
##...##.#
###.#####
#######..
.#####...`;
export const A = ["r2.0","r3.3","r6.1","r7.0","r8.0","r4.1"].map(c=>({ id: "kiln-heart-mug", title: "Mug "+c, palette: [TEAL], role: "teach", mechanics: ["cracked"], crack: [c], aha: "", art: mug }));
const jar = `
b.........
...cccc..b
...cccc...
..aaaaaa..
.aaaaaaaa.
.aabaaaaa.
.aaaaabaa.
.abaaaaaa.
.aaaaaaba.
.aaabaaaa.
..aaaaaa..`;
export const B = ["c3","c2","c5"].map(s=>({ id: "firefly-jar", title: "Jar "+s, palette: [NIGHT, GOLD, UMBER], role: "combine", mechanics: ["smudged","color"], smudge: [s], aha: "", art: jar }));
const koi = `
aaaaaaaaaaa
a.........a
a.....bb..a
a..bbbbb..a
a.bbcbbbb.a
abb.bbcbbba
a.bbbbbb.ba
a..bcbb...a
a...b.....a
a.........a
aaaaaaaaaaa`;
export const C = ["r4.1","r5.1","r3.1","r6.1"].map(c=>({ id: "kiln-glazed-tile", title: "Koi "+c, palette: [TEAL, CORAL, CREAM], role: "twist", mechanics: ["cracked","color"], crack: [c], aha: "", art: koi }));
const nb = `
.d..d....cc
d..d...cc..
.d..dcc....
...ccb.b...
.cc.b.b.b..
...b.b.b...
.bbbbbbbbb.
aaaaaaaaaaa
.aacaacaaa.
..aaaaaaa..
...aaaaa...`;
export const D = [["r6.0","r7.0"],["r6.0","c0.0"],["r7.0","r9.0"],["r6.0","r8.0"]].map(c=>({ id: "kiln-noodle-bowl", title: "Noodle "+c.join(), palette: [NIGHT, GOLD, UMBER, CREAM], role: "combine", mechanics: ["cracked","color"], crack: c, aha: "", art: nb }));
