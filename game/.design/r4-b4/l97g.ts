const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const mk = (id: string, art: string, tally: string[] = []) => ({ id, title: "Flying Saucer", palette: [GOLD, NIGHT], role: "teach", mechanics: ["color-tally"], aha: "", art, tally });
export const A = [
mk("u1", `
....bbb....
...bbbbb...
..bb.b.bb..
.aaaaaaaaa.
aabaabaabaa
.aaaaaaaaa.
...a...a...
..a.....a..
.aa.....aa.`),
mk("u2", `
....bbb....
...b.b.b...
..bbbbbbb..
.aaaaaaaaa.
abaabababaa
.aaaaaaaaa.
..a.....a..
.a.......a.
aa.......aa`),
mk("u3", `
.b.......b.
....bbb....
...bb.bb...
.aaaaaaaaa.
aabaabaabaa
.aaaaaaaaa.
...a...a...
..a.....a..
.aa.....aa.`),
];
