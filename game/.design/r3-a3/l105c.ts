const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, t: string[] = []) => ({ id, title: "Brass Orrery", palette: [NIGHT, GOLD, SKY, CORAL], role: "combine", mechanics: ["color-tally", "void"], aha: "", tally: t, art });
export const A = [
S("ov1", `
~~~..bbb..~~~
~~..bbbbb..c~
~d..bbbbb.ccc
.d..bbbbb..c.
ddd..bbb...a.
.d....a....a.
.a....a..d.a.
.aaaaaaaaaaa.
~.....a.....~
~.b...a...b.~
~~..aaaaa..~~
~~~bbbbbbb~~~`),
S("ov2", `
~~~..bbb..~~~
~b..bbbbb..c~
~...bbbbb.ccc
.d..bbbbb..c.
ddd..bbb...a.
.d....a....a.
.a....a....a.
.aaaaaaaaaaa.
~.....a..d..~
~.....a.....~
~~..aaaaa.b~~
~~~bbbbbbb~~~`),
];
