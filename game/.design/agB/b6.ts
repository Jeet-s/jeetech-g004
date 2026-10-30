const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", UMBER = "#8A5A3C", CREAM = "#C9B8A0", SKY = "#6FA8DC", NIGHT = "#2B3A67";
const koi = `
aaaaaaaaaaaa
a.c........a
a.....bb...a
a...bbbbb.ba
a.b.bcbbbbba
a.bbbbbccbba
a...bbbbb.ba
a......b...a
aaaaaaaaaaaa`;
export const C = ["r4.1","r5.1","r3.1","r6.1","r4.3","r5.3"].map(c=>({ id: "kiln-glazed-tile", title: "Koi "+c, palette: [TEAL, CORAL, CREAM], role: "twist", mechanics: ["cracked","color"], crack: [c], aha: "", art: koi }));
const boat = `
......c......
......cb.....
......cbb....
.cc...cbbb...
.ca...cbbbb..
.ca...cbbbbb.
.c....c......
ccccccccccccc
.ccccccccccc.
..b.b.b.b.b..`;
export const D = [["r4","r5"],["r3","r4"],["r5"],["r4"],["r5","r6"],["r2","r3"]].map(s=>({ id: "paper-boat", title: "Boat "+s, palette: [CORAL, GOLD, UMBER], role: "twist", mechanics: ["smudged","color"], smudge: s, aha: "", art: boat }));
