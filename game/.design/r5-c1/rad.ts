const P = ["#D9694F", "#2E8C8A"];
const S = (art: string, n = "") => ({ id: "bunch-carrot" + n, title: "Radish", palette: P, role: "practise", mechanics: ["color"], aha: "", art });
export const A = [S(`
....b..b.
...bb.bbb
...bbbbb.
...bbbb..
..aaaaa..
.aaaaaaa.
aaaaaaaa.
aaaaaaaa.
.aaaaaa..
..aaaa...
..aaa....
...a.....`, "a"), S(`
....b..b.
...bb.bbb
...bbbbb.
...bbbb..
..aaaaa..
.aaaaaaa.
aaaaaaaa.
aaaaaaaa.
.aaaaaa..
...aaa...
..aaa....
...a.....`, "c"), S(`
.....b.b.
...bbb.bb
..b.bbbb.
...bbbb..
..aaaaa..
.aaaaaaa.
aaaaaaaa.
aaaaaaa..
.aaaaaa..
..aaaa...
..aaa....
...a.....`, "b")];
