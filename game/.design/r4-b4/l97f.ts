const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const mk = (id: string, art: string, tally: string[] = []) => ({ id, title: "Brass Telescope", palette: [GOLD, NIGHT], role: "teach", mechanics: ["color-tally"], aha: "", art, tally });
export const A = [
mk("y1", `
.......bbb
....aaaabb
.aaaaaaaa.
bbaaaaa...
bb...b....
....bbb...
...b.b.b..
..b..b..b.
.bb..b..bb`),
mk("y2", `
.......bbb
....aaaabb
.aaaaaaaa.
bbaaaaa...
bb...b....
.....b....
....bbb...
...b.b.b..
.bb..b..bb`),
mk("y3", `
......bbbb
...aaaaabb
aaaaaaaaa.
bbaaaa....
bb...b....
....bbb...
...b.b.b..
..b..b..b.
.bb..b..bb`),
];
