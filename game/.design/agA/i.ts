const P = ["#E98F7A", "#8A5A3C"];
const L = (id: string, art: string) => ({ id, title: id, palette: P, role: "twist", mechanics: ["color"], aha: "", art });
export const A = [
L("ice-cream-cone", `
...aaa...
.aaaaaa..
aaaaaaaa.
aaaaaaa..
.aaaaa..a
bbbbbbb..
.b.bb.b.a
.bbbbbb..
..b..b..a
..bbbb...
...bb...a
...bb....`),
L("ice-cream-cone", `
...aa....
..aaaaa..
.aaaaaaa.
aaaaaaaaa
aaaaaaa.a
bbbbbbb..
b.bb.bb.a
.bbbbbb..
.b.bb.b.a
..bbbb...
..b..b..a
...bb....`),
];
