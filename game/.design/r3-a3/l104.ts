const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const S = (id: string, art: string, t: string[] = []) => ({ id, title: "Astronaut", palette: [NIGHT, SKY, GOLD], role: "practise", mechanics: ["color-tally"], aha: "", tally: t, art });
export const A = [
S("as1", `
....aaaa....
..aaaaaaaa..
.aabbbbbbaa.
.abbbbbbcba.
aabbbbbbbbaa
aabbbbbbbbaa
.aabbbbbbaa.
..aaaaaaaa..
...aaaaaa...
.aaaaccaaaa.
aaaaaccaaaaa
aaaaaaaaaaaa`),
S("as2", `
c...aaaa....
..aa....aa..
.a.bbbbbb.a.
.abbbbbbcba.
a.bbbbbbbb.a
a.bbbbbbbb.a
.a.bbbbbb.a.
..aa....aa..
....aaaa..c.
.aaa.cc.aaa.
aaaa.cc.aaaa
aaaaaaaaaaaa`),
];
A.push(
S("as3", `
....aaaa..c.
..aa....aa..
.a.bbbbbb.a.
.abbbbbbcba.
a.bbbbbbbb.a
a.bbbbbbbb.a
.a.bbbbbb.a.
..aaaaaaaa..
...aaaaaa...
.aaaaccaaaa.
aaaaaccaaaaa
aaaaaaaaaaaa`),
S("as4", `
....aaaa....
..aaaaaaaa..
.aa......aa.
.a.bbbbbc.a.
aa.bbbbbb.aa
aa.bbbbbb.aa
.a..bbbb..a.
.aa......aa.
..aaaaaaaa..
.aaaacaaaaa.
aaaacccaaaaa
aaaaacaaaaaa`),
S("as5", `
c...aaaa....
..aaaaaaaa..
.aabbbbbbaa.
.abbbbbbcba.
aab......baa
aabbbbbbbbaa
.aabbbbbbaa.
..aaaaaaaa..
...aaaaaa..c
.aaaa.caaaa.
aaaa.cc.aaaa
aaaaaaaaaaaa`));
A.push(
S("as6", `
....aaaa....
...abbbba...
...abbcba...
....aaaa....
..aaaaaaaa..
.aa.acaa.aa.
.a..aaaa..a.
.c..aaaa..c.
....a..a....
...aa..aa...
..aaa..aaa..`),
S("as7", `
..c.aaaa....
...abbbba...
...abbbca...
....aaaa..c.
.aaaaaaaaaa.
.a.aacaaa.a.
.a.aaaaaa.a.
cc.aaaaaa.cc
...aa..aa...
...aa..aa...
..aaa..aaa..`));
