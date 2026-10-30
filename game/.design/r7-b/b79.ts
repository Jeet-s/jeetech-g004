const G = "#E3A83B", C = "#D9694F", U = "#8A5A3C";
const m = (art: string, smudge: string[]) => ({ id: "festival-candle", title: "Rabbit Lantern", palette: [G, C, U], role: "breather", mechanics: ["smudged","color"], smudge, aha: "", art });
export const A = [
m(`
.b.b..cc
.b.b..c.
aaaa..c.
abaaaaca
aaaaaaaa
aaaaaaab
.aaaaaa.
.bb..bb.`, ["r3"]),
m(`
.b.b..cc
.b.b..c.
aaaa..c.
abaaaaca
aaaaaaaa
aaaaaaab
.aaaaaa.
.bb..bb.`, ["c1"]),
m(`
.b.b....
.b.b....
aaaa....
abaaaaa.
aaaaaaaa
aaaaaaab
.aaaaaa.
.bb..bb.`, ["r3"]),
m(`
.bb.b..c
..b.b.c.
.aaaacc.
abaaaaaa
aaaaaaaa
aaaaaaab
.aaaaaa.
.bb..bb.`, ["r3"]),
m(`
.bb.b..c
..b.b.c.
.aaaacc.
abaaaaaa
aaaaaaaa
aaaaaaab
.aaaaaa.
.bb..bb.`, ["c1"]),
];
