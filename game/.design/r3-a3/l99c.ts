const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const S = (id: string, art: string, t: string[] = []) => ({ id, palette: [NIGHT, GOLD], tally: t, art });
export const A = [
S("s1", `
.b....aaa.
.....aa..a
..b..aa...
....aaa...
...aaba..b
...aaaa...
..aaaabaa.
.b.aaaaa..
bbbbbbbbbb
.aaaaaaaa.`),
S("s2", `
b.....aa..
.....aa.a.
.b..aaa...
....aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb
..........`),
S("s3", `
.......aa.
..b..aa.a.
....aaa...
....aaab..
...aaaaa..
...abaaa..
..aaaaaba.
.aaaaaaaa.
bbbbbbbbbb
.b......b.`),
];
