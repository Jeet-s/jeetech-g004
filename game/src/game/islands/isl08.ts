import type { LevelSpec } from "../types";

const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", UMBER = "#8A5A3C", CREAM = "#C9B8A0", SKY = "#6FA8DC", NIGHT = "#2B3A67";

/** Island 8 — Kiln Room. Teaches: cracked clue numbers ("?" keeps its colour, hides its length). */
export const ISL08: LevelSpec[] = [
  {
    id: "kiln-teapot", title: "Teapot", palette: [TEAL], role: "teach", mechanics: ["cracked"], crack: ["r6.0"],
    aha: "A cracked '?' is measured by the walls around it. Row 7 shows one run of hidden length; the spout columns 1-2 (a 1 each) and the handle columns 10-11 (1 1 and 4) are used up by rows 3-6, so the run spans columns 3-9: 7. Row 3's 1 9 fills all eleven and columns 4-8 overlap to start you.",
    art: `
.....#.....
...#####...
#.#########
.########.#
..#######.#
..#########
..#######..
...#####...`,
  },
  {
    id: "kiln-heart-mug", title: "Rice Bowl", palette: [TEAL], role: "teach", mechanics: ["cracked"], crack: ["r7.0"],
    aha: "One cracked number, measured by the columns. The bowl's foot (row 8) is a single run of hidden length: columns 1 and 8 are only the rim's 2 (rows 4-5), so the foot reaches neither edge, while columns 2 and 7 both end in a 1 at the bottom, so it spans columns 2-7: 6. Row 4's 8 (the rim) and column 5's 1 6 start you.",
    art: `
.#..#...
..#..#..
.#..#...
########
#.#.#.##
.######.
..####..
.######.`,
  },
  {
    id: "kiln-tall-vase", title: "Gourd Bottle", palette: [TEAL], role: "practise", mechanics: ["cracked"], crack: ["r10.0"],
    aha: "A '?' can be measured by the column runs that cross it. Row 11's run is hidden, but columns 3 and 9 end in a 2 that sits in rows 10-11, while columns 2 and 10 end in a 3 that stops at row 10, so the ? spans columns 3-9: 7. Columns 5-7 (1 5 1 2, 4 2 1 2, 1 5 1 2) fit exactly to start; the handle loops off the upper bulb on the right.",
    art: `
....###....
.....#.....
....###.##.
...######.#
...##.##..#
....######.
..#######..
.###...###.
##..###..##
.###...###.
..#######..
....###....`,
  },
  {
    id: "kiln-willow-plate", title: "Blue Fish Plate", palette: [CREAM, NIGHT], role: "practise", mechanics: ["cracked", "color"], crack: ["r4.1"],
    aha: "A '?' can be sized by the other numbers in its own clue. Row 5 reads navy 1, cream ?, navy 4, cream 2, navy 1, cream 1, navy 1: the six known numbers take 10 of its 13 cells, and touching colours need no gap, so the ? is at most 3. Columns 2-4 then give it all three cream cells after the rim, so it is 3. The fish faces left, with a bubble above and a weed sprig below.",
    art: `
....bbbbb....
..bbaaaaabb..
.baaaaaaaaab.
.baabaaaaaab.
baaabbbbaabab
baababbbbbbab
baaabbbbaabab
baabaaaaaaaab
.babbaaaaaab.
.baabaaaaaab.
..bbaaaaabb..
....bbbbb....`,
  },
  {
    id: "kiln-glazed-tile", title: "Flower Tile", palette: [TEAL, CORAL, CREAM], role: "twist", mechanics: ["cracked", "color"], crack: ["r4.2"],
    aha: "Twist: the cracked number is the flower's cream heart, and the columns size it. Row 5 reads coral 3, cream ?, coral 3, and only columns 5-8 hold cream; columns 5 and 8 hold a single cream between two coral 2s, and once those petals settle (rows 3-4 and 6-7) it lands in row 5, so the heart is columns 5-8: 4.",
    art: `
aaaaaaaaaaaa
a....bb....a
a..bbbbbb..a
a.bbbccbbb.a
abbbccccbbba
a.bbbccbbb.a
a..bbbbbb..a
a....bb....a
a....a.....a
aaaaaaaaaaaa`,
  },
  {
    id: "kiln-pitcher", title: "Dotted Pitcher", palette: [SKY, NIGHT], role: "boss", mechanics: ["cracked", "color"], crack: ["c10.0", "r7.0"],
    aha: "Columns 4-7 fit exactly. Column 11's navy ? is the handle: rows 3 and 6 turn navy, so one run joins them: 6; row 8's sky ? waits on column 1's last 1: 9.",
    art: `
.bbbbbbb...
bb.aaaaa...
..aaaaaabbb
..aaaaaa..b
.aaaaaaaa.b
.abaabaab.b
.aaaaaaaa.b
aaaaaaaaabb
.baabaab...
.aaaaaaa...
..aaaaa....
.bbbbbbb...`,
  },
  {
    id: "kiln-tea-bowl", title: "Piggy Bank", palette: [CORAL, UMBER, GOLD], role: "breather", mechanics: ["cracked", "color"], crack: ["r4.1"],
    aha: "A breather: the pig's belly is cracked, and the snout and the tail measure it. Row 5 reads umber 2, coral ?, umber 1: columns 1 and 2 put the snout in rows 5-6 at the left edge and column 9's lone umber is the curly tail in row 5, so the ? runs columns 3-8: 6. A gold coin drops into the slot above.",
    art: `
....cc...
..a.cc.a.
.aaaaaaa.
aaa.aaaa.
bbaaaaaab
bbaaaaaa.
.aaaaaaa.
.bb...bb.`,
  },
  {
    id: "kiln-honey-jar", title: "Honey Jar", palette: [GOLD, UMBER, CORAL], role: "practise", mechanics: ["cracked", "color"], crack: ["r4.0"],
    aha: "A '?' ends where a crossing column changes colour. Row 5's gold ? starts at the jar's edge (column 1's gold 4 is rows 5-8), and column 4 reads umber lid, coral tie, gold, then umber: rows 2-4 there are lid, tie and body, so row 5 is the label's umber corner and the ? stops at column 3: 3. Row 8's gold 10 fills at once.",
    art: `
.......bb.
..bbbbbb..
...cccc...
.aaaaaaaa.
aaabbbbaa.
aabc.cbaaa
aaabbbbaaa
aaaaaaaaaa
.aaaaaaaa.
..aaaaaa..`,
  },
  {
    id: "kiln-brick-dome", title: "The Kiln", palette: [UMBER, CORAL, GOLD], role: "combine", mechanics: ["cracked", "color"], crack: ["c6.1", "r7.4"],
    aha: "Rows 10-14 fill and seat the flames; column 7's coral ? reaches the gold core in row 9 but not row 5's bricks: 3. Row 8's ? is squeezed by the flame: 2.",
    art: `
....aa.aaa....
...a.aaa.aa...
..aaa.aaa.aa..
.a.aaa.aaa.aa.
aaa.aa..aa.aaa
a.aaa.b..aa.aa
aa.a..b.b.a.aa
a.aa.bb.bbaa.a
aa.a.bcbb.a.aa
a.aabbccbbaa.a
aa.abccccba.aa
a.aabbccbbaa.a
aa.abbbbbba.aa
aaaaaaaaaaaaaa`,
  },
  {
    id: "kiln-lucky-cat", title: "Lucky Cat", palette: [CREAM, CORAL, GOLD], role: "twist", mechanics: ["cracked", "color"], crack: ["r9.1", "c9.0"],
    aha: "Column 8's 1-4-1-4-1 fits exactly. Column 10's ? is the raised paw, rows 2-6: 5; row 10's cream ? runs from the gold coin to column 11's 3: 8.",
    art: `
..a....a...
..ba..ab.aa
..aaaaaa.aa
.aa.aa.a.aa
.aaaabbaaaa
..aaaaaa.a.
..bbbcbbbb.
...aacaaaa.
..aaaaaaaaa
cccaaaaaaaa
.ccaaa.aaaa
..bbbbbbbbb`,
  },
  {
    id: "kiln-noodle-bowl", title: "Noodle Bowl", palette: [NIGHT, GOLD, UMBER, CREAM], role: "combine", mechanics: ["cracked", "color"], crack: ["r6.0", "r3.0"],
    aha: "Row 8's night 11 rim fills exactly. Two cracked numbers, each walled by an edge column: column 11 holds no umber, so row 4's chopstick ? runs from column 1 (its umber 1) to column 10: 10; columns 1 and 11 hold no gold, so row 7's noodle ? runs columns 2-10: 9. Three gold strands hang from the chopstick into the heap under curls of steam.",
    art: `
..d...d...d
.d...d...d.
..d...d...d
cccccccccc.
..b.b.b....
..b.b.b....
.bbbbbbbbb.
aaaaaaaaaaa
.aacaacaaa.
..aaaaaaa..
...aaaaa...`,
  },
  {
    id: "kiln-fire-masterwork", title: "Glazed Amphora", palette: [UMBER, CORAL, GOLD], role: "finale", mechanics: ["cracked", "color"], crack: ["r6.3", "c6.2"],
    aha: "Masterwork, two cracks on one hub: row 7's gold ? and column 7's gold ? cross at the centre of the glaze band. The umber rim, handles and foot settle first; the coral body then walls the band in. Row 7's ? is boxed by coral at columns 5 and 9 (3), and that hub cell starts column 7's gold run, which the coral in row 10 stops: 3 again, rows 7-9.",
    art: `
..aaaaaaaaa..
.aa.aaaaa.aa.
.a..bbbbb..a.
.a.bbbbbbb.a.
.aabbbbbbbbaa
..bbbbbbbbbb.
.bccbcccbccb.
.bbbbbcbbbbb.
.bbcbbcbbcbb.
..bbbbbbbbb..
...bbbbbbb...
....aaaaa....
...aaaaaaa...
aaaaaaaaaaa..`,
  },
];
