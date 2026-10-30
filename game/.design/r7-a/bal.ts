const P = ["#D9694F", "#E3A83B"];
const B = (title: string, art: string) => ({ id: "sunny-lemon", title, palette: P, role: "breather", mechanics: ["color"], aha: "", art });
export const A = [
B("b8", `
...aaaa.
..aabbaa
.aabbbaa
aabbbbaa
.aabbaa.
..a..a..
..a.ab..
..bbbb..`),
B("b9", `
...aaaa.
..aabbaa
.aabbbba
.aabbbba
..aabba.
..a..a..
..a.ab..
..bbbb..`),
B("b10", `
..aaaa..
.aabbaa.
aabbbbaa
aabbbbaa
.aabbaa.
...a.a..
..a.ab..
..bbbb..`),
B("b11", `
...aaaa.
..aabbaa
.aabbbaa
.aabbbaa
..aabaa.
..a..a..
..a.ab..
..bbbb..`),
];
