const GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, pal = [GOLD, SKY]) => ({ id, palette: pal, art });
export const A = [
S("m1", `
.b.....aaa..
......aaaaa.
.bbbbaaaaaaa
....baaaaaaa
bbbbbaaaaaaa
......aaaaa.
..bbb..aaa..
a.........b.`),
S("m2", `
.......aaa..
..bbb.aaaaa.
bb...aaaaaaa
.bbbbbaaaaaa
bb...aaaaaaa
..bbb.aaaaa.
.......aaa..
...b.....b..`),
S("m3", `
...b........
.......aaa..
..bbb.aaaaa.
bb...aaaaaaa
.bbbbbaaa.aa
bb...aaaaaaa
..bbb.aaaaa.
.......aaa..
.b......b...`),
S("m4", `
.......aaa..
.bbb..aaaaa.
....baaaaaaa
bbbbbaaaaaaa
....baaaaaaa
.bbb..aaaaa.
.......aaa..
.a.......a..`),
S("m5", `
.......bbb..
..ccc.baaab.
cc...baaaaab
.cccccaaaaab
cc...baaaaab
..ccc.baaab.
.......bbb..
...a.....a..`, [GOLD, SKY, CORAL]),
];
