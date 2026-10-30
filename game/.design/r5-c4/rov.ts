const NIGHT = "#2B3A67", SKY = "#6FA8DC", GOLD = "#E3A83B";
const b = (id: string, art: string) => ({ id, title: "Moon Rover", palette: [NIGHT, SKY, GOLD], role: "breather", mechanics: ["color-tally"], tally: [], aha: "", art });
export const A = [
b("r1", `
..bb.....c..
.bbbb.......
..a......a..
..a.....aaa.
.aaaaaaaaaa.
aabbaaaabbaa
aaaaaaaaaaaa
.cc..cc..cc.
cbbc.cbbc.cbbc`.replace("cbbc.cbbc.cbbc", "cbc.cbc.cbc.")),
b("r2", `
.bb......c..
bbbb........
.a.......a..
.a......aaa.
aaaaaaaaaaa.
abbaaaabbaa.
aaaaaaaaaaaa
.ccc...ccc..
cc.cc.cc.cc.
.ccc...ccc..`),
b("r3", `
..bbb...c...
...b........
...a.....a..
..aaaaaaaaa.
.aabbaaabbaa
aaaaaaaaaaaa
.cc..cc..cc.
cbbccbbccbbc
.cc..cc..cc.`),
];
