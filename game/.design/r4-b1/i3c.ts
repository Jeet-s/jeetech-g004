const s = (id: string, art: string, palette = ["#D9694F", "#2E8C8A"]) => ({ id, title: "x", palette, role: "practise", mechanics: ["color"], aha: "", art });
export const A = [
s("rad", `
.......b.
bbb.b.bbb
..bbbbb..
....b....
...aaa...
..aaaaa..
.aaaaaaa.
.aaaaaaa.
..aaaaa..
...aaa...
....a....
....a....`),
s("radb", `
.bb....b.
..bb.bbb.
...bbbb..
....b....
...aaa...
..aaaaa..
.aaaaaaa.
.aaaaaaa.
..aaaaa..
...aaa...
....a....
....a....`),
];
export const B = [s("radc", `
..b....b.
bbb.b.bbb
..bbbbb..
....bb...
...aaa...
..aaaaa..
.aaaaaaa.
.aaaaaaa.
..aaaaa..
...aaa...
....a....
....a....`)];
