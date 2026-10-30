const m = (art: string, crack: string[]) => ({ id: "exhibit-carousel-horse", title: "Carousel Horse", palette: ["#6FA8DC", "#E3A83B", "#D9694F"], role: "practise", mechanics: ["color-cross", "cracked"], crack, aha: "", art });
const H = `
bbbbbbbbbbb
..a..b...c.
.aaacb..cc.
.a.acb..c..
aaaacb..cc.
...aaccc.cc
...aaaaaaac
...aaaaaaa.
...a.b..a..
..a..b...a.
.....b.....
bbbbbbbbbbb`;
const H2 = `
bbbbbbbbbbb
..a..b..cc.
.aaacb.c..c
.a.acb.cc..
aaaacb..c..
...aacccc..
...aaaaaaac
...aaaaaaac
...a.b..a..
..a..b...a.
.....b.....
bbbbbbbbbbb`;
export const A = [m(H, ["r5.1"]), m(H, ["c5.2"]), m(H, ["r6.1"]), m(H2, ["r5.1"]), m(H2, ["c5.2"])];
