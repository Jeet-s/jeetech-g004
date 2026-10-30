const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const mk = (id: string, art: string, tally: string[] = []) => ({ id, title: "Brass Telescope", palette: [GOLD, NIGHT], role: "teach", mechanics: ["color-tally"], aha: "", art, tally });
const legs = `
bb..b....
...bbb...
..b.b.b..
.bb.b.bb.`;
export const A = [
mk("x1", `
......bbb
....aaabb
..aaaaa..
bbaaaa...` + legs),
mk("x2", `
.......bb
....aaabb
..aaaaaa.
bbaaaa...` + legs),
mk("x3", `
......bbb
...aaaabb
.aaaaaa..
bbaaa....` + legs),
mk("x4", `
......bbb
.....aabb
..aaaaaa.
bbaaaa...` + legs),
mk("x5", `
......bb.
....aaabb
..aaaaab.
bbaaaa...` + legs),
];
