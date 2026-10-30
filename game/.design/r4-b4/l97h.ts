const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const mk = (id: string, art: string, tally: string[] = []) => ({ id, title: "Flying Saucer", palette: [NIGHT, GOLD], role: "teach", mechanics: ["color-tally"], aha: "", art, tally });
export const A = [
mk("brass-telescope", `
.b.........
....bbb....
...bb.bb...
.aaaaaaaaa.
aabaabaabaa
.aaaaaaaaa.
...a...a...
..a.....a..
.aa.....aa.`, ["c2"]),
];
