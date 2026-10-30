const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const m = (id: string, art: string, tally: string[] = []) => ({ id, title: "Stargazer's Hat", palette: [NIGHT, GOLD], role: "practise", mechanics: ["color-tally"], tally, aha: "", art });
export const A = [
m("a1", `
b.....a...
.....aa.a.
....aaa.b.
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`),
m("a2", `
b.....a...
b....aa.a.
....aaa.b.
....aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`),
m("a3", `
......a.b.
.b...aa.a.
....aaa...
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
aaaaaaaaaa
.bbbbbbbbb`),
m("a4", `
.b....a...
.....aa.a.
....aaa.b.
....aaa...
..aaabaa..
..aaaaaa..
..aabaaa..
aaaaaaaaaa
bbbbbbbbbb`),
];
