const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = []) => ({ id, title: "Brass Orrery", palette: [NIGHT, GOLD, SKY, CORAL], role: "combine", mechanics: ["color-tally", "stamp"], aha: "", tally: t, art });
const body = `
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
.b.aaaaaaa.b.`;
export const A = [
S("og1", "\n.d....b....c." + body), S("og2", "\n.c....b....d." + body), S("og3", "\n.b....d....c." + body), S("og4", "\n.c....d....b." + body),
S("og5", "\n.d....c....b." + body), S("og6", "\n.b....c....d." + body),
];
