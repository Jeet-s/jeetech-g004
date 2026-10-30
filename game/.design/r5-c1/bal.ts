const P = ["#D9694F", "#E3A83B"];
const S = (art: string, n = "") => ({ id: "sunny-lemon" + n, title: "Hot-Air Balloon", palette: P, role: "breather", mechanics: ["color"], aha: "", art });
export const A = [S(`
..abba..
.aabbaa.
aaabbaaa
aaabbaaa
.aabbaa.
..abba..
..a..a..
..a..ab.
..bbbb..
..b.bb..`, "a"), S(`
..abba...
.aabbaa..
aaabbaaa.
aaabbaaa.
.aabbaa..
..abba...
..a..a...
..a..a.b.
.bbbbbbb.
..b.bb...`, "b"), S(`
..abba..
.aabbaa.
aaabbaaa
aaabbaaa
.aabbaa.
..abba..
..a..a..
..a..a.b
..bbbbbb
..bbb.b.`, "c"), S(`
...abba..
..aabbaa.
.aaabbaaa
.aaabbaaa
..aabbaa.
...abba..
...a..a..
b..a..a..
bbbbbbb..
..bb.bb..`, "d")];
