const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, pal = [GOLD, NIGHT]) => ({ id, title: id, palette: pal, art });
export const A = [
S("a", `
......aa
....aaaa
..aaaab.
aabaa...
aa.bb...
...bb...
..b..b..
.bb..bb.`),
S("b", `
.....aaa
...aaaaa
.baaaa..
aabaa...
aa.bb...
...bb...
..b..b..
.b....b.`),
S("c", `
......ab
....aaab
..aaaab.
aaaab...
aaa.b...
...bbb..
..b.b.b.
.b..b..b`),
S("d", `
......aa
....aaaa
..aaaaa.
aabaa...
aa.b....
..bbb...
.b.b.b..
b..b..b.`),
S("e", `
.....aab
...aaaab
.aaaaab.
aaaab...
.a..b...
...bbb..
..b.b.b.
.b..b..b`),
S("f", `
.......a
.....aaa
...aaaa.
.aaaab..
aab.bb..
a..bbb..
..b.b.b.
.b..b..b`),
];
