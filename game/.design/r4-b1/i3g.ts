const s = (id: string, art: string, palette = ["#D9694F", "#E3A83B"]) => ({ id, title: "x", palette, role: "breather", mechanics: ["color"], aha: "", art });
export const A = [
s("bal1", `
...abba...
..aabbaa..
.aaabbaaa.
.aaabbaaa.
aaaabbaaaa
.aaabbaaa.
..aabbaa..
...a..a...
...a..a...
..bbbbbb..
..b.bb.b..
...bbbb...`),
s("bal2", `
...abba...
..aabbaa..
.aaabbaaa.
aaaabbaaaa
.aaabbaaa.
..aabbaa..
...abba...
...a..a...
..a....a..
..bbbbbb..
..bb.b.b..
...bbbb...`),
];
