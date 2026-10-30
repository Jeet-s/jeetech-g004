const GOLD = "#E3A83B", SKY = "#6FA8DC";
const m = (id: string, art: string) => ({ id, title: id, palette: [GOLD, SKY], role: "practise", mechanics: ["chain","color"], aha: "", art });
export const A = [
m("moon7", `
..aaaa....
.aaaa...a.
aaaa...aaa
aaaa....a.
aaaa......
aaaa......
aaaaa.bbb.
.aaaabbbbb
bbaaaaabbb
bbbbbbbbbb`),
m("moon8", `
..aaaa....
.aaa....a.
aaa....aaa
aaa.....a.
aaa.......
aaaa......
aaaaa.bbb.
.aaaaabbbb
bbbaaaaabb
bbbbbbbbbb`),
m("moon9", `
...aaaa...
.aaaa...a.
aaaa...aaa
aaa.....a.
aaa.......
aaaa......
aaaaa.bbb.
.aaaaabbbb
bb.aaaaabb
bbbbbbbbb.`),
];
