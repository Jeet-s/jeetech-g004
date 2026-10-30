const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const S = (id: string, art: string, t: string[] = []) => ({ id, title: "Moon Rover", palette: [NIGHT, SKY, GOLD], role: "breather", mechanics: ["color-tally"], aha: "", tally: t, art });
export const A = [
S("mr1", `
.bbbbb......
.bbbbb...a..
...a.....a..
...a....aaa.
.aaaaaaaaaa.
.abbaaaabba.
aaaaaaaaaaaa
.cc..cc..cc.
.cc..cc..cc.`),
S("mr2", `
.bbbb.....a.
.bbbb.....a.
...a.....aa.
.aaaaaaaaaa.
aabbaaaabbaa
aaaaaaaaaaaa
.cc..cc..cc.
cccc.cc.cccc`),
];
A.push(S("mr3", `
.bbbbb....c.
.bbbbb...a..
...a.....a..
...a....aaa.
.aaaaaaaaaa.
.abbaaaabba.
aaaaaaaaaaaa
.cc..cc..cc.
.cc..cc..cc.`), S("mr4", `
.bbbbb......
.bbbbb...a..
...a.....a.c
...a....aaa.
.aaaaaaaaaa.
.abbaaaabba.
aaaaaaaaaaaa
.cc..cc..cc.
.cc..cc..cc.`));
