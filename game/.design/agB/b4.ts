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
export const A = ["r3.2"].map(c=>({ id: "kiln-heart-mug", title: "Mug "+c, palette: [TEAL], role: "teach", mechanics: ["cracked"], crack: [c], aha: "", art: mug }));
const jar2 = `
b.........
...cccc..b
...cccc...
..aaaaaa..
.aaaaaaaa.
aabaaaaaaa
aaaaabaaaa
.abaaaaba.
aaaabaaaaa
.aaaaaaaa.
..aaaaaa..`;
export const B = ["c3","c2","c4"].map(s=>({ id: "firefly-jar", title: "Jar2 "+s, palette: [NIGHT, GOLD, UMBER], role: "combine", mechanics: ["smudged","color"], smudge: [s], aha: "", art: jar2 }));
const koi = `
aaaaaaaaaaa
a.c.......a
a.....bb..a
a...bbbbb.a
a.b.bcbbbba
a.bbbbccbba
a...bbbbb.a
a.....b...a
aaaaaaaaaaa`;
export const C = ["r4.1","r4.2","r5.1","r3.1","r6.1","r6.0"].map(c=>({ id: "kiln-glazed-tile", title: "Koi "+c, palette: [TEAL, CORAL, CREAM], role: "twist", mechanics: ["cracked","color"], crack: [c], aha: "", art: koi }));
const nb = `
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
...aaaaa...`;
export const D = [["r6.0","r3.0"],["r6.0","r9.0"],["r3.0","r9.0"]].map(c=>({ id: "kiln-noodle-bowl", title: "Noodle "+c.join(), palette: [NIGHT, GOLD, UMBER, CREAM], role: "combine", mechanics: ["cracked","color"], crack: c, aha: "", art: nb }));
