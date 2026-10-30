const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const mk = (id: string, art: string, tally: string[] = []) => ({ id, title: "Brass Telescope", palette: [GOLD, NIGHT], role: "teach", mechanics: ["color-tally"], aha: "", art, tally });
export const A = [
mk("brass-telescope", `
......bb
....baab
..aaaaa.
bbaab...
.b..b...
....b...
..b.b.b.
.bb.b.bb`, ["c3"]),
];
