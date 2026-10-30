const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = []) => ({ id, title: "Brass Orrery", palette: [NIGHT, GOLD, SKY, CORAL], role: "combine", mechanics: ["color-tally", "stamp"], aha: "", tally: t, art });
export const A = [
S("oc1", `
.b...bbb.....
....bbbbb..c.
.d..bbbbb.ccc
ddd.bbbbb..c.
.d...bbb...a.
.a....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
.b....a....b.
....aaaaa....
..bbbbbbbbb..`),
S("oc2", `
.....bbb...b.
.b..bbbbb....
....bbbbb..c.
.d..bbbbb.ccc
ddd..bbb...c.
.d....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
.b....a......
....aaaaa..b.
..bbbbbbbbb..`),
];
A.push(S("oc3", `
.b...bbb.....
....bbbbb..c.
.d..bbbbb.ccc
ddd.bbbbb..c.
.d...bbb...a.
.a....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
.b....a......
....aaaaa..b.
..bbbbbbbbb..`), S("oc4", `
.b...bbb.....
....bbbbb..c.
.d..bbbbb.ccc
ddd.bbbbb..c.
.d...bbb...a.
.a....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
......a....b.
.b..aaaaa....
..bbbbbbbbb..`));
