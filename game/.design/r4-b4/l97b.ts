const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const mk = (id: string, art: string, tally: string[] = []) => ({ id, title: "Brass Telescope", palette: [GOLD, NIGHT], role: "teach", mechanics: ["color-tally"], aha: "", art, tally });
export const A = [
mk("u1", `
.......bb
...aaaabb
.aaaaaaa.
bbaaaa...
bb..b....
...bbb...
..b.b.b..
.b..b..b.
bb..b..bb`),
mk("u2", `
......bbb
...aaaabb
.aaaaaa..
bbaaa....
bb..b....
...bbb...
...bbb...
..b.b.b..
.bb.b.bb.`),
mk("u3", `
.......bb
.....aaab
...aaaaa.
.aaaaaa..
bbaaa....
bb..b....
...bbb...
..b.b.b..
.bb.b.bb.`),
];
