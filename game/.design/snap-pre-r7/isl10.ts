import type { LevelSpec } from "../types";

const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", PLUM = "#8C6BB1", SKY = "#6FA8DC";
const PEACH = "#F2B35E", UMBER = "#8A5A3C", CREAM = "#C9B8A0", NIGHT = "#2B3A67";

/** Island 10 — Grand Exhibit. Combines: it opens with two-mechanic pairings, then mixes two or three earlier twists (void, stamps, smudged, cracked). */
export const ISL10: LevelSpec[] = [
  {
    id: "exhibit-snow-globe", title: "Snow Globe", palette: [SKY, TEAL, UMBER], role: "combine", mechanics: ["void", "smudged"],
    aha: "Refresher: two old twists, one at a time. First the voids: the cut corners leave rows 1 and 9 exactly five framed cells and row 10 exactly seven, so the rim and stand fill at once. Then the smudge: row 11's clue is unreadable, so the feet come from the columns: columns 1, 5 and 9 reach row 11 straight away and the others follow.", smudge: ["r10"],
    art: `
~~aaaaa~~
~a..b..a~
a..bbb.aa
a.bbbbb.a
a..bbb..a
aabbbbb.a
a...c..aa
~a..c..a~
~~aaaaa~~
~ccccccc~
cc.ccc.cc`,
  },
  {
    id: "exhibit-pocket-watch", title: "Pocket Watch", palette: [GOLD, CREAM, NIGHT], role: "combine", mechanics: ["stamp", "cracked"],
    aha: "Each cracked hand must run through the stamped pivot. Row 7's ? and column 6's ? both contain the stamp at row 7, column 6, and the gold rim caps their far ends, so the minute hand is 5 and the hour hand 4.", crack: ["r6.3", "c5.2"],
    art: `
....aaa....
....a.aa...
..aaaaaaa..
.aabbcbbaa.
aabbbcbbbaa
abbbbcbbbb.
acbbbCcccca
abbbbbbbbba
aabbbbbbbaa
.aabbcbbaa.
..aaaaaaa..`,
  },
  {
    id: "exhibit-flower-vase", title: "Flower Vase", palette: [TEAL, GOLD], role: "practise", mechanics: ["color", "cracked"],
    aha: "A cracked run with no gap is measured from its two ends. Column 6's teal ? starts right under its gold bloom and runs unbroken into the vase: 8. Column 3's gold 3, teal 2 1 4 fills its twelve cells exactly and anchors the stems.", crack: ["c5.1"],
    art: `
.bb........
bbbb.....b.
.bb.bb..bbb
..a.bbb..b.
..a..a..a..
...a.a.a...
..aaaaaaa..
...aaaaa...
..aaaaaaa..
.aaaaaaaaa.
.aaaaaaaaa.
..aaaaaaa..`,
  },
  {
    id: "exhibit-carousel-horse", title: "Carousel Horse", palette: [SKY, GOLD, CORAL], role: "practise", mechanics: ["color-cross", "cracked"],
    aha: "A cracked pole is bounded by what it touches at each end. Column 6's gold ? starts right under the belly's sky 1 in row 8 and must reach the gold floor in row 12, so it is rows 9-12: 4. Rows 1 and 12 (gold 11) and row 8's sky 8, coral 1 are the first footholds.", crack: ["c5.3"],
    art: `
bbbbbbbbbbb
..cc.b.....
.aaacb.....
aaaaab.....
aa.aab.....
...aacaaaa.
...aacaaaac
..aaaaaaaac
..a..b..a.c
.a...b...a.
....bbb....
bbbbbbbbbbb`,
  },
  {
    id: "exhibit-penguin", title: "Penguin", palette: [NIGHT, GOLD, CREAM], role: "twist", mechanics: ["smudged", "stamp", "color"],
    aha: "Twist: where two smudged lines cross, only the stamp speaks. Row 8 and column 7 are both smudged and their crossing is a stamped cream belly cell, the one cell no readable line passes through. Row 7 (navy 3, cream 4, navy 1, navy 1) and column 4 fit exactly; the two smudged lines are then painted from their crossings.", smudge: ["r7", "c6"],
    art: `
...aaaa...
..aaaaaa..
..a.aa.a..
..aabbaa..
..aaccaa..
.aaccccaa.
aaacccca.a
a.acccCa..
..accccaa.
..aaccaa..
..bb..bb..`,
  },
  {
    id: "exhibit-peacock", title: "Peacock", palette: [TEAL, GOLD, NIGHT], role: "boss", mechanics: ["color-cross", "smudged"],
    aha: "Boss: an eye is navy only where its row and its column both hold navy. Rows 4 and 5 fill all fifteen cells in three colours, and smudged column 3 is then read entirely from its rows.", smudge: ["c2"],
    art: `
....aaabaaa....
..abaabcbaaba..
.abcba.b.abcba.
ababa.aaaaababa
bcbabcbabcbabcb
abaa.bacab..aba
.aaaa.aca.aaaa.
...aaacccaaa...
.....ccccc.....
.....ccccc.....
......ccc......
......b.b......`,
  },
  {
    id: "exhibit-mina-portrait", title: "Mina the Curator", palette: [UMBER, PEACH, TEAL], role: "breather", mechanics: ["color"],
    aha: "The beret's notch is a hidden gap, and the stalk's column finds it. Row 3's teal 5 2 in nine has one spare cell; column 6 (teal 3, umber 1, peach 4, umber 1) fits exactly, so its teal runs from the stalk through the band, the 5 must reach column 6, the notch is column 7 and the 2 ends at the edge. Rows 5-7 fit exactly and column 5 puts the gap in the smile.",
    art: `
.....c...
..ccccc..
.ccccc.cc
.aaaaaaa.
abbbbbbba
ab.bbb.ba
abbbbbbba
.abb.bba.
..aaaaa..`,
  },
  {
    id: "exhibit-old-painter", title: "The Old Painter", palette: [NIGHT, PEACH, CREAM], role: "practise", mechanics: ["color-tally", "smudged"], smudge: ["c1"], tally: ["r3"],
    aha: "Where a tally row meets a smudged column, only counting reaches the cell. Row 4 counts navy 3, peach 6, cream 2; the other columns settle it except columns 1, 2 and 10, leaving it one peach and two creams short. Columns 1 and 10 (cream 3, navy 2) cannot be peach, so column 2 is the peach and both ends are cream.",
    art: `
...aaaaa....
.aaaaaaaa..b
.cbbbbbbc..b
cbabbbabbc.a
cbbbbbbbbc.a
ccbbbbbbcc.a
.cccbbccc..a
.cccccccc..a
..cc.cc.c.bb
...c.cc...bb
aaa..cc..aaa
aaaa....aaaa`,
  },
  {
    id: "exhibit-monarch", title: "Monarch Butterfly", palette: [CORAL, NIGHT, GOLD], role: "combine", mechanics: ["color-cross", "cracked"], crack: ["r3.6"],
    aha: "The cracked gold patch is sized by its columns, not its row — and no wing mirrors another, so every line reads differently. Row 4's gold ? is the right forewing's patch: columns 9 and 10 each hold a gold 2 that starts in row 3, so both reach row 4, and the coral in column 8 and the navy rim in column 11 stop it at 2. Elsewhere a cell is coral or gold only where its row and column agree.",
    art: `
bbb.b.b....
bacabb..bbb
baaabb.bccb
bacabbbaccb
.bbabbbaab.
.baabbbaab.
..bcbbbacab
...bbb.baab
........bb.`,
  },
  {
    id: "exhibit-alpine-lake", title: "Alpine Lake", palette: [NIGHT, SKY, CREAM], role: "twist", mechanics: ["smudged", "cracked", "color"],
    aha: "Twist: six exact rows do the work of a smudged column. Rows 5-10 all fill exactly (mountain foot, pines, shore, mirrored peaks), so smudged column 9 paints itself; column 12's cracked sky ? is then what is left of the lake: rows 10-12, 3.", smudge: ["c8"], crack: ["c11.5"],
    art: `
....c...........
...ccc......c...
..caaac....ccc..
.aaaaaaa..caaac.
aaaaaaaaaaaaaaaa
a.aa.a.aaa.aa.aa
bbbbbbbbbbbbbbbb
baaaaaaabbcaaacb
bbcaaacbbbbcccbb
bbbcccbbbbbbcbbb
bbbbcbbb..bbbbbb
bb..bbbbbbbb..bb`,
  },
  {
    id: "grand-paint-palette", title: "Paint Palette", palette: [UMBER, CORAL, SKY], role: "combine", mechanics: ["void", "color-tally"], tally: ["c3", "c5"],
    aha: "A void steals a cell from a column's count. Columns 4 and 6, beside the cut-out thumb hole, show only counts. Column 6 says umber 3, coral 2: rim (rows 1, 10), ring (row 6) and the coral blob (rows 3-4) meet it, so rows 2, 5 and 7-9 are X. Column 4 says umber 4 and the void takes row 6, so after rows 2 and 10 only rows 5 and 7 can be umber: both are ink.",
    art: `
~~~~aaaaaa~~~
~~aaa....aaa~
~aa.bb.cc...a
aa..bb.cc...a
a..aa.......a
a.a~~a..bb..a
a..aa...bb.aa
aa........aa~
~aa.......a~~
~~aaaaaaaa~~~`,
  },
  {
    id: "exhibit-grand-masterwork", title: "Masterwork: The Grand Easel", palette: [UMBER, SKY, CORAL], role: "finale", mechanics: ["stamp", "color-cross", "smudged", "cracked", "color-tally"], smudge: ["r12"], crack: ["r1.0"], tally: ["c14", "c15"],
    aha: "Finale: one count is met at once, the other leaves no choice. Column 16's tally 2 is met by the tray (row 12) and the stamped foot, so the rest is X, its smudged row-13 cell too. Column 15's tally 12 has exactly twelve cells once rows 1 and 14 are clear, so all are ink — that ends row 2's cracked bar at column 15 (? = 14).",
    art: `
.......aa.......
.aaaaaaaaaaaaaa.
.a.........cc.a.
.a...b....cCcca.
.a..bbb...cccca.
.a.bbbbb...cc.a.
.a.bbbbbb.....a.
.abbbbbbbb..b.a.
.abbbbbbbbbbbba.
.a.bb..bb..bb.a.
.aaaaaaaaaaaaaa.
aaaaaaaaaaaaaaaa
.a.....aa.....a.
A......aa......A`,
  },
];
