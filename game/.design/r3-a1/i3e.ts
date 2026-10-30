const S = (id: string, art: string, palette = ["#D9694F", "#E3A83B"]) => ({ id, title: id, palette, role: "breather", mechanics: ["color"], aha: "", art });
export const A = [
S("b1", `
...abba...
..aabbaa..
.aaabbaaa.
aaabbbbaaa
aaabbbbaaa
.aabbbbaa.
..abbbba..
...a..a...
...a..a...
..bbbbbb..
..babbab..
...bbbb...`),
S("b2", `
...abba...
..aabbaa..
.aaabbaaa.
aaabbbbaaa
aaabbbbaaa
.aabbbbaa.
..aabbaa..
...a..a...
..a....a..
.bbbbbbbb.
.b.abba.b.
..bbbbbb..`),
];
