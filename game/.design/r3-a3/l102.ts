const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, pal = [CORAL, GOLD, SKY]) => ({ id, palette: pal, art });
export const A = [
S("rp1", `
..........cc.
.....aaa...cc
...aaaaaaa.cc
..aaaaaaaaa..
bbaacccccaabb
.bbbbbbbbbbb.
..aaaaaaaaa..
...aaaaaaa...
.c...aaa.....`),
S("rp2", `
...........c.
.....aaa..cc.
...aaaaaaacc.
..acccccccac.
bbaaaaaaaaabb
.bbbbbbbbbbb.
..aaaaaaaaa..
...acccccca..
.....aaa.....
.c.........c.`),
S("rp3", `
c.........cc.
.....aaa...cc
...aaaaaaa.cc
..aaaaaaaaa..
bbacccccccabb
.bbbbbbbbbbb.
..aaaaaaaaa..
...acccccaa..
.....aaa.....`),
];
