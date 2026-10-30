const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, pal = [NIGHT, GOLD], t: string[] = []) => ({ id, palette: pal, tally: t, art });
export const A = [
S("h1", `
.......aa.
......a..a
.....aa...
.....aa...
....aaba..
....aaaa..
...abaaba.
...aaaaaa.
.bbbbbbbbb
aaaaaaaaaa`),
S("h2", `
.....aaa..
....aa..a.
....aa....
...aaba...
...aaaa...
..abaaaa..
..aaaaba..
.aaaaaaaa.
bbbbbbbbbb
.aaaaaaaa.`),
S("h3", `
......aaa.
.....aa..b
....aaa...
....abaa..
...aaaaa..
...aaaaba.
..abaaaaa.
..aaaaaaa.
.bbbbbbbbb
aaaaaaaaaa`),
];
