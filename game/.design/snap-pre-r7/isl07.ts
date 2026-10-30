import { INK, type LevelSpec } from "../types";

/** Island 7 — Lantern Gallery. Festival night. Teaches: smudged clue lines, painted from their crossings. */
export const ISL07: LevelSpec[] = [
  {
    id: "paper-lantern", title: "Paper Lantern", palette: [INK], role: "teach", mechanics: ["smudged"],
    smudge: ["r3"],
    aha: "One new idea: row 4 is smudged, so read it from the columns. Rows 3 and 5 (2 1 2) fill all seven exactly, column 4's 8 fills top to bottom and columns 2 and 6's 5s overlap. Then columns 1 and 7 (3) must run rows 3-5 and column 3's 1 1 1 1 needs rows 2, 4, 6 and 8 — every column inks row 4, so the hidden row is a full 7.",
    art: `
...#...
.#####.
##.#.##
#######
##.#.##
.#####.
...#...
..###..`,
  },
  {
    id: "festival-kite", title: "Festival Kite", palette: ["#D9694F", "#E3A83B"], role: "teach", mechanics: ["smudged", "color"],
    smudge: ["r4"],
    aha: "Row 5 is smudged and lopsided: coral then gold on the left, gold then coral on the right, a gap at column 4. No mirror copy helps — each column paints its own row-5 cell; column 4's gold 4, gold 2 needs its gap exactly there, under row 4's gold 8 spar.",
    art: `
...bb...
..abba..
.aabbaa.
bbbbbbbb
.ab.baa.
..abba..
...bb...
....b.b.`,
  },
  {
    id: "festival-drum", title: "Festival Drum", palette: ["#D9694F", "#E3A83B"], role: "practise", mechanics: ["smudged", "color"],
    smudge: ["r5"],
    aha: "A tilted drum has no pattern to copy. Rows 5 and 7 (coral 9) are each one short of the width and smudged row 6's studs sit at uneven gaps, so every column hands over its own cell. Column 1's gold 2, coral 2 and column 10's gold 1, coral 1 decide which end each band leaves open: the hidden row starts coral on the left and ends in a gold stud on the right.",
    art: `
bb........
bbb....bb.
..b...bb..
.bbbbbbbb.
aaaaaaaaa.
abaabbaaab
.aaaaaaaaa
.bbbbbbbb.
..a....a..
.aa....aa.`,
  },
  {
    id: "koi-fish", title: "Koi Fish", palette: ["#D9694F", "#E3A83B", "#2B3A67"], role: "practise", mechanics: ["smudged", "color"], smudge: ["r4"],
    aha: "A smudged row can be painted entirely from the lines that cross it. Row 5 is smudged, but row 4's gold 8, coral 2, gold 1, coral 2 fills all thirteen cells, and columns 4 and 7 then run through the hidden row and paint the koi's spots.",
    art: `
....aaa......
..bbbbaab....
.bcbbbaaabb.a
bbbbbbbbaabaa
bbaabbbbbbbaa
.bbaabbbbb.aa
..bbbbbbb...a
...a...a.....`,
  },
  {
    id: "fireworks-burst", title: "Fireworks Burst", palette: ["#E3A83B", "#D9694F"], role: "twist", mechanics: ["smudged", "color"],
    smudge: ["c4"],
    aha: "Twist: now a column is smudged, and no single row hands it over. Column 5 is the burst's spine; row 5 (gold 3, coral 3, gold 2) is one short of the width, so only the core is sure at first. The rays are lopsided (short right ray, bent upper-right ray, one-cell spark lower right), so each spine cell waits for its own row: rows 1 and 2's lone gold 1s, row 3's gold 3 and row 9's coral 1 close it last.",
    art: `
bb..a....
.aa.a..bb
.baaa.aa.
...bbba..
aaabbbaa.
...bbb...
..aaa.aa.
.aa.a..ab
bb..b....`,
  },
  {
    id: "moon-lantern", title: "Moon and Lantern", palette: ["#E3A83B", "#D9694F"], role: "boss", mechanics: ["smudged", "color"], smudge: ["c6"],
    aha: "Boss: two solid bands box the hidden column. Column 8's coral 10 cord and the coral 5 bands of rows 3 and 7 pin the lantern, so the striped rows 4-6 hand smudged column 7 its gold at once. The real fight is the moon: column 1's gold 7 overlaps rows 4-7, and the crescent's thin rows are settled inward from that edge.",
    art: `
.aaa...b..
aa....bbb.
aa...bbbbb
a....babab
a....babab
a....babab
aa...bbbbb
aa....bbb.
.aaa...b..
..aaa..b..`,
  },
  {
    id: "festival-candle", title: "Candle", palette: ["#E3A83B", "#D9694F"], role: "breather", mechanics: ["smudged", "color"], smudge: ["r6"],
    aha: "A calm one: the melted wax top tells you where the hidden row starts. Row 10's gold 9 (the holder) fills and four sparks ring the flame; row 6 holds only coral 6 because the wax has melted on the left, so column 2's coral 3 begins in smudged row 7 and the hidden row is wax from column 2 to 8.",
    art: `
.a.....a.
....a....
...aaa...
.a.aaa.a.
....b....
..bbbbbb.
.bbbbbbb.
.bbbbbbb.
.bbbbbbb.
aaaaaaaaa
..aaaaa..`,
  },
  {
    id: "festival-parasol", title: "Parasol", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "practise", mechanics: ["smudged", "color"],
    smudge: ["c3"],
    aha: "Column 4 is smudged. Rows 4-5 fill all twelve cells and column 7's umber 1, coral 1, gold 3, umber 5 fills all ten. The canopy is lopsided — row 3 reaches the right edge but not the left, and the right fringe in row 6 is a 3 — so nothing can be copied across: column 4 is rebuilt row by row from its crossings (the smudge costs three extra passes).",
    art: `
.....cc.....
...aaaaaaa..
.aaaabbaaaaa
aabaabbaabaa
abaaabbaabaa
a.aa.cc.aaa.
.....cc.....
.....cc.....
.....cc..cc.
......cccc..`,
  },
  {
    id: "firefly-jar", title: "Firefly Jar", palette: ["#2B3A67", "#E3A83B", "#8A5A3C"], role: "combine", mechanics: ["smudged", "color", "exact-fit"], smudge: ["c1"],
    aha: "The fireflies sit on one row pair you can read whole. Rows 7 and 8 fill all ten cells, colours touching, so smudged column 2 gets a firefly in row 7 and night glass in row 8; row 6's night 10 is the jar's widest band. Then column 1's night 3 (rows 6-8) leaves rows 5, 9 and 10 one cell in from the edge, their night 8s fit exactly, and the hidden column is done.",
    art: `
b.........
...cccc..b
...cccc...
..aaaaaa..
.aaaaaaaa.
aaaaaaaaaa
abaaabaaba
aaabaaabaa
.aaaaaaaa.
.aaaaaaaa.
..aaaaaa..`,
  },
  {
    id: "paper-boat", title: "Lantern Boat", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "twist", mechanics: ["smudged", "color"],
    smudge: ["r3", "r4"],
    aha: "Twist: two rows are smudged at once — rows 4 and 5, through the sail, the mast and the bow lantern — so each column must carry itself through both. A coral stripe crosses the sail: columns 9-12 each read gold 2, coral 1, and that coral steps down a row per column (rows 4, 5, 6, 7), crossing the hidden rows in columns 9 and 10. Column 2's umber 7 is the bow post (rows 4-10); column 3's umber 1, coral 2 hangs the lantern from its arm in row 4.",
    art: `
.......c......
.......cb.....
.......cbb....
.cc....cabb...
.ca....cbabb..
.ca....cbbabb.
.c.....cbbbab.
.c.....c......
cccccccccccccc
.cccbccbcccbc.
..cccccccccc..
b...bb...bb..b`,
  },
  {
    id: "lantern-pinwheel", title: "Pinwheel", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "combine", mechanics: ["smudged", "color"],
    smudge: ["c2"],
    aha: "A hidden cell takes the colour its row still allows. Each vane has one solid edge (column 1's coral 4, row 1's gold 4, column 9's coral 4, row 9's gold 4) to start from. Row 7 reads gold 1, coral 1 before the stick, and column 4 (coral 1, gold 1, coral 1, gold 2) puts the vane's coral fold beside the stick in row 7, so smudged column 3 is gold there.",
    art: `
a....bbbb
aa...bbb.
aaa..bb..
aaaa.b...
....c....
...bcaaaa
..bac.aaa
.bbbc..aa
bbbbc...a
....c....
....c....
..ccccc..`,
  },
  {
    id: "lantern-festival", title: "Lantern Festival", palette: ["#E3A83B", "#D9694F"], role: "finale", mechanics: ["smudged", "color"], smudge: ["c5"],
    aha: "Masterwork: three lanterns on a line, the middle one's edge hidden — column 6 is smudged. Row 13 (gold 6, coral 2, gold 6) and column 13 fill exactly; the lantern rows then chain coral and gold across the board, and every hidden cell is read from its row as the middle lantern closes.",
    art: `
aa..........aa
..aaaaaaaaaa..
..a....a....a.
.aaa..aaa..aaa
.bbb.bbbbb.bbb
.bab.babab.bab
.bab.babab.bab
.bbb.babab.bab
.aaa.babab.bbb
..a..bbbbb.aaa
......aaa...a.
.......a......
aaaaaabbaaaaaa
..bb..aaa..bb.`,
  },
];
