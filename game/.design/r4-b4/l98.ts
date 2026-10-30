const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const mk = (id: string, art: string, tally: string[] = ["r5"]) => ({ id, title: "Weather Vane", palette: [GOLD, NIGHT], role: "teach", mechanics: ["color-tally"], aha: "", art, tally });
const bot = `
....b....
.bbbabbb.
....b....
...bbb...
.bbbbbbb.`;
const A0 = [
mk("w1", `
....b....
aa..b..a.
aaaaaaaaa
aa..b..a.` + bot),
mk("w2", `
....b....
a.a.b..a.
.aaaaaaaa
a.a.b..a.` + bot),
mk("w3", `
....b....
aaa.b..a.
.aaaaaaaa
aaa.b..a.` + bot),
mk("w4", `
....b....
.aa.b..a.
aaaabaaaa
.aa.b..a.` + bot),
mk("w5", `
....b....
aa..b.aa.
.aaabaaaa
aa..b.aa.` + bot),
];
const top = `
....b....`;
const mid = `
....b....
.bbbabbb.
....b....
...bbb...
.bbbbbbb.`;
export const B = [
mk("w6", top + `
aa..b..a.
aaabaaaaa
aa..b..a.` + mid),
mk("w7", top + `
aa..b..a.
.aabaaaaa
.a..b..a.` + mid),
mk("w8", top + `
.a..b..a.
aaabaaaaa
.a..b..a.` + mid),
mk("w9", top + `
aa..b..a.
.aabaaaaa
aa..b..a.` + `
....b....
.bbbabbb.
....b....
..bbbbb..
.bbbbbbb.`),
];
