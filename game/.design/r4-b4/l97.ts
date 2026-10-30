const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const mk = (id: string, art: string, tally: string[] = []) => ({ id, title: "Brass Telescope", palette: [GOLD, NIGHT], role: "teach", mechanics: ["color-tally"], aha: "", art, tally });
export const A = [
mk("t1", `
......bb.
....aaab.
..aaaa...
bbaa.....
....b....
...bbb...
..b.b.b..
.b..b..b.
b...b...b`),
mk("t2", `
.......bb
.....aaab
...aaaa..
.bbaa....
.b...b...
....bbb..
...b.b.b.
..b..b..b
.bbb.b.bb`),
mk("t3", `
......bbb
....aaabb
..aaaaa..
bbaaa....
bb..b....
...bbb...
..b.b.b..
.b..b..b.
bb.bbb.bb`),
];
