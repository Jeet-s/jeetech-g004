const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", UMBER = "#8A5A3C", CREAM = "#C9B8A0", SKY = "#6FA8DC", NIGHT = "#2B3A67";
const tp = `
.....#.....
...#####...
#.#########
.########.#
..#######.#
..#########
..#######..
...#####...`;
export const A = ["r7.0","r6.0","r5.0","r4.0","r2.0","c0.0","c1.0"].map(c=>({ id: "kiln-teapot", title: "Teapot "+c, palette: [TEAL], role: "teach", mechanics: ["cracked"], crack: [c], aha: "", art: tp }));
const pw = `
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
...ccc...`;
export const B = ["r1","r2","r6","r7","c1","c2","c6","c7"].map(s=>({ id: "lantern-pinwheel", title: "Pin "+s, palette: [CORAL, GOLD, UMBER], role: "combine", mechanics: ["smudged","color"], smudge: [s], aha: "", art: pw }));
