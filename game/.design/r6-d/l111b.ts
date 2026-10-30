const NIGHT = "#2B3A67", CORAL = "#D9694F";
const m = (id: string, art: string, crack: string[] = []) => ({ id, title: "Knight's Helmet", palette: [NIGHT, CORAL], role: "practise", mechanics: ["color", "cracked"], crack, aha: "", art });
export const A = [
m("q1", `
bbb.......
.bbbbb....
..bbbbbb..
.baaaaaa..
.aaaaaaaa.
aaaaaaaaaa
a.......aa
aaaaaaaaaa
a.a.a.aaaa
.aaaaaaaa.
aaaaaaaaaa`),
m("q2", `
bbb.......
bbbbbb....
.b.bbbbb..
..aaaaaa..
.aaaaaaaa.
aaaaaaaaaa
a.......aa
aaaaaaaaaa
a.a.a.aaaa
.aaaaaaaa.
aaaaaaaaaa`),
];
export const B = [m("q1c", A[0].art, ["r2.0"]), m("q1d", A[0].art, ["c8.0"]), m("q1e", A[0].art, ["c0.1"])];
