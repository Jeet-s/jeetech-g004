const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, pal = [GOLD, NIGHT]) => ({ id, title: id, palette: pal, role: "teach", mechanics: ["color-tally"], aha: "", art, tally: "auto", minColors: 2 });
export const A = [
S("t1", `
......aa
....aaaa
..aaaaa.
aaaab...
a..b.b..
..b..b..
.b...b..
b....b..`),
S("t2", `
.....baa
...aaaaa
.aaaab..
aaab.b..
...b.b..
..b..b..
.b...b..
b....b..`),
S("t3", `
......aab
....aaaa.
..baaaa..
aabaa....
aa..b....
...b.b...
..b...b..
.b.....b.
b.......b`),
S("t4", `
.......aa
.....aaaa
...aaaaa.
.baaaa...
aabab....
aa.b.b...
..b...b..
.b.....b.
b.......b`),
];
