const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const m = (id: string, art: string, tally: string[] = ["r0","r2"]) => ({ id, title: "Lunar Lander", palette: [NIGHT, GOLD, SKY], role: "twist", mechanics: ["color-tally"], tally, aha: "", art });
const top = `
.b...a.....
....aca...b
...accca...
..aaaaaaa..
.bbbbbbbab.
.babbbbbab.`;
export const A = [
m("l1", top + `
..a.....a..
.a......a..
a..b.....a.
aa.......aa`),
m("l2", top + `
..a.....a..
.a......a..
a..b....a..
aa.....aaa.`),
m("l3", top + `
..a.....a..
.a.......a.
a..b.....a.
aa......aaa`),
m("l4", top + `
..a.....a..
.a.......a.
a..b......a
aa......aaa`),
m("l5", top + `
..a.....a..
.a.......a.
a..b......a
aa..b....aa`),
];
