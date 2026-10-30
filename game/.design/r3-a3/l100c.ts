const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = []) => ({ id, palette: [GOLD, SKY], tally: t, art });
export const A = [
S("g1", `
bb.......a
bbbb......
.bbbbb....
..bbbbbb..
...bbbbaa.
.a..bbaaaa
.....aaaaa
.....aaaaa
......aaa.
.a........`),
S("g2", `
bb........
bbbb...a..
.bbbbb....
..bbbbbb..
a..bbbbaa.
....bbaaaa
.....aaaaa
..a..aaaaa
......aaa.`),
S("g3", `
bb......a.
.bbb......
..bbbb....
a..bbbbaa.
....bbaaaa
.....aaaaa
.....aaaaa
.a....aaa.`),
];
