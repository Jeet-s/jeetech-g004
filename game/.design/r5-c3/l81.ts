const N = "#2B3A67", G = "#E3A83B", U = "#8A5A3C";
const b = (id: string, art: string, smudge = ["c1"]) => ({ id: "firefly-jar", title: id, palette: [N, G, U], role: "combine", mechanics: ["smudged", "color", "exact-fit"], smudge, aha: "", art });
export const A = [
b("j1", `
b.........
...cccc..b
...cccc...
..aaaaaa..
.aaaaaaaa.
abaaaaabaa
aaaabaaaaa
.aaaaaaaa.
.aaaaaaaa.
..aaaaaa..`),
b("j2", `
b.........
...cccc..b
...cccc...
..aaaaaa..
.aaaaaaaa.
aaaaaaaaaa
abaaabaaba
aaabaaabaa
.aaaaaaaa.
.aaaaaaaa.
..aaaaaa..`),
b("j3", `
b.........
...cccc..b
...cccc...
..aaaaaa..
.aaaaaaaa.
.aaaaaaaa.
abaaabaaba
aaabaaabaa
.aaaaaaaa.
.aaaaaaaa.
..aaaaaa..`),
b("j4", `
b.........
...cccc..b
...cccc...
..aaaaaa..
.aaaaaaaa.
aaaaaaaaaa
abaabaaaba
aaaaaabaaa
.aaaaaaaa.
..aaaaaa..`),
];
