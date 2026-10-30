const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = []) => ({ id, title: "Brass Orrery", palette: [NIGHT, GOLD, SKY, CORAL], role: "combine", mechanics: ["color-tally", "stamp"], aha: "", tally: t, art });
export const A = [
S("od1", `
.b....b....b.
.....bbb.....
....bbbbb..c.
.d..bbbbb.ccc
ddd.bbbbb..c.
.d...bbb...a.
.a....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
....aaaaa....
.b.aaaaaaa.b.`),
S("od2", `
.b.........b.
.....bbb.....
....bbbbb..c.
.d..bbbbb.ccc
ddd.bbbbb..c.
.d...bbb...a.
.a....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
.b..aaaaa..b.
...aaaaaaa...`),
];
