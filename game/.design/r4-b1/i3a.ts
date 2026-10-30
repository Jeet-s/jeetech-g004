const s = (id: string, art: string, palette = ["#D9694F", "#2E8C8A"]) => ({ id, title: "x", palette, role: "practise", mechanics: ["color"], aha: "", art });
export const A = [
s("rad1", `
.b..b..b.
.bb.b.bb.
..bbbbb..
...bbb...
...aaa...
.aaaaaaa.
aaaaaaaaa
aaaaaaaaa
.aaaaaaa.
..aaaaa..
....a....`),
s("rad2", `
b...b....
bb..b..bb
.bb.b.bb.
..bbbbb..
....b....
..aaaaa..
.aaaaaaa.
aaaaaaaaa
aaaaaaaaa
.aaaaaaa.
...aaa...
....a....`),
s("cher1", `
.....bbb.
....bb...
...b.b...
..b...b..
..b...b..
.aaa.aaa.
aaaaaaaaa
aaaaaaaaa
.aaa.aaa.`),
s("cher2", `
....b.bb.
....bbbb.
...b.b...
..b...b..
.ab..aba.
aaaa.aaaa
aaaa.aaaa
aaaa.aaaa
.aa...aa.`),
];
