const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const S = (id: string, art: string, pal = [NIGHT, GOLD, SKY]) => ({ id, palette: pal, art });
export const A = [
S("n1", `
.....a.....
....aaa....
...acccа...
...acca....
..aaaaaaa..
.bbbbbbbbb.
.bbabbbabb.
..aa...aa..
.a.......a.
a.........a
aa.......aa`.replace("а","a")),
S("n2", `
.....a.....
....aaa....
...acccа...
...accca...
..aaaaaaa..
.bbbbbbbbb.
.bb.bbb.bb.
..a.....a..
.a..aaa..a.
a.........a
aa.......aa`.replace("а","a")),
S("n3", `
.....b.....
....aaa....
...acca....
...acaa....
..aaaaaaa..
.bbbbbbbbb.
.bbbabbbbb.
..a.....a..
.a..a.a..a.
a...a.a...a
aa.......aa`),
];
