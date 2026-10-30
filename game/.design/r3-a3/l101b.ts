const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const S = (id: string, art: string, pal = [NIGHT, GOLD, SKY]) => ({ id, palette: pal, art });
export const A = [
S("p1", `
.....a.....
....aaa....
...acca....
...accaa...
..aaaaaaa..
.bbbbbbbbb.
.bab.b.bab.
..a.....a..
.a.......a.
a.........a
aa.......aa`),
S("p2", `
....b......
....a......
...aaaa....
..acccaa...
..accaaa...
.aaaaaaaa..
bbbbbbbbbb.
.bab..bab..
.a......a..
a........a.
aa.......aa`),
S("p3", `
.....a.....
....aaa....
...aacaa...
...acccaa..
..aaaaaaa..
.bbbbbbbbb.
.b.bbbbb.b.
.a..a.a..a.
a..a...a..a
a.........a
aa.......aa`),
S("p4", `
.....a.....
....aca....
...accca...
..aaaaaaa..
.bbbbbbbbb.
.babbbbbab.
..a.....a..
.a.......a.
a.........a
aa.......aa`),
];
