const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const S = (id: string, art: string, t: string[] = []) => ({ id, palette: [GOLD, NIGHT], tally: t, art });
export const A = [
S("w1", `
....b....
aa..b..a.
.aaaaaaaa
aa..b..a.
....b....
.bbbbbbb.
....b....
...bbb...
.bbbbbbb.`),
S("w2", `
....b....
aa..b..a.
.aaaaaaaa
aa..b..a.
....b....
..b.b.b..
.bbbbbbb.
..b.b.b..
....b....`),
S("w3", `
....a....
a...b..a.
aaaaaaaaa
a...b..a.
....b....
.b..b..b.
bbbbbbbbb
.b..b..b.
...bbb...`),
];
