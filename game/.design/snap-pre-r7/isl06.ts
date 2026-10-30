import { type LevelSpec } from "../types";

const SAGE = "#8DB48E", CORAL = "#D9694F", UMBER = "#8A5A3C", GOLD = "#E3A83B", TEAL = "#2E8C8A";
const PLUM = "#8C6BB1", SKY = "#6FA8DC", NIGHT = "#2B3A67", INKC = "#1F2A3A";

/** Island 6 — Conservatory. Three-colour pictures: a cell can only take a colour both its lines contain. */
export const ISL06: LevelSpec[] = [
  {
    id: "potted-tulip", title: "Potted Tulip", palette: [CORAL, SAGE, UMBER], role: "teach", mechanics: ["color-cross"],
    aha: "Column 4 (coral 4, sage 3, umber 2) fills all nine cells. Rows 5-7 hold only sage, so no coral can sit there: the bloom stops at row 4 and the leaves are green.",
    art: `
.a.a.a..
.aaaaa..
.aaaaa.b
..aaa.bb
b..b.bb.
bb.bbb..
.bbbb...
cccccccc
.cccccc.`,
  },
  {
    id: "flowering-cactus", title: "Flowering Cactus", palette: [SAGE, GOLD, UMBER], role: "teach", mechanics: ["color-cross"],
    aha: "One flower row needs a cross-check. Row 1 reads gold 1, gold 1: column 5 (gold 1, sage 6, umber 3) fills all ten cells, so one is the crown, but the other could be either arm's bloom. Column 2 settles it: its gold 1 needs a row that holds gold, and row 4's gold comes after its sage 5, too far right. So column 2's bloom is in row 1, and the right arm's flower drops to row 4.",
    art: `
.b..b....
.a.aaa...
.a.aaa...
.aaaaa.b.
...aaa.a.
...aaaaa.
...aaa...
ccccccccc
.ccccccc.
..ccccc..`,
  },
  {
    id: "sunflower-head", title: "Sunflower", palette: [GOLD, UMBER, SAGE], role: "practise", mechanics: ["color-cross"],
    aha: "The umber disc is the deduction. Column 6 reads gold 2, umber 5, gold 1, sage 4: the disc runs its full height (rows 3-7). Column 7 reads gold 2, umber 2, umber 2, gold 1, sage 4, so its umber splits around a paper seed in row 5 — the seed head is no solid block. The paper seeds in rows 4-6 make the disc's rows partial lines, and each petal and seed cell is gold or umber only where its row and column both allow it.",
    art: `
...a.aa.....
..aaaaaaa.a.
.aaabbbbaaa.
aaab.bb.baa.
.aabbb.bbaaa
aaab.bb.ba..
.aaabbbbaaa.
..aaaaaaaa..
...a.cc.a...
.cc..cc.....
..ccccc..cc.
.....ccccccc`,
  },
  {
    id: "watering-can", title: "Watering Can", palette: [TEAL, SKY, CORAL], role: "practise", mechanics: ["color-cross"],
    aha: "The painted rose is the puzzle, read by crossing colours. Only columns 2-6 hold coral, so row 7's coral 5 fills exactly columns 2-6; columns 3 and 5 each hold a coral 3 but column 4 only a coral 2, so the bloom's top (row 6) is two petal tips with a teal notch between them. The sky stripes (rows 5 and 9, sky 7) box the rose above and below.",
    art: `
...aaaa.....
..a....a....
..a....a..aa
aaaaaaaaa.a.
abbbbbbbaa.b
aacacaaaa...
acccccaaa..b
aacccaaaa...
abbbbbbba..b
.aaaaaaa....`,
  },
  {
    id: "garden-rose", title: "Garden Rose", palette: [CORAL, SAGE, NIGHT], role: "twist", mechanics: ["color-cross"],
    aha: "Column 6 (coral 2, night 1, coral 1, night 2, coral 1, night 1, coral 1, sage 4) fills all 13 cells and rows 4-6 fill all 12: the spiral is laid before any petal.",
    art: `
...aaaaaa...
.aaaaaaaaaa.
.aaccccaaaa.
aacaaaacaaaa
aacaccaacaaa
aacaccaacaaa
aaacaaaacaa.
.aaacccccaa.
..aaaaaaaa..
.....b..bbbb
.bb..b.bbb..
bbbb.bbb....
.bbbbb......`,
  },
  {
    id: "bonsai-pine", title: "Bonsai", palette: [SAGE, UMBER, CORAL], role: "boss", mechanics: ["color-cross"],
    aha: "Column 6's sage 3, umber 7 and coral 2 fill all twelve cells \u2014 the trunk in one look; row 5's lone umber is that trunk cell, so the rest of row 5 is paper.",
    art: `
...aaaa....
.aaaaaaaa..
aaa.aaaaaa.
..aa.b.aa..
.....b.....
.aa..bb....
aaaabb..aa.
.aa..bbaaaa
.....b..aa.
....bbb....
cccccccccc.
.cccccccc..`,
  },
  {
    id: "lily-frog", title: "Frog on a Lily Pad", palette: [SAGE, TEAL, INKC], role: "breather", mechanics: ["color-cross"],
    aha: "A calm one: row 4's sage 2, ink 6, sage 2 and row 5's 10 fill exactly. The frog glances right — its right pupil sits in the corner of the eye (row 2) — so each eye is read on its own, and row 7's notch marks the pad.",
    art: `
.aaa..aaa.
.aca..aac.
.aaaaaaaa.
aaccccccaa
aaaaaaaaaa
aa.aaaaaaa
bbbbbb.bbb
bbbbbb.bbb
.bbbbbbbb.`,
  },
  {
    id: "leaf-ladybird", title: "Ladybird on a Leaf", palette: [CORAL, INKC, SAGE], role: "combine", mechanics: ["color-cross", "void"],
    aha: "Voids leave row 2 nine cells for sage 3, ink 1, ink 1, sage 3; the ink dots need a gap, so it fits exactly.",
    art: `
~~~~ccccc~~~~
~~cccb.bccc~~
~ccc.bbb.ccc~
ccc.bbbbb..cc
cc.aaabaaa.cc
c.abaabaaba..
c.aaaabaaaa.c
c.abbababba.c
c.aaaabaaaa.c
cc.abababa.cc
~cc.aabaa.cc~
~~ccc...ccc~~
~~~~ccccc~~~~`,
  },
  {
    id: "hummingbird-sip", title: "Hummingbird", palette: [TEAL, CORAL, INKC], role: "combine", mechanics: ["color-cross"],
    aha: "Column 11 reads coral 4, teal 5: different colours touch, so nine of ten cells are used and seven are sure — the bloom sits straight on its stem. Then the colour cross-check: row 5's ink eye and beak can only land in columns that hold ink (6, 8, 9, 10), so the teal around them settles and the bird fills the left half row by row.",
    art: `
aa.......bb.
aaa.....bbbb
.aaaa...bbbb
..aaaaa..bb.
...aacacccaa
..aaaaaa..a.
.aaaaaaa..a.
aaaaa.aa.aa.
aaa...a..aaa
aa...aa.aa.a`,
  },
  {
    id: "monstera-leaf", title: "Monstera Leaf", palette: [SAGE, TEAL, UMBER], role: "combine", mechanics: ["color-cross", "exact-fit", "stamp"],
    aha: "A combine, not a new idea: column 8's sage 1, teal 12, umber 1 fills all 14 cells — the midrib. The stamped hole in row 7 is a free foothold beside it. From the midrib out, each leaf slit is read by colour-cross: a cell is sage only where its row and its column both hold sage.",
    art: `
.....aaaa.....
...aaaabaaaa..
..aa.aaba..aa.
.aaa.aabaa.aaa
aa..aaabaaa..a
aaa..aabaa.aaa
..aa,aabaa.aa.
aaa.aaabaaa..a
.aaa.aabaa.aa.
..aa.aabaa.a..
...aaaabaaaa..
.....aabaa....
.......b.a....
.......c......`,
  },
  {
    id: "moth-orchid", title: "Orchid", palette: [PLUM, GOLD, SAGE], role: "combine", mechanics: ["color-cross", "stamp"],
    aha: "Start from the stamp. Rows 5 and 6 (plum 5, gold 2, plum 5 / plum 4, gold 4, plum 4) fill all twelve cells, so column 12's plum 2 is rows 5-6 and its row 4 is paper. The stamped plum in row 4, column 11 is then the left cell of row 4's last plum 2, columns 10-11: the right petal's top. The left petal, tip and all, is read by colour-cross from the full rows.",
    art: `
....aaaa....
...aaaaaa...
.aa.aaaa....
aaaa.aa..aA.
aaaaabbaaaaa
aaaabbbbaaaa
.aaab..baaa.
..aaabbaaa..
...aa..aa...
..aa....a...
.aa..c......
cc..cc..cc..
.cccccccc...`,
  },
  {
    id: "glasshouse", title: "Glasshouse", palette: [SAGE, CORAL, NIGHT], role: "finale", mechanics: ["color-cross", "void", "stamp"],
    aha: "Masterwork: a gabled glasshouse. The voids cut the roof's slope, so each roof row holds exactly its navy runs; the eaves (row 8) and the bench (row 14) are full navy 15s and frame two plant beds, split by column 8's pillar. Inside, every cell can only be sage or coral where its row and its column both still hold that colour — the stamped bloom in row 10 anchors the right-hand bed, and the beds fill from the pillar outwards.",
    art: `
~~~~~~~c~~~~~~~
~~~~~~ccc~~~~~~
~~~~~cc.cc~~~~~
~~~~cc.b..c~~~~
~~~cc.bab.cc~~~
~~cc...a...cc~~
~cc...aaa..ccc~
ccccccccccccccc
c......c......c
c.b.b..c.bb.B.c
c.aaa..c..aaa.c
c..a.a.c.aa.a.c
c.aaaa.c..aaa.c
ccccccccccccccc
c.c.........c.c`,
  },
];
