const S = (id: string, art: string, palette = ["#8C6BB1", "#E3A83B", "#C9B8A0"]) => ({ id, title: id, palette, role: "boss", mechanics: ["color"], aha: "", art });
export const A = [
S("j1", `
..bbbbbb..
.bbbbbbbb.
..a....a..
.a.aaaa.a.
a.cccccc.a
a.ccaacc.a
a.caaaac.a
a.ccaacc.a
a.cccccc.a
a.aaaaaa.a
.aaaaaaaa.`),
S("j2", `
..bbbbbb..
.b.b.b.b..
..aaaaaa..
.aaaaaaaa.
aacccccc.a
a.ccaaccaa
aacaaaacaa
a.ccaacc.a
aacccccc.a
aaaaaaaaaa
.aaaaaaaa.`),
S("j3", `
.bbbbbbbb.
b.b.b.b.b.
.a......a.
a.aaaaaa.a
accccccc.a
a.ccacc..a
acc.aaccca
a.cccccc.a
a.aaaaaa.a
.aaaaaaaa.`),
];
