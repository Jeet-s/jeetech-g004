const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const C = (title: string, art: string) => ({ id: "mosaic-compass-rose", title, palette: [NIGHT, GOLD], role: "combine", mechanics: ["stamp", "color"], aha: "", art });
export const A = [
C("c1", `
.....a......
..bbbabbb...
.bb..a..bb..
bb...a..abb.
b....a.a..b.
b...aaa...b.
b.aaababaaaa
b...aaa...b.
b..a.a....b.
bba..a...bb.
.bb..a..bb..
..bbbbbbb...`),
C("c2", `
.....a......
..bbbabbb...
.bb..a..bb..
bb...a..abb.
b...aaaa..b.
b...aaa...b.
b.aaababaaaa
b...aaa...b.
b..aaaa...b.
bba..a...bb.
.bb..a..bb..
..bbbbbbb...`),
C("c3", `
.....a......
..bbbabbb...
.bb..a..ab..
bb...a.a.bb.
b...aaa...b.
b..aaaaa..b.
b.aaababaaaa
b..aaaaa..b.
b...aaa...b.
bb.a.a...bb.
.ba..a..bb..
..bbbbbbb...`),
];
