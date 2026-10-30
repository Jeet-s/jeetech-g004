const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const m = (id: string, art: string) => ({ id, title: id, palette: [NIGHT, GOLD], role: "practise", mechanics: ["chain","color"], aha: "", art });
export const A = [
m("hat4", `
......aaa.
.....aa...
....aaa...
....abaa..
...aaaaa..
...aaaaba.
..aaaaaaa.
..bbbbbbb.
aaaaaaaaaa`),
m("hat5", `
.......aa.
......aa.a
.....aaa..
....aabaa.
....aaaaa.
...aaaaaa.
...abaaaa.
..bbbbbbbb
aaaaaaaaaa`),
m("hat6", `
......aaa.
.....aa..a
.....aa...
....aaaa..
....abaa..
...aaaaaa.
...aaaaba.
..bbbbbbbb
aaaaaaaaaa`),
m("hat7", `
......aa..
.....aa.a.
.....aaa..
....aabaa.
....aaaaa.
...aaaaaaa
...abaaaba
..bbbbbbbb
aaaaaaaaaa`),
];
