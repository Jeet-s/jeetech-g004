const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const m = (id: string, art: string) => ({ id, title: id, palette: [NIGHT, GOLD], role: "combine", mechanics: ["chain","color"], aha: "", art });
export const A = [
m("orr10", `
.....bbb.....
....bbbbb..a.
....bbbbb.bab
.a..bbbbb..a.
aaa..bbb...a.
.a....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
......a......
....aaaaa....
..bbbbbbbbb..`),
];
