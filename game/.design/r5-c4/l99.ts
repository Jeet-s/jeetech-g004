const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const b = (id: string, title: string, art: string, palette = [NIGHT, GOLD]) => ({ id, title, palette, role: "practise", mechanics: ["color-tally"], tally: [], aha: "", art });
export const A = [
b("alien", "Little Alien", `
..a.....a..
...a...a...
...aaaaa...
..aaaaaaa..
.aabbabbaa.
.aabbabbaa.
..aaaaaaa..
...aa.aa...
.aaaaaaaaa.
a.aaaaaaa.a
..aa...aa..`),
b("alien2", "Little Alien", `
.b.a.....a.
...a....a..
....aaaaa..
...aaaaaaa.
..aabbabbaa
..aabbabbaa
...aaaaaaa.
....aa.aa..
b.aaaaaaaa.
.a.aaaaaa.a
...aa..aa..`),
b("scope", "Brass Telescope", `
b.......aa..
......aaaa..
....aaaaaa.b
..aaaaaa....
aaaaaa......
aaaa..b.....
.....bbb....
....b.b.b...
...b..b..b..
..b...b...b.`),
b("probe", "Space Probe", `
....aaa.....
...aaaaa....
..aa.b.aa...
.....b......
bbb.aaa.bbbb
bbbbaaabbbbb
bbb.aaa.bbbb
.....a......
....a.a.....
...a...a..a.`),
b("shoot", "Shooting Star", `
.......bb...
......bbbb..
aa...bbbbbbb
.aaa..bbbbb.
..aaabbbbb..
....abbbbbb.
.a..bbb.bbb.
..a.bb...bb.
...a........`),
];
