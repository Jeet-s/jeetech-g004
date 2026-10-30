const S = (id: string, art: string, palette = ["#D9694F", "#2E8C8A"]) => ({ id, title: id, palette, role: "practise", mechanics: ["color"], aha: "", art });
export const A = [
S("fp4", `
..a.a.a..
..aaaaa..
.bb.a.bb.
..b.b.b..
....b....
..bbbbb..
aaaaaaaaa
.aaaaaaa.
.aaaaaaa.
..aaaaa..`),
S("fp5", `
..a.a.a..
..aaaaa..
.bbaaa.b.
..b.b.bb.
....b....
..bbbbb..
.aaaaaaa.
.aaaaaaa.
..aaaaa..
..aaaaa..`),
S("fp6", `
...a.a...
..aaaaa..
.bbaaabb.
..b.b.b..
....b....
.bbbbbbb.
aaaaaaaaa
.aaaaaaa.
.aaaaaaa.
..aaaaa..`),
];
