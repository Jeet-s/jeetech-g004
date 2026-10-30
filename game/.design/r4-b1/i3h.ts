const s = (id: string, art: string, palette = ["#E3A83B", "#2E8C8A"]) => ({ id, title: "x", palette, role: "practise", mechanics: ["color"], aha: "", art });
export const A = [
s("corn3", `
....a....
.b.aaa...
.b.aaa.b.
.b.aaa.b.
.baaaaab.
.baaaaab.
bbaaaaabb
.bbaaabb.
..bbabb..
...bbb...
....b....
....b....`),
s("corn4", `
....a....
b..aaa...
.b.aaa.b.
.b.aaa.b.
.baaaaab.
.baaaaab.
bbaaaaabb
.bbaaabb.
..bbabb..
...bbb...
....b....
....b....`),
s("corn5", `
....aa....
.b.aaaa...
.b.aaaa.b.
.b.aaaa.b.
.baaaaaab.
.baaaaaab.
bbaaaaaabb
.bbaaaabb.
..bbaabb..
...bbbb...
....bb....
.....b....`),
];
