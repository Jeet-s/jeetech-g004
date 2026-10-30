const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const S = (id: string, art: string, t = ["c3"]) => ({ id, palette: [GOLD, NIGHT], tally: t, art });
export const A = [
S("v1", `
......bb
....baab
..aaaa..
bbaab...
....b...
....b...
..b.b.b.
.bbbb.bb`),
S("v2", `
......bb
....baab
..aaaa..
bbaab...
.b..b...
....b...
...bbb..
..bbbbb.`),
S("v3", `
......bb
....baab
..aaaa..
bbaab...
.b..b...
....b...
..b.b.b.
.bb.b.bb`),
S("v4", `
......bb
....baab
..aaaa..
bbaab...
.b..b...
...bbb..
..b.b.b.
.bb.b.bb`),
S("v5", `
......bb
....baab
..aaaa..
bbaab...
.b..b...
....b...
..bb.bb.
.bb...bb`),
];
