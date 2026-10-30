const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = [], pal = [GOLD, SKY]) => ({ id, palette: pal, tally: t, art });
export const A = [
S("f1", `
.a.........a
.......aaa..
.bbbb.aaaaa.
.....aaaaaaa
bbbbbbaaaaaa
.....aaaaaaa
..bbb.aaaaa.
.......aaa..
...a........`),
S("f2", `
...a........
.......aaa..
..bbb.aaaaa.
bb...aaaaaaa
.bbbbbaaaaaa
bb...aaaaaaa
..bbb.aaaaa.
.......aaa..
.a........a.`),
S("f3", `
.......ccc..
.bbbb.caaac.
.....caaaaac
bbbbbcaaaaac
.....caaaaac
..bbb.caaac.
.......ccc..
.a.......a..`, [], [GOLD, SKY, CORAL]),
S("f4", `
.......bbb..
.cccc.baaab.
.....baaaaab
ccccccaaaaab
.....baaaaab
..ccc.baaab.
.......bbb..
...a......a.`, [], [GOLD, SKY, CORAL]),
];
