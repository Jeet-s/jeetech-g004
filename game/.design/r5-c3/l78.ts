const G = "#E3A83B", C = "#D9694F";
const b = (id: string, art: string, smudge = ["c6"]) => ({ id: "moon-lantern", title: id, palette: [G, C], role: "boss", mechanics: ["smudged", "color"], smudge, aha: "", art });
export const A = [
b("m0", `
.aaa...b..
aa....bbb.
aa...bbbbb
a....babab
a....babab
a....babab
aa....bbb.
aa.....b..
.aaa...b..
..aaa..b..`),
b("m1", `
.aaa...b..
aa....bbb.
aa...bbbbb
a....babab
a....babab
a....babab
aa...bbbbb
aa.....b..
.aaa...b..
..aaa..b..`),
b("m2", `
.aaa...b..
aa....bbb.
aa...bbbbb
a....babab
a....bbbbb
a....babab
aa....bbb.
aa.....b..
.aaa...b..
..aaa..b..`),
b("m3", `
.aaa...b..
aa....bbb.
aa...bbbbb
a....babab
a....babab
a....babab
aa...bbbbb
aa....bbb.
.aaa...b..
..aaa..b..`),
];
