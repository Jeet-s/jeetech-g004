const s = (id: string, art: string, palette = ["#D9694F", "#8A5A3C"]) => ({ id, title: "x", palette, role: "combine", mechanics: ["color"], aha: "", art });
export const A = [
s("ab9", `
..bbbbbb..
..b....b..
.aab..baa.
aaaa.aaaa.
aaa.aaa.aa
.bbbbbbbbb
.b.bb.bb.b
..bbbbbbbb
..b.bb.bb.
...bbbbbb.`),
s("ab10", `
...bbbbb..
...b...b..
.aab.aab..
aaaa.aaaa.
aaa.aaa.aa
.bbbbbbbbb
.b.bb.bb.b
..bbbbbbbb
..b.bb.bb.
...bbbbbb.`),
s("ab11", `
..bbbbbb..
..b....b..
.aaa.aaa..
aaaaaaaaa.
.aaa.aaa..
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`),
];
export const B = [s("ab12", `
..bbbbbb..
..b....b..
.aaa.aaa..
aaaaaaaaa.
baaa.aaa.b
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`)];
