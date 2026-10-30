const S = (id: string, art: string, palette = ["#D9694F", "#2E8C8A"]) => ({ id, title: id, palette, role: "teach", mechanics: ["color"], aha: "", art });
export const A = [
S("st1", `
...b...
.bbbbb.
aabbbaa
aaaaaa.
.aa.aaa
.aaaaa.
..aaa..
...a...`),
S("st2", `
..b.b..
.bbbbb.
aabbbaa
aaaaaaa
.a.aa.a
.aaaaa.
..aaa..`),
S("st3", `
...b...
..bbb..
aabbbaa
aaaaaa.
aa.aaaa
.aaaa.a
..aaa..
...a...`),
];
