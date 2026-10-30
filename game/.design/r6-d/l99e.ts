const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const m = (id: string, art: string, tally: string[]) => ({ id, title: "Stargazer's Hat", palette: [NIGHT, GOLD], role: "practise", mechanics: ["color-tally"], tally, aha: "", art });
export const A = [
m("e1", `
.b........
......a..b
b.b..aa...
....aaa...
...aaaba.b
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`, ["c4"]),
m("e2", `
.b.b.....b
......a...
..b..aa...
....aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`, ["c4"]),
m("e3", `
.b........
...b..a..b
.b...aa...
....aaa...
...aaaba.b
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`, ["r3"]),
];
