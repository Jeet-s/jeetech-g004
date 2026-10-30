const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, pal = [GOLD, NIGHT]) => ({ id, title: id, palette: pal, role: "teach", mechanics: ["color-tally"], aha: "", art });
export const A = [
S("rocket", `
...a....
..aaa...
..aba...
..aaa...
.aaaaa..
.a.b.a..
...b....
..bbb...`),
S("tele5", `
......aa
....aabb
..aabba.
aabba...
.ab.b...
...b.b..
..b...b.
.b.....b`),
S("tele6", `
.....a.a
....aaaa
..aaaaa.
.aaaa...
aaab....
.a.bb...
..b.b...
.b...b..`),
S("tele7", `
........
.....aab
...aaaab
.aaaaaa.
aaaaab..
...bbb..
..b.b.b.
.b..b..b`),
S("tele8", `
.......b
..b...a.
.....aa.
....aaa.
...aaa..
..aab...
..b.b...
.b...b..`),
];
