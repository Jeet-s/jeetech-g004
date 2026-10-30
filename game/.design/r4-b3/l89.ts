const TEAL = "#2E8C8A", CORAL = "#D9694F", CREAM = "#C9B8A0";
const b = (id: string, art: string, crack: string[]) => ({ id, title: "Flower Tile", palette: [TEAL, CORAL, CREAM], role: "twist", mechanics: ["cracked", "color"], crack, aha: "", art });
const t2 = `
aaaaaaaaaaaa
a....bb..c.a
a..bbbbbb..a
a.bbbccbbb.a
abbbccccbbba
a.bbbccbbb.a
a..bbbbbb..a
a....bb....a
a.c..a.....a
aaaaaaaaaaaa`;
const t4 = `
aaaaaaaaaaaa
a....bb....a
a..bbbbbb..a
a.bbbccbbb.a
abbbccccbbba
a.bbbccbbb.a
a..bbbbbb..a
a....bb....a
a....a.....a
aaaaaaaaaaaa`;
const t6 = `
aaaaaaaaaaaa
a....bb....a
a..bbbbbb..a
a.bbbccbbb.a
abbbccccbbba
a.bbbccbbb.a
a..bbbbbb..a
a....ba....a
a...aa.....a
aaaaaaaaaaaa`;
const t7 = `
aaaaaaaaaaaa
a...bb.....a
a..bbbbbb..a
a.bbbccbbb.a
abbbcccbbbba
a.bbbccbbb.a
a..bbbbbb..a
a....bb....a
a....a.....a
aaaaaaaaaaaa`;
export const A = [b("t5", t2, ["r4.2"]), b("t4", t4, ["r4.2"]), b("t6", t6, ["r4.2"]), b("t7", t7, ["r4.2"]), b("t8", t7, ["r3.1"])];
