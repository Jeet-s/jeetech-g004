const UMBER = "#8A5A3C", CORAL = "#D9694F";
const b = (id: string, art: string) => ({ id, title: "Rooster", palette: [UMBER, CORAL], role: "boss", mechanics: ["stamp", "color"], aha: "", art });
export const A = [
b("r1", `
..b.b.......
..bbbb...aa.
.aaaa...a..a
bba.a..a..a.
..aaa..a.a.a
..baa.a..a.a
..baaaaaaa..
...aaaaaaa..
....aaaaa...
.....b..b...
.....b..b...
....bb.bb...`),
b("r2", `
...bb.......
..bbbb...aa.
..aaaa..a..a
bbaa.a.a..a.
..aaaa.a.a.a
..baaaa..a.a
..baaaaaaa..
...aaaaaaaa.
....aaaaaa..
.....b..b...
.....b..b...
....bb.bb...`),
b("r3", `
..b.b.......
..bbbb..aaa.
..aaaa.a...a
bbaa.a.a.aa.
..aaaa.aa..a
..baaa.a.aa.
..baaaaaaa..
...aaaaaaa..
....aaaaa...
.....b..b...
.....b..b...
....bb..bb..`),
];
