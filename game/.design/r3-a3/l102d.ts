const GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t = ["c8", "r4", "r0"]) => ({ id, title: "Ringed Planet", palette: [CORAL, GOLD, SKY], role: "boss", mechanics: ["color-cross", "color-tally"], aha: "", tally: t, art });
export const A = [
S("ringed-planet", `
.........acc.
..bc.aaa....c
...aaccccc..c
.bbbbbbbbbbcc
b.aaaaaaaaa.b
.bbbbbbbbbbb.
b..accccca...
.....aaa.....
.c........c..`),
S("v2", `
..........cc.
..b..aaa..a.c
...aaccccc..c
.bbbbbbbbbbcc
b.aaaaaaaaa.b
.bbbbbbbbbbb.
b..accccca...
.....aaa.....
.c........c..`),
S("v3", `
..........cc.
.cb..aaa....c
...aaccccc..c
.bbbbbbbbbbcc
b.aaaaaaaaa.b
.bbbbbbbbbbb.
b..accccca...
.....aaa.....
.c........c..`),
];
