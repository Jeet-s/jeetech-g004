const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = []) => ({ id, title: "Brass Orrery", palette: [NIGHT, GOLD, SKY, CORAL], role: "combine", mechanics: ["color-tally", "stamp"], aha: "", tally: t, art });
export const A = [
S("ob1", `
.....bbb.....
.d..bbbbb..c.
....bbbbb.ccc
.c..bbbbb..c.
ccc..bbb.c.a.
.c....a....a.
.a..d.a....a.
.aaaaaaaaaaa.
......a......
......a......
....aaaaa....
..bbbbbbbbb..`),
S("ob2", `
.....bbb.....
....bbbbb..d.
.d..bbbbb.ddd
.d..bbbbb..d.
ddd..bbb.c.a.
.d....a...ca.
.a..c.a....a.
.aaaaaaaaaaa.
......a......
......a......
....aaaaa....
..bbbbbbbbb..`),
];
