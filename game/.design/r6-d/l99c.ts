const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const m = (id: string, art: string, tally: string[] = []) => ({ id, title: "Stargazer's Hat", palette: [NIGHT, GOLD], role: "practise", mechanics: ["color-tally"], tally, aha: "", art });
const a2 = `
b.....a...
b....aa.a.
....aaa.b.
....aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`;
const a5 = `
b.....a...
b....aa.a.
....aaa.b.
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
aaaaaaaaaa
bbbbbbbbbb`;
const a6 = `
.b....a...
b....aa.a.
....aaa.b.
....aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`;
export const A = [
m("a2", a2, ["r2","c8"]), m("a5", a5, ["r2","c8"]), m("a6", a6, ["r2","c8"]),m("a6b", a6, ["r2"]),m("a6c", a6, ["c8"]),
];
export const B = [m("a2r", a2, ["r2"]), m("a2c", a2, ["c8"]), {...m("a2s1", a2, ["r2"]), smudge:["c8"]}, {...m("a2s2", a2, ["c8"]), smudge:["r2"]}];
