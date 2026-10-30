const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string) => ({ id, title: "Night Observatory", palette: [NIGHT, GOLD, SKY, CORAL], role: "finale", mechanics: ["color-tally", "smudged"], aha: "", art });
export const A = [
S("nd1", `
..ccc.......b..
.cc.........bb.
.cc.......bbd..
..ccc....bb..b.
......aabaa....
....aaabaaaa...
...aaaabaaaaa..
..aaaaaaaaaaaa.
.ddddddddddddd.
.dbbd.dddd.dbbd
.dbbd.d..d.dbbd
.ddddddddddddd.`),
S("nd2", `
..ccc..........
.cc.........b..
.cc........bd..
..ccc....bb..b.
......aabaa....
....aaabaaaa...
...aaaabaaaaa..
..aaaaaaaaaaaa.
.ddddddddddddd.
.dbbd.dddd.dbbd
.dbbd.d..d.dbbd
.ddddddddddddd.`),
S("nd3", `
..ccc.......b..
.cc.........bb.
.cc......bbb...
..ccc....bb..b.
......aabaa....
....aaabaaaa...
...aaaabaaaaa..
..aaaaaaaaaaaa.
.ddddddddddddd.
.dbbd.dddd.dbbd
.dbbd.d..d.dbbd
.ddddddddddddd.`),
S("nd4", `
..ccc.......b..
.cc.........bb.
.cc.......bb...
..ccc....bbb.b.
......aabaa....
....aaabaaaa...
...aaaabaaaaa..
..aaaaaaaaaaaa.
.ddddddddddddd.
.dbbd.dddd.dbbd
.dbbd.d..d.dbbd
.ddddddddddddd.`),
S("nd5", `
..ccc.......b..
.cc.........bb.
.cc.......bbb..
..ccc....bb..b.
......aabaa....
....aaabaaaa...
...aaaabaaaaa..
..aaaaaaaaaaaa.
.ddddddddddddd.
.dbbd.dddd.dbbd
.dbbd.d..d.dbbd
.ddddddddddddd.`),
S("nd6", `
..ccc........b.
.cc............
.cc.......bbd..
..ccc....bb..b.
......aabaa....
....aaabaaaa...
...aaaabaaaaa..
..aaaaaaaaaaaa.
.ddddddddddddd.
.dbbd.dddd.dbbd
.dbbd.d..d.dbbd
.ddddddddddddd.`)];
