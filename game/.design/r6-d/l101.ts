const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const m = (id: string, art: string, tally: string[] = ["r0","r2"]) => ({ id, title: "Lunar Lander", palette: [NIGHT, GOLD, SKY], role: "twist", mechanics: ["color-tally"], tally, aha: "", art });
export const A = [
m("cur", `
.b...a.....
....aca...b
...accca...
..aaaaaaa..
.bbbbbbbab.
.babbbbbab.
..a.....a..
.a.......a.
a..b......a
aa.......aa`),
];
