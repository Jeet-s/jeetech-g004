const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = [], sm: string[] = []) => ({ id, title: "Night Observatory", palette: [NIGHT, GOLD, SKY, CORAL], role: "finale", mechanics: ["color-tally", "smudged"], aha: "", tally: t, smudge: sm, art });
export const A = [
S("h1", `
.ccc.......b.
cc.........bb
cc.......bbb.
.ccc....bb..b
.....aabaa...
...aaabaaaa..
..aaaabaaaaa.
.aaaaaaaaaaaa
ddddddddddddd
dbbd.ddd.dbbd
dbbd.d.d.dbbd
ddddddddddddd`),
S("h2", `
.ccc.......b.
cc.........bb
cc.......bbb.
.ccc....bb..b
.....aabaa...
...aaabaaaa..
..aaaabaaaaa.
.aaaaaaaaaaaa
ddddddddddddd
dbbd.ddd.dbbd
dbbd.d.d.dbbd
ddddddddddddd`, [], ["r0"]),
];
