const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = [], sm: string[] = []) => ({ id, title: "Night Observatory", palette: [NIGHT, GOLD, SKY, CORAL], role: "finale", mechanics: ["color-tally", "smudged"], aha: "", tally: t, smudge: sm, art });
export const A = [
S("nc1", `
..ccc.......b..
.cc.........bb.
.cc.......bb...
..ccc....bb..b.
......aabaa....
....aaabaaaa...
...aaaabaaaaa..
..aaaaaaaaaaaa.
.ddddddddddddd.
.dbbd.dddd.dbbd
.dbbd.d..d.dbbd
.ddddddddddddd.`),
S("nc2", `
..ccc..........
.cc.........b..
.cc.......bb.b.
..ccc....bb....
......aabaa....
....aaabaaaa...
...aaaabaaaaa..
..aaaaaaaaaaaa.
.ddddddddddddd.
.dbbd.dddd.dbbd
.dbbd.d..d.dbbd
.ddddddddddddd.
.b...........b.`),
];
