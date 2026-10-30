const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const mk = (id: string, art: string, tally: string[] = []) => ({ id, title: "Brass Telescope", palette: [GOLD, NIGHT], role: "teach", mechanics: ["color-tally"], aha: "", art, tally });
export const A = [
mk("v1", `
.......bb
.aaaaaaab
baaaaaaab
.aaaaaaab
....b....
...bbb...
..b.b.b..
.b..b..b.
b...b...b`),
mk("v2", `
b........
baaaaaa..
baaaaaabb
baaaaaabb
baaaaaa..
....b....
...bbb...
..b.b.b..
.bb.b.bb.`),
mk("v3", `
.......a.
.....aaab
...aaaaab
.aaaaaaa.
bbaaaaa..
bb..b....
...bbb...
..b.b.b..
.bb.b.bb.`),
mk("v4", `
......bb.
..aaaaabb
aaaaaaa..
aaaaa....
bb..b....
...bbb...
..b.b.b..
.b..b..b.
bb..b..bb`),
];
