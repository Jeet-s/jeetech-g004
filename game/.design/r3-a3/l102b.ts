const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, pal = [CORAL, GOLD, SKY]) => ({ id, palette: pal, art });
export const A = [
S("s1", `
...........cc
.....aaa....c
...aaaaaaa..c
..aaccccaaacc
bbbbbbbbbbbbb
b.aaaaaaaaa.b
.bbbbbbbbbbb.
...accccaa...
.....aaa.....
.c.........c.`),
S("s2", `
..........cc.
.....aaa...cc
...aaaaaaa..c
..aaaaaaaaa..
bbbaaaaaaabbb
b..bbbbbbb..b
.bb.ccccc.bb.
...bbbbbbb...
...aaaaaaa...
.....aaa..c..`),
S("s3", `
..........cc.
.....aaa....c
...aaccccc..c
.bbbbbbbbbbcc
b.aaaaaaaaa.b
.bbbbbbbbbbb.
...accccca...
.....aaa.....
.c........c..`),
];
