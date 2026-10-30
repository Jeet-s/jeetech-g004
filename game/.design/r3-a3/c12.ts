const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const S = (id: string, art: string) => ({ id, palette: [GOLD, NIGHT], art });
export const A = [
S("p1", `
.......a
.....bb.
...bbaab
.bbaab..
baab.b..
.b..b.b.
...b..b.
..b...b.`),
S("p2", `
......bb
....aaab
..aaaab.
bbaab...
b.ab.b..
...b.b..
..b..b..
.b...b..`),
S("p3", `
.....bab
...aaaa.
.baaaa..
baaa.b..
.b..bb..
...b.b..
..b..b..
.bb..bb.`),
S("p4", `
.......b
.....aab
...aaaa.
.baaa...
baa.b...
.b.bbb..
..b.b.b.
.b..b..b`),
S("p5", `
.a....bb
....aaab
..aaaab.
bbaab...
b..bb...
...bb.a.
..b..b..
.b....b.`),
];
