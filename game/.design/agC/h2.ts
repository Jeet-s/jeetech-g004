const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const m = (id: string, art: string) => ({ id: "stargazer-hat", title: id, palette: [NIGHT, GOLD], role: "practise", mechanics: ["chain","color"], aha: "", art });
export const A = [
m("hat2", `
......aa..
.....a..a.
....aa....
....aaa...
...aabaa..
...aaaaa..
..abaaaba.
..aaaaaaa.
.bbbbbbbbb
aaaaaaaaaa`),
m("hat3", `
.......aa.
......a..a
.....aa...
....abaa..
....aaaa..
...aaaaba.
..abaaaaa.
..bbbbbbb.
aaaaaaaaaa
.aaaaaaaa.`),
m("hat8", `
......aa..
.....aa.a.
.....aaa..
....aabaa.
....aaaaa.
...aaaaaba
...abaaaaa
..bbbbbbbb
aaaaaaaaaa`),
m("hat9", `
......aa..
.....aa.a.
.....aaa..
....abaaa.
....aaaaa.
...aaaabaa
...aaaaaaa
..bbbbbbbb
aaaaaaaaaa`),
m("hat10", `
.......aa.
......aa.a
.....aba..
....aaaa..
....aaaaa.
...abaaaa.
...aaaaba.
..bbbbbbbb
aaaaaaaaaa`),
];
