const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const S = (id: string, art: string) => ({ id, palette: [GOLD, NIGHT], art });
export const A = [
S("m1", `
......ab
....aaab
..aaaa..
aaaab...
aa..b...
....b...
...bbb..
..bbbbb.`),
S("m2", `
.......a
.....aaa
...aaaa.
.aaab...
aa..b...
....b...
...b.b..
..bb.bb.`),
S("m3", `
......bb
....aaab
..aaaa..
bbaab...
.b..b...
....b...
..b.b.b.
.bb.b.bb`),
];
