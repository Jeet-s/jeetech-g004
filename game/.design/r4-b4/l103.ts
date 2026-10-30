const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const mk = (id: string, art: string, tally: string[] = []) => ({ id, title: "Moon Rover", palette: [NIGHT, SKY, GOLD], role: "breather", mechanics: ["color-tally"], aha: "", art, tally });
export const A = [
mk("r1", `
.bbbb.......
.bbbb...c...
...a....a...
..aaaaaaaaa.
.aabbaaabbaa
aaaaaaaaaaaa
.ccc.ccc.ccc
.c.c.c.c.c.c
.ccc.ccc.ccc`),
mk("r2", `
.bbbb.......
.bbbb...c...
..a.....a...
.aaaaaaaaaa.
.abbaaaabbaa
aaaaaaaaaaaa
.ccc.ccc.ccc
.c.c.c.c.c.c
.ccc.ccc.ccc`),
];
export const B = [
mk("g1", `
.bbbb.......
.bbbb....c..
...a.....a..
..aaaaaaaaa.
.aabbaaabbaa
aaaaaaaaaaaa
ccc.ccc..ccc
c.c.c.c..c.c
ccc.ccc..ccc`),
mk("g2", `
.bbbb.......
.bbbb....c..
...a.....a..
..aaaaaaaaa.
.aabbaaabbaa
.aaaaaaaaaaa
ccc.ccc..ccc
c.c.c.c..c.c
ccc.ccc..ccc`),
];
export const C = [
mk("h1", `
.bbbb.......
.bbbb....c..
...a.....a..
..aaaaaaaaa.
..abbaaabba.
.aaaaaaaaaa.
ccc.ccc..ccc
c.c.c.c..c.c
ccc.ccc..ccc`),
mk("h2", `
..bbbb......
..bbbb...c..
....a....a..
..aaaaaaaaa.
..abbaaabba.
.aaaaaaaaaa.
ccc..ccc.ccc
c.c..c.c.c.c
ccc..ccc.ccc`),
mk("h3", `
..bbbb......
..bbbb...c..
....a....a..
..aaaaaaaaa.
..abbaaabba.
.aaaaaaaaaa.
.ccc.ccc.ccc
.c.c.c.c.c.c
.ccc.ccc.ccc`),
];
