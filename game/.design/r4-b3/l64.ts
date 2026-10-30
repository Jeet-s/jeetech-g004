const TEAL = "#2E8C8A", SKY = "#6FA8DC", CORAL = "#D9694F";
const b = (id: string, art: string) => ({ id, title: "Watering Can", palette: [TEAL, SKY, CORAL], role: "practise", mechanics: ["color-cross"], aha: "", art });
export const A = [
b("w8", `
..aaaa......
.a....a...aa
.a....a..aab
aaaaaaaa.a.b
aaaaaaaaaa.b
aaacaaaaa.b.
aacccaaa..b.
aaacaaaa....
aaaaaaaa....
.aaaaaa.....`),
b("w9", `
..aaaa......
.a....a...aa
.a....a..aab
aaaaaaaa.a.b
a......aaa.b
a..cc..aa.b.
a.cccc.a..b.
a.cccc.a....
a..cc..a....
aaaaaaaa....`),
b("w10", `
..aaaa......
.a....a...aa
.a....a..aab
aaaaaaaa.a.b
aaaaaaaaaa.b
aa.cc.aaa.b.
a.cccc.a..b.
a.cccc.a....
aa.cc.aa....
aaaaaaaa....`),
b("w11", `
..aaaa......
.a....a...aa
.a....a..aab
aaaaaaaa.a.b
a......aaa.b
a.c..c.aa.b.
a..cc..a..b.
a.c..c.a....
a......a....
aaaaaaaa....`),
];
