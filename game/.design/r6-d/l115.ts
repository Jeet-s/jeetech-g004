const UMBER = "#8A5A3C", PEACH = "#F2B35E", TEAL = "#2E8C8A";
const m = (id: string, art: string) => ({ id, title: "Mina the Curator", palette: [UMBER, PEACH, TEAL], role: "breather", mechanics: ["color"], aha: "", art });
export const A = [
m("f1", `
.....c...
..ccccc..
.ccccc.cc
.aaaaaaa.
aabbbbbaa
ab.bbb.ba
abbbbbbba
aabb.bbba
a.bbbbb..
a..bbb...`),
m("f2", `
.....c....
..ccccc...
.cccccc.cc
.aaaaaaaa.
aabbbbbbaa
ab.bbbb.ba
abbbbbbbba
aabbb.bbba
a.bbbbbb..
a..bbbb...`),
m("f3", `
......c...
...ccccc..
.cccccc.cc
.aaaaaaaa.
aaabbbbbaa
aab.bb.ba.
aabbbbbbb.
aabbb.bb..
a.bbbbbb..
...bbbb...`),
];
