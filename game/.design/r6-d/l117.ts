const CORAL = "#D9694F", NIGHT = "#2B3A67", GOLD = "#E3A83B";
const m = (id: string, art: string, crack: string[] = ["r3.6"]) => ({ id, title: "Monarch Butterfly", palette: [CORAL, NIGHT, GOLD], role: "combine", mechanics: ["color-cross", "cracked"], crack, aha: "", art });
export const A = [
m("cur", `
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
export const B = [m("o4", `
bbb.b.b....
bacab...bbb
baaabb.bccb
bacabbbaccb
.bbabbbaab.
.baabbbaab.
..bcbbbacab
...bbb.baab
........bb.`)];
