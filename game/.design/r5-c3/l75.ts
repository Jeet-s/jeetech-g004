const C = "#D9694F", G = "#E3A83B";
const b = (id: string, art: string, smudge = ["r5"]) => ({ id: "festival-drum", title: id, palette: [C, G], role: "practise", mechanics: ["smudged", "color"], smudge, aha: "", art });
export const A = [
b("d5", `
bb........
bbb....bb.
..b...bb..
.bbbbbbbb.
.aabaaaaba
abaaabbaaa
aaaaaaabaa
.bbbbbbbb.
..a....a..
.aa....aa.`),
b("d6", `
bb........
bbb....bb.
..b...bb..
.bbbbbbbb.
.aaaaaaaaa
aabaabbaba
aaaaaaaaa.
.bbbbbbbb.
..a....a..
.aa....aa.`),
b("d7", `
bb........
bbb....bb.
..b...bb..
.bbbbbbbb.
aaaaaaaaa.
abaaabbaba
.aaaaaaaaa
.bbbbbbbb.
..a....a..
.aa....aa.`),
b("d8", `
bb.........
bbb.....bb.
..b....bb..
.bbbbbbbbb.
aaaaaaaaaa.
abaaabbaaba
.aaaaaaaaaa
.bbbbbbbbb.
..a.....a..
.aa.....aa.`),
];
