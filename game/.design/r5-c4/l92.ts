const GOLD = "#E3A83B", UMBER = "#8A5A3C", CORAL = "#D9694F";
const b = (id: string, art: string, crack: string[] = []) => ({ id, title: "Honey Jar", palette: [GOLD, UMBER, CORAL], role: "practise", mechanics: ["cracked", "color"], crack, aha: "", art });
export const A = [
b("j1", `
........b.
.......b..
..bbbbbb..
...cccc...
.aaaaaaaa.
aaabbbbaaa
aabccccbaa
aaabbbbaaa
aaaaaaaaaa
.aaaaaaaa.
..aaaaaa..`),
b("j2", `
.......b..
..bbbbbbb.
...cccc...
.aaaaaaaa.
aabbbbbaaa
aab.c.cbaa
aabbbbbbaa
aaaaaaaaaa
.aaaaaaaa.
..aaaaaa..`),
b("j3", `
.......bb.
..bbbbbb..
...cccc...
.aaaaaaaa.
aaabbbbaa.
aabc.cbaaa
aaabbbbaaa
aaaaaaaaaa
.aaaaaaaa.
..aaaaaa..`),
];
const j3 = A[2].art;
A.push(b("j3a", j3, ["r4.0"]), b("j3b", j3, ["r5.5"]), b("j3c", j3, ["r3.0"]));
