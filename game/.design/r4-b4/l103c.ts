const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const mk = (id: string, art: string, tally: string[] = []) => ({ id, title: "Moon Rover", palette: [NIGHT, SKY, GOLD], role: "breather", mechanics: ["color-tally"], aha: "", art, tally });
export const A = [mk("moon-rover", `
.bbbb..c....
.bbbb....cc.
...a.....a..
..aaaaaaaaa.
.aabbaaabbaa
aaaaaaaaaaaa
ccc.ccc..ccc
c.c.c.c..c.c
ccc.ccc..ccc`, ["c8"])];
