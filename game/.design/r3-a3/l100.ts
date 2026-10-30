const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const S = (id: string, art: string, t: string[] = []) => ({ id, palette: [GOLD, SKY], tally: t, art });
export const A = [
S("k1", `
b.........
.bb....a..
..bbb.....
.b.bbbb...
...bbbbb..
....bbbaa.
..b..baaaa
......aaaa
.....baaa.
.a......b.`),
S("k2", `
bb........
.bbb......
..bbbb..a.
b..bbbb...
...bbbbaa.
....bbaaaa
.b..baaaaa
.....baaaa
......aaa.
.a........`),
S("k3", `
b.........
.bb...b...
..bbb.....
.b.bbbb.a.
...bbbbaa.
.b..bbaaaa
....baaaaa
.....aaaaa
......aaa.
..a.......`),
];
