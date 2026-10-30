const TEAL = "#2E8C8A", SKY = "#6FA8DC", UMBER = "#8A5A3C";
const b = (id: string, art: string, smudge: string[]) => ({ id, title: "x", palette: [SKY, TEAL, UMBER], role: "combine", mechanics: ["void", "smudged"], aha: "", art, smudge });
export const A = [
b("g1", `
~~aaaaaa~~
~a..bb..a~
a.a.bb..aa
a..bbbb.aa
a.abbbb..a
a.bbbbbb.a
a...cc.a.a
~a..cc..a~
~~aaaaaa~~
~cccccccc~
cccccc.ccc`, ["r10"]),
b("g2", `
~~aaaaa~~
~a..b..a~
a..bbb.aa
a.bbbbb.a
a..bbb..a
aabbbbb.a
a...c..aa
~a..c..a~
~~aaaaa~~
~ccccccc~
cc.ccc.cc`, ["r10"]),
b("g3", `
~~aaaaa~~
~a..b..a~
a..bbb.aa
a.bbbbb.a
a..bbb..a
aabbbbb.a
a...c..aa
~a..c..a~
~~aaaaa~~
~ccccccc~
ccc.c.ccc`, ["r10"]),
];
