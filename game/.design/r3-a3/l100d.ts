const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = []) => ({ id, palette: [GOLD, SKY], tally: t, art });
export const A = [
S("e1", `
bb........
bbbb...a..
.bbbbb....
..bbbbbb..
a..bbbbaa.
....bbaaaa
.....aaaaa
a....aaaaa
......aaa.`),
S("e2", `
bb.....a..
bbbb......
.bbbbb....
..bbbbbb..
...bbbbaa.
a...bbaaaa
.....aaaaa
.....aaaaa
.a....aaa.`),
S("e3", `
bb........
bbbb....a.
.bbbbb....
..bbbbbb..
...bbbbaa.
....bbaaaa
.a...aaaaa
.....aaaaa
...a..aaa.`),
];
