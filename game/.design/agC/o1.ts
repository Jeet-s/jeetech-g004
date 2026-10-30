const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const m = (id: string, art: string) => ({ id, title: id, palette: [NIGHT, GOLD], role: "combine", mechanics: ["chain","color"], aha: "", art });
export const A = [
m("orr7", `
.....bbb.....
....bbbbb..a.
....bbbbb.aaa
.a..bbbbb..a.
aaa..bbb...a.
.a....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
......a......
....aaaaa....
..bbbbbbbbb..`),
m("orr8", `
.....bbb.....
....bbbbb..a.
....bbbbb.bab
.a..bbbbb.aa.
aaa..bbb...a.
.a....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
......a......
....aaaaa....
..bbbbbbbbb..`),
m("orr9", `
.....bbb.....
...bbbbbbb.a.
...bbbbbbbaaa
.a.bbbbbbb.a.
aaa.bbbbb..a.
.a...bbb...a.
.a....a....a.
.aaaaaaaaaaa.
......a......
......a......
....aaaaa....
..bbbbbbbbb..`),
];
