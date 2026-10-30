const P = ["#E3A83B", "#5E8C3A"];
const L = (id: string, art: string) => ({ id, title: id, palette: P, role: "practise", mechanics: ["color"], aha: "", art });
export const A = [
L("ripe-pear", `
...b....
..bb.bb.
...bbb..
..aaa...
.aaaaa..
.a.aaaa.
a.aaaaa.
aaaaaaaa
aaaaaaa.
.aaaaa..`),
L("ripe-pear", `
...b....
...b.bb.
...bbb..
..aaa...
..aaaa..
.aaaaaa.
aa.aaaa.
a.aaaaaa
aaaaaaa.
.aaaaa..`),
L("ripe-pear", `
...b....
...b.bb.
...bbb..
...aa...
..aaaa..
.aaaaaa.
.a.aaaa.
a.aaaaaa
aaaaaaaa
.aaaaaa.`),
];
