const S = (id: string, art: string, palette = ["#D9694F", "#C9B8A0", "#2E8C8A"]) => ({ id, title: id, palette, role: "combine", mechanics: ["color"], aha: "", art });
export const A = [
S("aw4", `
.aabbaabb.
aabbaabbaa
a.b.aa.b.a
.b......b.
.b.a..c.b.
.baaa.ccb.
bbbbbbbbbb
.b.bbbb.b.
.b......b.`),
S("aw5", `
.aabbaabb.
aabbaabbaa
a.b.aa.b.a
.b.....cb.
.b.a..ccb.
.baaa.ccb.
bbbbbbbbbb
.b.bbbb.b.
.b......b.`),
S("aw6", `
.aabbaabb.
aabbaabbaa
a.b.aa.b.a
.b..a...b.
.b.aa.c.b.
.baaacccb.
bbbbbbbbbb
.b.b..b.b.
.b......b.`),
];
