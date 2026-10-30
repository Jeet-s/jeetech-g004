const G = "#E3A83B", C = "#D9694F";
const b = (id: string, art: string, smudge = ["r6"]) => ({ id: "festival-candle", title: id, palette: [G, C], role: "breather", mechanics: ["smudged", "color"], smudge, aha: "", art });
export const A = [
b("k1", `
..a...a..
....a....
...aaa...
..a.a.a..
....b....
.bbbbbbb.
.bbbbbbb.
.bbbbbbbb
.bbbbbbb.
aaaaaaaa.
.aaaaaa..`),
b("k2", `
..a...a..
....a....
...aaa...
..aaaaa..
....b....
.bbbbbbb.
.bbbbbbbb
.bbbbbb.b
.bbbbbbb.
aaaaaaaaa
.aaaaaaa.`, ["r6"]),
b("k3", `
.a.....a.
....a....
...aaa...
.a.aaa.a.
....b....
.bbbbbbb.
.bbbbbbbb
.bbbbbbb.
.bbbbbbb.
aaaaaaaaa
..aaaaa..`, ["r6"]),
b("k4", `
.a.....a.
....a....
...aaa...
.a.aaa.a.
....b....
..bbbbbb.
.bbbbbbb.
.bbbbbbb.
.bbbbbbb.
aaaaaaaaa
..aaaaa..`, ["r6"]),
];
