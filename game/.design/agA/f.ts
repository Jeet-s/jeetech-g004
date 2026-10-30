const P = ["#D9694F", "#2E8C8A"];
const L = (id: string, art: string) => ({ id, title: id, palette: P, role: "practise", mechanics: ["color"], aha: "", art });
export const A = [
L("sprout-flowerpot", `
.aaa......
aa.aa..aa.
.aaa..a.aa
..b...aaa.
.bb.b..b..
bbb.bbbb.b
.bbbbbbbbb
..bbbbbb..
aaaaaaaaaa
.abababaa.
.aaaaaaaa.
..aaaaaa..`),
L("sprout-flowerpot", `
.aaa......
aa.aa..aa.
.aaa..a.aa
..b...aaa.
.bb.b..b..
bbb.bbbb.b
.bbbbbbbbb
..bbbbbb..
aaaaaaaaaa
.abababab.
.aaaaaaaa.
..aaaaaa..`),
];
