const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const m = (id: string, art: string, tally: string[]) => ({ id, title: "Stargazer's Hat", palette: [NIGHT, GOLD], role: "practise", mechanics: ["color-tally"], tally, aha: "", art });
const cur = `
b.....a...
b....aa.a.
....aaa.b.
..b.aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`;
export const A = [
m("h0", cur, ["c8"]),
m("h1", cur, ["r2"]),
m("h2", cur, ["r1"]),
m("h3", cur, ["c0"]),
];
export const B = [m("h5", cur, ["r4"])];
export const C = [m("hc", cur, ["r2","c8"])];
