import type { LevelSpec } from "../types";

const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC", CORAL = "#D9694F";

/** Island 9 — Observatory Studio. Teaches: coloured tallies — a ringed count per colour, in no order; the crossings say where each colour sits, and the count says when a colour is used up (the rest is X) or when only that many cells are left (all of them are that colour). */
export const ISL09: LevelSpec[] = [
  {
    id: "brass-telescope", title: "Flying Saucer", palette: [NIGHT, GOLD], role: "teach", mechanics: ["color-tally"], tally: ["c2"],
    aha: "A colour whose count is used up cannot appear again in that line. Column 3 counts navy 4, gold 1, in no order: rows 4-6 (navy 9, the lights, navy 9) give it two navy and its one gold light, so gold is spent and rows 1-3 there are X — the star cannot sit above the saucer there. The last navy is the leg's bend in row 8.",
    art: `
.b.........
....bbb....
...bb.bb...
.aaaaaaaaa.
aabaabaabaa
.aaaaaaaaa.
...a...a...
..a.....a..
.aa.....aa.`,
  },
  {
    id: "weather-vane", title: "Weather Vane", palette: [GOLD, NIGHT], role: "teach", mechanics: ["color-tally"], tally: ["r5"],
    aha: "When only that many cells are left, a count fills them all. Row 6 counts navy 6, gold 1: column 5, the pole (exact in nine), puts the gold hub there, and columns 1 and 9 hold no navy at all. That leaves seven cells for six navy and the hub, so the whole crossbar is ink.",
    art: `
....b....
aa..b..a.
.aabaaaaa
aa..b..a.
....b....
.bbbabbb.
....b....
...bbb...
.bbbbbbb.`,
  },
  {
    id: "stargazer-hat", title: "Stargazer's Hat", palette: [NIGHT, GOLD], role: "practise", mechanics: ["color-tally"], tally: ["c4", "c5"],
    aha: "Each column's single gold is already spent on the brim. Columns 5 and 6 count navy 6, gold 1 and navy 7, gold 1; row 9's full gold brim takes that gold, so neither column's top cell can be a star. Row 1 (gold 1 1, navy 1, gold 1) must then put its first two stars in columns 1 and 3.",
    art: `
b.b...ab..
.....aa.a.
.b..aaa...
....aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`,
  },
  {
    id: "tailed-comet", title: "Tailed Comet", palette: [GOLD, SKY], role: "practise", mechanics: ["color-tally"], tally: ["r1", "r5"],
    aha: "Two spent counts squeeze the gap into a third line. Rows 2 and 6 each count sky 3, gold 5; columns 2-4 (sky 1 1 1 each) give both rows their three sky cells, so sky is used up and column 5 is X there. Column 5's sky 1 1 must then sit in rows 3 and 5, leaving the gap in row 4.",
    art: `
.......aaa..
.bbb..aaaaa.
....baaaaaaa
bbbb.aaaaaaa
....baaaaaaa
.bbb..aaaaa.
.......aaa..
.a.......a..`,
  },
  {
    id: "lunar-lander", title: "Lunar Lander", palette: [NIGHT, GOLD, SKY], role: "twist", mechanics: ["color-tally"], tally: ["r0", "r2"],
    aha: "A count can open a row before any run is placed. Row 3 counts navy 2, sky 3, and only columns 5, 6 and 7 carry any sky at all, so those three cells are the window at once. Row 1 (gold 1, navy 1) closes later: column 2's star and column 6's antenna tip spend both counts and its other nine cells are X.",
    art: `
.b...a.....
....aca...b
...accca...
..aaaaaaa..
.bbbbbbbab.
.babbbbbab.
..a.....a..
.a.......a.
a..b......a
aa.......aa`,
  },
  {
    id: "ringed-planet", title: "Ringed Planet", palette: [CORAL, GOLD, SKY], role: "boss", mechanics: ["color-cross", "color-tally"], tally: ["c8", "r4", "r0"],
    aha: "Boss: three tallies interlock — one placed in full closes its column, one half-found points to its other end. Column 9 counts sky 2, gold 2, coral 1, stacked in rows 3-7 with no gaps, so rows 1, 2, 8 and 9 there are X. Row 5 counts gold 2, coral 9: column 1 gives one ring tip and column 12 leaves a gap, so the second gold is the far tip in column 13.",
    art: `
.........acc.
..bc.aaa....c
...aaccccc..c
.bbbbbbbbbbcc
b.aaaaaaaaa.b
.bbbbbbbbbbb.
b..accccca...
.....aaa.....
.c........c..`,
  },
  {
    id: "moon-rover", title: "Moon Rover", palette: [NIGHT, SKY, GOLD], role: "breather", mechanics: ["color-tally"], tally: ["c8"],
    aha: "One count, spent at once, empties a column. Column 9 shows only navy 2, sky 1, and the body (row 4), the window (row 5) and the chassis (row 6) use them all, so the rest of column 9 is X — the star in row 1 cannot sit there and drops into column 8 (gold 1 on top). The full chassis and the wheel overlaps do the rest.",
    art: `
.bbbb..c....
.bbbb....cc.
...a.....a..
..aaaaaaaaa.
.aabbaaabbaa
aaaaaaaaaaaa
ccc.ccc..ccc
c.c.c.c..c.c
ccc.ccc..ccc`,
  },
  {
    id: "astronaut-helmet", title: "Astronaut", palette: [NIGHT, SKY, GOLD], role: "practise", mechanics: ["color-tally"], tally: ["r3"],
    aha: "Spend the easy colours first, then count what is left of the visor. Row 4 counts navy 2, sky 5, gold 1: the helmet walls (columns 2 and 11) spend the navy and column 9's glint is the gold. Four visor cells are known, and column 3 holds no sky at all, so the fifth sky cell must be column 4.",
    art: `
....aaaa....
..caaaaaaa..
.aa......aa.
.a.bbbbbc.a.
aa.bbbbbb.aa
aa.bbbbbb.aa
.a..bbbb..a.
.aa......aa.
..aaaaaaaa..
.aaaacaaaaa.
aaaacccaaaaa
aaaaacaaaaaa`,
  },
  {
    id: "brass-orrery", title: "Brass Orrery", palette: [NIGHT, GOLD, SKY, CORAL], role: "combine", mechanics: ["color-tally", "stamp"], tally: ["c3", "c9"],
    aha: "The stamp tells two identical moons apart. Without it the coral moons in rows 1-2 could swap corners; with the stamped moon as column 4's coral, the arm (row 8) as its navy and the base (row 12) as its gold, all three counts are spent, so rows 2-4 there are X and the sun stops at column 5. Column 10 (navy 1, gold 1) closes the right edge the same way.",
    art: `
...D.bbb.....
..d.bbbbb..c.
....bbbbb.ccc
.c..bbbbb..c.
ccc..bbb...a.
.c....a....a.
.a....a....a.
.aaaaaaaaaaa.
......a......
......a......
....aa.aa....
..bbbbbbbbb..`,
  },
  {
    id: "star-rocket", title: "Star Rocket", palette: [NIGHT, CORAL, GOLD], role: "twist", mechanics: ["color-tally"], tally: ["c0", "c2", "c6"],
    aha: "A tally's gold need not be the gold you expect. Column 1 counts coral 2, gold 1, and row 3 (gold 1, navy 5) puts a star in column 1, so with the fins' coral the count is spent and the flame cannot spread there (rows 10-13 X). Columns 3 and 7 count navy 6, gold 1: the hull and row 11's flame spend them.",
    art: `
....b....
...bbb...
c.aaaaa..
..aa.aa..
..aaaaa..
..aaaaa..
.baaaaab.
bbaaaaabb
bb.aaa.bb
...c.c...
..ccccc..
...ccc...
....c....`,
  },
  {
    id: "obs-satellite", title: "Satellite", palette: [NIGHT, GOLD, SKY], role: "combine", mechanics: ["color-tally", "smudged"], smudge: ["r0"], tally: ["c1", "c13"],
    aha: "The same count, read in two columns, gives opposite answers. Row 1 is smudged; columns 2 and 14 both count gold 2, sky 3. In column 14 rows 2 and 12 already hold both golds, so its row-1 cell is X; in column 2 only row 12 holds gold and the panel takes the sky, so the second gold must be the row-1 star.",
    art: `
.b.....b.......
....bb.a.bb..b.
.....bbabb.....
......bbb......
.......a.......
cccc.aaaaa.cccc
c.c..abaaa..c.c
ccccaaaaaaacccc
c.c..aaaba..c.c
cccc.aaaaa.cccc
......a.a......
.b...aa.aa...b.`,
  },
  {
    id: "night-observatory", title: "Night Observatory", palette: [NIGHT, GOLD, SKY, CORAL], role: "finale", mechanics: ["color-tally", "smudged", "combine"], smudge: ["r0"], tally: ["c5", "c11", "r1", "r5"],
    aha: "Finale: a smudged row is read through the counts that cross it. Column 6 (navy 4, coral 4) is spent by dome and tower, so its row-1 cell is X; row 2's gold 2 puts the telescope tip in columns 12-13, and column 12's gold 5 then has one gold left — the smudged row's star. Row 6 (navy 7, gold 1) closes the dome once the slit's gold is found.",
    art: `
.ccc.......b.
cc.........bb
cc.......bbb.
.ccc....bb..b
.....aabaa...
...aaabaaaa..
..aaaabaaaaa.
.aaaaaaaaaaaa
ddddddddddddd
dbbd.ddd.dbbd
dbbd.d.d.dbbd
ddddddddddddd`,
  },
];
