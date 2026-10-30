const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const art = `
.....bbb.....
....bbbbb..c.
....bbbbb.ccc
.c..bbbbb..c.
ccc..bbb...a.
.c....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
......a......
....aaaaa....
..bbbbbbbbb..`;
const S = (id: string, t: string[], a = art) => ({ id, title: "Brass Orrery", palette: [NIGHT, GOLD, SKY], role: "combine", mechanics: ["color-tally", "stamp"], aha: "", tally: t, art: a });
export const A = [S("o0", []), S("o1", ["r4"]), S("o2", ["c1"]), S("o3", ["c11"]), S("o4", ["r4", "c11"]), S("o5", ["c1", "c11"]), S("o6", ["r1","r4"]), S("o7", ["r2","c1"]), S("o8", ["r2","c11"]), S("o9", ["r3","c1"])];
