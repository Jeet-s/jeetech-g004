const P = ["#D9694F", "#8A5A3C"];
const m = (id: string, art: string) => ({ id, title: "Apple Basket", palette: P, role: "combine", mechanics: ["color", "exact-fit"], aha: "", art });
export const A = [
m("apple-basket", `
..bbbbbb..
.bb....b..
.b....aab.
.baa..aaab
.baaa.aaab
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`),
m("ab2", `
...bbbbb..
..b....bb.
.b....aab.
.baa..aaab
.baaa.aaab
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`),
m("ab3", `
...bbbb...
..bb...b..
.bb...aab.
.baa..aaab
.baaa.aaab
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`),
m("ab4", `
..bbbb....
.b....b...
.b....aab.
.baa.aaaab
.baaa.aaab
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`),
];
