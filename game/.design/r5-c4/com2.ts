const GOLD = "#E3A83B", SKY = "#6FA8DC";
const b = (id: string, art: string) => ({ id, title: "Tailed Comet", palette: [GOLD, SKY], role: "practise", mechanics: ["color-tally"], tally: [], aha: "", art });
export const A = [
b("k1", `
.........aa..
..bbb...aaaa.
.....bbbaaaaa
bbbbbbbbaaaaa
....bbbbaaaaa
..bbb...aaaa.
.........aa..
.a....a......`),
b("k2", `
.......aaa..
.bbbb.aaaaa.
...bbbaaaaaa
bbbbbbaaaaaa
..bbbbbaaaa.
.bbb...aaa..
..........a.
a...a.......`),
b("k3", `
a.......aa...
..bbbb.aaaa..
.....bbaaaaa.
.bbbbbbaaaaaa
...bbbbaaaaa.
bbbb..aaaa...
.......aa..a.`),
];
