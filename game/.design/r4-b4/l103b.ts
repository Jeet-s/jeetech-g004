const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const mk = (id: string, art: string, tally: string[] = [], smudge: string[] = []) => ({ id, title: "Moon Rover", palette: [NIGHT, SKY, GOLD], role: "breather", mechanics: ["color-tally"], aha: "", art, tally, smudge });
const art = `
.bbbb.cc....
.bbbb....c..
...a.....a..
..aaaaaaaaa.
.aabbaaabbaa
aaaaaaaaaaaa
ccc.ccc..ccc
c.c.c.c..c.c
ccc.ccc..ccc`;
export const A = [mk("k1", art, ["c8"]), mk("k1s", art, [], ["c8"]), mk("k2", art.replace(".bbbb.cc....", "cbbbb.......").replace(".bbbb....c..","...")) ];
export const Z = [mk("k0", art)];
