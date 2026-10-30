const CORAL = "#D9694F", NIGHT = "#2B3A67", GOLD = "#E3A83B";
const mk = (id: string, art: string, crack: string[] = []) => ({ id, title: "Monarch Butterfly", palette: [CORAL, NIGHT, GOLD], role: "combine", mechanics: ["color-cross", "cracked"], aha: "", art, crack });
export const A = [
mk("m1c", `
bbb.b.b....
bacabb..bbb
baaabb.bccb
bacabbbaccb
.bbabbbaab.
.baabbbaab.
..bcbbbacab
...bbb.baab
........bb.`),
];
export const B = [{ ...A[0], id: "exhibit-monarch", crack: ["r3.6"] }];
