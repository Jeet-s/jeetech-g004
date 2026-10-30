const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const b = (id: string, art: string, tally = ["r2", "c8"]) => ({ id, title: "Stargazer's Hat", palette: [NIGHT, GOLD], role: "practise", mechanics: ["color-tally"], tally, aha: "", art });
export const A = [
b("x271", `
b.....a...
b....aa.a.
....aaa.b.
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`),
b("x2", `
b.....a...
.....aa.a.
.b..aaa.b.
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`),
b("x3", `
.b....a...
.....aa.a.
b...aaa.b.
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`),
];
