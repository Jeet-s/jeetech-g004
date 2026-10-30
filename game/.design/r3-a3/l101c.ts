const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const S = (id: string, art: string, pal = [NIGHT, GOLD, SKY]) => ({ id, palette: pal, art });
export const A = [
S("q1", `
b....a.....
....aaa..b.
...acca....
.b.accaa...
..aaaaaaa..
.bbbbbbbbb.
.bab.b.bab.
..a.....a..
.a.......a.
a.........a
aa.......aa`),
S("q2", `
.b...a.....
....aca...b
...accca...
..aaaaaaa..
.bbbbbbbbb.
.babbbbbab.
..a.....a..
.a.......a.
a..b......a
aa.......aa`),
S("q3", `
.....a...b.
.b..aca....
...accca...
..aaaaaaa..
.bbbbbbbbb.
.babbbbbab.
..a.....a..
.a...b...a.
a.........a
aa.......aa`),
S("q4", `
b....a.....
....aaa....
...acca..b.
...accaa...
..aaaaaaa..
.bbbbbbbbb.
.bab.b.bab.
..a.....a..
ba.......a.
a.........a
aa.......aa`),
];
