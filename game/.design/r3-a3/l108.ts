const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = [], sm: string[] = []) => ({ id, title: "Night Observatory", palette: [NIGHT, GOLD, SKY, CORAL], role: "finale", mechanics: ["color-tally", "smudged"], aha: "", tally: t, smudge: sm, art });
export const A = [
S("nb1", `
.b..........cc.
..........b..cc
....b.....bb.cc
.........bb..cc
......aaabb.cc.
....aaaabbaa...
...aaaabbaaaa..
..aaaaabaaaaaa.
..aaaaaaaaaaaa.
.ddddddddddddd.
.dccd.dddd.dccd
.dccd.d..d.dccd
.ddddddddddddd.`),
S("nb2", `
.b..........cc.
...........b.cc
....b.....b..cc
..........b..cc
......aaab..cc.
....aaaaab.a...
...aaaaabaaaa..
..aaaaabaaaaaa.
..aaaaaaaaaaaa.
.ddddddddddddd.
.dccd.dddd.dccd
.dccd.d..d.dccd
.ddddddddddddd.`),
];
