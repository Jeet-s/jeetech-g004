const NIGHT = "#2B3A67", CORAL = "#D9694F";
const m = (id: string, art: string, crack: string[] = []) => ({ id, title: "Knight's Helmet", palette: [NIGHT, CORAL], role: "practise", mechanics: ["color", "cracked"], crack, aha: "", art });
const body = `
..aaaaaa..
.aaaaaaaa.
aaaaaaaaaa
a.......aa
aaaaaaaaaa
a.a.a.aaaa
.aaaaaaaa.
aaaaaaaaaa`;
export const A = [
m("p1", `
bbbbb.....
..bbbbbb..
.....bbb..` + body),
m("p2", `
bbb.......
.bbbbb....
...bbbbb..` + body),
m("p3", `
.bbbb.....
bb.bbbbb..
.....bbb..` + body),
m("p4", `
bbbb......
..bbbbbb..
....bbb...` + body),
m("p5", `
.bbb......
b..bbbbb..
....bbbb..` + body),
];
