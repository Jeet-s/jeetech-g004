const P = ["#D9694F", "#8A5A3C"];
const m = (id: string, art: string) => ({ id, title: "Apple Basket", palette: P, role: "combine", mechanics: ["color", "exact-fit"], aha: "", art });
export const A = [
m("apple-basket", `
..bbbbb...
.b.....b..
.b....aab.
.baa.aaaab
.baaa.aaab
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`),
m("ab6", `
..bbbbb...
.b.....b..
.b.....aab
.baa.aaaab
.baaa.aaab
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`),
];
