const GOLD = "#E3A83B", SKY = "#6FA8DC";
const b = (id: string, art: string) => ({ id, title: "Tailed Comet", palette: [GOLD, SKY], role: "practise", mechanics: ["color-tally"], tally: [], aha: "", art });
export const A = [
b("p1", `
........aaa.
..bbb..aaaaa
bbbbbbbaaaaa
....bbbaaaaa
.bbbbb..aaa.
a.........a.`),
b("p2", `
.........aa.
...bbbb.aaaa
bbbbbbbaaaaa
..bbbbbaaaaa
.....bb.aaaa
.bbbb....aa.
a.....a.....`),
b("p3", `
a........aa..
....bbb.aaaa.
bbbbbbbaaaaaa
..bbbbbaaaaaa
bbbb..baaaaaa
.....bb.aaaa.
..bbb....aa..
.......a....a`),
b("p4", `
.........aa..
.bbbbb..aaaa.
...bbbbaaaaaa
bbbbbbbaaaaaa
.....bbaaaaaa
..bbbb..aaaa.
.........aa..
.a.....a.....`),
];
