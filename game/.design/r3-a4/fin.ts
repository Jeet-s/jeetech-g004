const UMBER = "#8A5A3C", SKY = "#6FA8DC", CORAL = "#D9694F";
const mk = (id: string, art: string, x: any = {}) => ({ id, title: "Masterwork: The Grand Easel", palette: [UMBER, SKY, CORAL], role: "finale", mechanics: ["stamp", "color-cross", "smudged", "cracked", "color-tally"], aha: "", art, smudge: ["r12"], crack: ["r1.0"], ...x });
export const A = [
mk("f1", `
.......aa.......
.aaaaaaaaaaaaaa.
.a.........cc.a.
.a...b....cCcca.
.a..bbb...cccca.
.a.bbbbb...cc.a.
.a.bbbbbb.....a.
.abbbbbbbb..b.a.
.abbbbbbbbbbbba.
.a.bb..bb..bb.a.
.aaaaaaaaaaaaaa.
aaaaaaaaaaaaaaaa
.a.....aa.....a.
A......aa......A`),
];
export const B = [{ ...A[0], id: "f1a", tally: ["c14"] }, { ...A[0], id: "f1b", tally: ["c14", "c2"] }, { ...A[0], id: "f1c", tally: ["c14", "c4"] }, { ...A[0], id: "f1d", tally: ["c14", "r9"] }];
export const C = [{ ...A[0], id: "f1e", tally: ["c14", "c12"] }];
export const D = [{ ...A[0], id: "f1f", tally: ["c14", "c15"] }];
