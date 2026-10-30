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
    id: "festival-candle", title: "Rabbit Lantern", palette: ["#E3A83B", "#D9694F", "#8A5A3C"], role: "breather", mechanics: ["smudged", "color"], smudge: ["r3"],
    aha: "A breather with one short cross-check: the rabbit's coral eye hides in smudged row 4. Column 2 reads coral 2, gold 1, coral 1, gold 3 — seven cells in eight, so the whole column could slip down one row and put the eye in row 5. But row 8 holds only coral wheels (coral 1, coral 2), no gold, so column 2's gold 3 cannot reach row 8: the column sits at the top and the eye is row 4.",
    art: `
.b.b..cc
.b.b..c.
aaaa..c.
abaa.aca
aaaaaaa.
.aaaaaab
.aaaaaa.
..b..bb.`,
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
    smudge: ["r2", "r3"],
    aha: "Twist: rows 3 and 4 are both smudged, so every column must carry itself across two hidden rows. The hull is the anchor: row 8's umber 12 fixes the foot of every column, so column 3 (umber 1, coral 2, umber 3) climbs from the hull past readable row 5: the lantern is rows 4-5 and its arm row 3. The sail's coral stripe steps down one row per column and enters the hidden rows only at row 4, column 8.",
    art: `
......c.....
......cb....
.cc...cbb...
.ca...cabb..
.ca...cbabb.
.c....cbbab.
.c....cbbbab
cccccccccccc
.ccbccbccbc.
..cccccccc..`,
  },
  {
    id: "lantern-pinwheel", title: "Pinwheel", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "combine", mechanics: ["smudged", "color"],
    smudge: ["c5"],
    aha: "The stick splits every row in two. Column 5's umber 12 runs top to bottom, so each row's runs fall either side of it, and smudged column 6 is read from the short right halves: rows 1-4 start their gold right after the stick, row 6's coral 4 fills columns 6-9 (the lower vane's top edge), and row 7's gold 1, coral 3 fills them too, so the gold fold sits against the stick in row 7.",
    art: `
a...cbbbb
aa..cbbb.
aaa.cbb..
aaaacb...
....c....
...bcaaaa
..bacbaaa
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
