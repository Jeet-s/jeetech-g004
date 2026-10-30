const UMBER = "#8A5A3C", PEACH = "#F2B35E", TEAL = "#2E8C8A";
const mk = (id: string, art: string) => ({ id, title: "Mina the Curator", palette: [UMBER, PEACH, TEAL], role: "breather", mechanics: ["color"], aha: "", art });
export const A = [
mk("m1", `
.....c...
..ccccc..
.ccccc.cc
.aaaaaaa.
abbbbbbba
ab.bbb.ba
abbbbbbba
.abb.bba.
..aaaaa..`),
mk("m2", `
......c..
..ccccc..
.ccccc.cc
.aaaaaaa.
abbbbbbba
ab.bbbbba
abbbabbba
.abbbbba.
..aaaaa..`),
mk("m3", `
.....c...
..cccccc.
.cccc.ccc
.aaaaaaa.
abbbbbbba
ab.bbb.ba
abbbbbbba
.abbbbba.
..aaaaa..`),
];
