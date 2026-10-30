const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", UMBER = "#8A5A3C", CREAM = "#C9B8A0";
const m = (art: string, crack: string[]) => ({ id: "kiln-tea-bowl", title: "Piggy Bank", palette: [CORAL, UMBER, GOLD], role: "breather", mechanics: ["cracked","color"], crack, aha: "", art });
export const A = [
m(`
....cc...
..a.cc.a.
.aaaaaaa.
.aaabbaaa
bbaaaaaa.
bbaaaaaab
.aaaaaaa.
.b.b.b.b.`, ["r4.1"]),
m(`
....cc...
..a.cc.a.
.aaaaaaa.
aaa.aaaa.
bbaaaaaab
bbaaaaaa.
.aaaaaaa.
.bb...bb.`, ["r4.1"]),
m(`
....cc...
.a..cc...
.aabbbaa.
aa.aaaaaa
bbaaaaaab
bbaaaaaa.
.aaaaaaa.
.bb...bb.`, ["r4.1"]),
];
