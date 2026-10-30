const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const art = `
......aa
....aaaa
..aaaab.
aabaa...
aa.bb...
...bb...
..b..b..
.bb..bb.`;
export const A = ["r2","r3","r4","c2","c3","c4","c5","c6"].map((t) => ({ id: t, palette: [GOLD, NIGHT], tally: [t], art }));
