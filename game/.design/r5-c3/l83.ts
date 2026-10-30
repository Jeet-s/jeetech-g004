const C = "#D9694F", G = "#E3A83B", U = "#8A5A3C";
const b = (id: string, art: string, smudge = ["c2"]) => ({ id: "lantern-pinwheel", title: id, palette: [C, G, U], role: "combine", mechanics: ["smudged", "color"], smudge, aha: "", art });
export const A = [
b("q0", `
ab...bbbb
aab..bba.
aaa..ba..
aaaa.b...
....c....
...bcaaaa
..abc.aaa
.abbc..ba
babbc...b
....c....
....c....
...ccc...`),
b("q1", `
ab...bbbb
aab..bba.
aaa..ba..
aaaa.b...
....c....
...bcaaaa
..abc.aaa
.abbc..ba
bbbbc...b
....c....
....c....
...ccc...`),
b("q2", `
a....bbbb
aa...bbb.
aaa..bb..
aaaa.b...
....c....
...bcaaaa
..abc.aaa
.abbc..aa
bbbbc...a
....c....
....c....
...ccc...`),
b("q3", `
ab...bbbb
aab..bba.
aaa..ba..
aaaa.b...
....c....
...bcaaaa
..bbc.aaa
.bbbc..ba
bbbbc...b
....c....
....c....
...ccc...`),
b("q4", `
ab...bbbb
aab..bbb.
aaa..ba..
aaaa.b...
....c....
...bcaaaa
..abc.aaa
.abbc..aa
bbbbc...b
....c....
....c....
...ccc...`),
];
