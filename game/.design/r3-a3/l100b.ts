const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = []) => ({ id, palette: [GOLD, SKY, CORAL], tally: t, art });
export const A = [
S("j1", `
c.b.......
.c..b.....
b.c..b....
.b.cc.b...
..b.ccbaa.
...bbcaaaa
.....aaaaa
....baaaaa
.....aaaa.
.......a..`),
S("j2", `
b..c......
.b..c..b..
..b..c....
...b.cc...
.b..bccaa.
.....baaaa
....caaaaa
.....aaaaa
......aaa.
..b.......`),
S("j3", `
bb.cc.....
..bb.cc...
....bb.cc.
......bbaa
.....bbaaa
.....caaaa
...cc.aaa.
.cc.......`),
S("j4", `
cc........
..cc..b...
....cc....
bb...ccaa.
..bbb.aaaa
.....baaaa
...bb.aaaa
.bb....aa.
b.........`),
];
