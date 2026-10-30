const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const art = `
b.b...aa..
.....aa.a.
.b..aaa...
....aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`;
const S = (id: string, t: string[]) => ({ id, palette: [NIGHT, GOLD], tally: t, art });
export const A = [S("q1", ["c4"]), S("q2", ["c5"]), S("q3", ["c4", "c5"]), S("q4", ["c3","c5"])];
