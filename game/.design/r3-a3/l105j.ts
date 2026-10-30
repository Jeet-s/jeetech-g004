const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const art = `
.....bbb.....
....bbbbb..c.
....bbbbb.ccc
.c..bbbbb..c.
ccc..bbb...a.
.c....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
......a......
....aa.aa....
..bbbbbbbbb..`;
const S = (id: string, t: string[], a = art) => ({ id, title: "Brass Orrery", palette: [NIGHT, GOLD, SKY], role: "combine", mechanics: ["color-tally", "stamp"], aha: "", tally: t, art: a });
export const A = [S("j1", ["c3"]), S("j2", ["c9"]), S("j3", ["c3", "c9"])];
A.push(S("v1", ["c3","c9"], `
~~~..bbb..~~~
~~..bbbbb..c~
~...bbbbb.ccc
.c..bbbbb..c.
ccc..bbb...a.
.c....a....a.
.a....a....a.
.aaaaaaaaaaa.
~.....a.....~
~.....a.....~
~~..aa.aa..~~
~~bbbbbbbbb~~`), S("v2", ["c3","c9"], `
~~...bbb...~~
~...bbbbb..c~
....bbbbb.ccc
.c..bbbbb..c.
ccc..bbb...a.
.c....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
~.....a.....~
~~..aa.aa..~~
~~bbbbbbbbb~~`), S("v3", ["c3","c9"], `
~~~..bbb.....
~~..bbbbb..c.
~...bbbbb.ccc
.c..bbbbb..c.
ccc..bbb...a.
.c....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
......a......
....aa.aa....
..bbbbbbbbb..`));
