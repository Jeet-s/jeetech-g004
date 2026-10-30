const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", UMBER = "#8A5A3C", CREAM = "#C9B8A0", SKY = "#6FA8DC", NIGHT = "#2B3A67";
const jar = `
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
..aaaaaa..`;
export const B = ["c1","c2","c4","c5"].map(s=>({ id: "firefly-jar", title: "Jar3 "+s, palette: [NIGHT, GOLD, UMBER], role: "combine", mechanics: ["smudged","color"], smudge: [s], aha: "", art: jar }));
const koi = `
aaaaaaaaaaaa
a.c........a
a......bb..a
a...bbbbbb.a
a.bb.bcbbb.a
a.bbbbbccb.a
a...bbbbbb.a
a......b...a
aaaaaaaaaaaa`;
const koi2 = `
aaaaaaaaaaaa
a.c....bb..a
a...bbbbbb.a
a.bb.bcbbb.a
a.bbbbbccb.a
a...bbbbbb.a
a....b.....a
aaaaaaaaaaaa`;
export const C = [...["r3.1","r4.1","r5.1","r4.2"].map(c=>({ id: "kiln-glazed-tile", title: "Koi "+c, palette: [TEAL, CORAL, CREAM], role: "twist", mechanics: ["cracked","color"], crack: [c], aha: "", art: koi })),
 ...["r2.1","r3.1","r4.1"].map(c=>({ id: "kiln-glazed-tile", title: "Koi2 "+c, palette: [TEAL, CORAL, CREAM], role: "twist", mechanics: ["cracked","color"], crack: [c], aha: "", art: koi2 }))];
const boat = `
......c......
......cb.....
......cbb....
.c....cbbb...
.cc...cbbbb..
.ba...cbbbbb.
.aa...c......
ccccccccccccc
.ccccccccccc.
..b.b.b.b.b..`;
export const D = ["r6","r7","c6","c1","r5","c2"].map(s=>({ id: "paper-boat", title: "Boat "+s, palette: [CORAL, GOLD, UMBER], role: "twist", mechanics: ["smudged","color"], smudge: [s], aha: "", art: boat }));
