const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";
const S = (id: string, art: string, lock: string, pal = [GOLD, NIGHT]) => ({ id, title: id, palette: pal, art, lock, tally: "auto", minColors: 2 });
export const A = [
S("g", `
......aa
....aaaa
..aaaab.
aabaa...
aa.bb...
...bb...
..b..b..
.bb..bb.`, `
......XX
...XXXXX
.XXXXXXX
XXXXXX..
XXXXXX..
..XXXX..
.XXXXXX.
XXXXXXXX`),
];
