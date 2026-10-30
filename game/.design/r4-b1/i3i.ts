const s = (id: string, art: string, palette = ["#D9694F", "#C9B8A0"]) => ({ id, title: "x", palette, role: "combine", mechanics: ["color"], aha: "", art });
export const A = [
s("st1", `
.aabbaabb.
aabbaabbaa
a.b.aa.b.a
.b.a...bb.
.baaa.bbb.
bbbbbbbbbb
.b.bbbb.b.
.b......b.`),
s("st2", `
.aabbaabb.
aabbaabbaa
a.b.aa.b.a
.ba....bb.
.baa..bbb.
bbbbbbbbbb
.b.bbbb.b.
.b......b.`),
s("st3", `
.aabbaabb.
aabbaabbaa
a.b.aa.b.a
.b.a....b.
.baaa.bbb.
bbbbbbbbbb
.b.bbbb.b.
.b......b.`),
];
