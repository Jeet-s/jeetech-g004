const NIGHT = "#2B3A67", SKY = "#6FA8DC";
const m = (id: string, art: string) => ({ id, title: id, palette: [NIGHT, SKY], role: "practise", mechanics: ["chain","color"], aha: "", art });
export const A = [
m("ast1", `
....aaaa....
..aaaaaaaa..
.aaaaaaaaaa.
aab..bbbbbaa
aab.bbbbbbaa
aabbbbbbbbaa
aabbbbbbbbaa
.aabbbbbbaa.
..aaaaaaaa..
....aaaa....
.aaaaaaaaaa.
aaaaabbaaaaa`),
m("ast2", `
....aaaa....
..aaaaaaaa..
.aaaaaaaaaa.
aab..bbbbbaa
aab.bbbbbbaa
aabbbbbbbbaa
.aabbbbbbaa.
..aaaaaaaa..
....aaaa....
.aaaaaaaaaa.
aaaa.bb.aaaa
aaaa.aa.aaaa`),
m("ast3", `
...aaaaaa...
.aaaaaaaaaa.
aaabbbbbbaaa
aab..bbbbbaa
aab.bbbbbbaa
aabbbbbbbbaa
aabbbbbbbbaa
.aaabbbbaaa.
..aaaaaaaa..
....aaaa....
.aaaaaaaaaa.
aaaaabbaaaaa
aaaaabbaaaaa`),
];
