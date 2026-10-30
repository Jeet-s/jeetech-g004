const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const m = (id: string, art: string, tally: string[] = ["r2","c8"]) => ({ id, title: "Stargazer's Hat", palette: [NIGHT, GOLD], role: "practise", mechanics: ["color-tally"], tally, aha: "", art });
export const A = [
m("cur", `
b.....a...
b....aa.a.
....aaa.b.
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`),
m("d1", `
b.....a...
.....aa.a.
....aaa.b.
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`),
m("d2", `
......a...
b....aa.a.
....aaa.b.
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`),
m("d3", `
b.....a...
b....aa.a.
....aaa.b.
....aaa...
...aaaba..
..baaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`),
m("d4", `
b.....a...
b....aa.a.
....aaa.b.
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
aaaaaaaaaa
bbbbbbbbbb`),
m("d5", `
b.....a...
b....aa.a.
....aaa.b.
.b..aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`),
m("d6", `
.b....a...
.b...aa.a.
....aaa.b.
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`),
];
export const B = [m("cr3", A[0].art, ["r2"]), m("cr5", A[0].art, ["r4"])];
