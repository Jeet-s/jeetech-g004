const NIGHT = "#2B3A67", SKY = "#6FA8DC", GOLD = "#E3A83B";
const b = (id: string, art: string, tally: string[]) => ({ id, title: "Moon Rover", palette: [NIGHT, SKY, GOLD], role: "breather", mechanics: ["color-tally"], tally, aha: "", art });
const art = `
..b.b...c...
...b........
...a.....a..
..aaaaaaaaa.
.aabbaaabbaa
aaaaaaaaaaaa
.cc..cc..cc.
cbbccbbccbbc
.cc..cc..cc.`;
export const A = [b("v1", art, ["c0"]), b("v2", art, ["c1"]), b("v6", art, ["c5"]), b("v0", art, [])];
