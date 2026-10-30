const UMBER = "#8A5A3C", CORAL = "#D9694F", SKY = "#6FA8DC";
const mk = (id: string, art: string, tally: string[] = []) => ({ id, title: "Paint Palette", palette: [UMBER, CORAL, SKY], role: "combine", mechanics: ["void", "color-tally"], aha: "", art, tally });
export const A = [
mk("w1", `
~~~~aaaaaa~~~
~~aaaaaaaaaa~
~aaabbaaccaaa
aaaabbaaccaaa
aaaaaaaaaaaaa
aa~~aaaaabbaa
aa~~aaaaabbaa
aaaaaaaaaaaa~
~aaaaccaaaa~~
~~aaaaaaa~~~~`),
mk("w2", `
~~~~aaaaaa~~~
~~aaa.aaaaaa~
~aa.bb.acca.a
aa.abba.cc.aa
aaa.aaaaa.aaa
aa~~aa.a.bb.a
aa~~a.aaabbaa
aaa.aaa.aaaa~
~aa.acca.aa~~
~~aaaaaaa~~~~`),
];
