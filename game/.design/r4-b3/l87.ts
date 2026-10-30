const TEAL = "#2E8C8A", GOLD = "#E3A83B";
const b = (id: string, art: string) => ({ id, title: "Leaning Vase", palette: [TEAL, GOLD], role: "practise", mechanics: ["cracked", "color"], crack: ["r5.0"], aha: "", art });
export const A = [
b("v1", `
....bb...
....aa...
...aaaa..
...abba..
..aaaaaa.
..aaaaaa.
.aabaabaa
aaa.aaaaa
aaaaaaaaa
...bbbb..`),
b("v2", `
....bb...
....aa...
...aaaa..
...abba..
..aaaaaa.
..aaaaaa.
.aabaabaa
aaa.aaaaa
.aaaaaaa.
..bbbbb..`),
b("v3", `
....bb...
....aa...
...aaaa..
...abba..
..aaaaaa.
..aaaaaa.
aaabaabaa
aaa.aaaaa
.aaaaaaa.
...bbbb..`),
];
