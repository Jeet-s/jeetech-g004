import { INK, type LevelSpec } from "../types";

const MARBLE = "#C9B8A0";
const UMBER = "#8A5A3C";
const TEAL = "#2E8C8A";

/** Island 4 — Sculpture Hall. Shaped canvases: '~' cells lie outside the frame and act like walls. */
export const ISL04: LevelSpec[] = [
  {
    id: "hall-amphora", title: "Amphora", palette: [INK], role: "teach", mechanics: ["void"],
    aha: "Teach voids: a void lies outside the canvas, so a line is only as long as its framed cells. The cut corners leave rows 1 and 10 exactly four cells for their 4s, so the rim and the foot fill at once, and columns 5 and 6 run the full height. The single handle on the right (column 9's 2 2) means the two sides are read separately.",
    art: `
~~~####~~~
~~#.##..~~
~.#.##..#~
~.#####.#~
.#######.#
##########
.########.
~.######.~
~~..##..~~
~~~####~~~`,
  },
  {
    id: "hall-bronze-bell", title: "Bronze Bell", palette: [INK], role: "teach", mechanics: ["void"],
    aha: "Teach voids: a void is a wall no run crosses. Column 7's 1 2 5 cannot fit all three runs into the eight framed cells below the void at row 2 (that needs ten), so the 1 is the beam in row 1 and the 2 and 5 fill rows 3-10 exactly: the paper in row 5 is the crack. Follow it down to the right: rows 5-7 each end in a lone 1 beyond the crack.",
    art: `
.#########.
~~~.#.~~~~~
~~~.###.~~~
~~.##.##.~~
~~.###.#.~~
~.#####.#.~
~.######.#~
.#########.
###########
~~~~..##~~~`,
  },
  {
    id: "marble-bust", title: "Marble Bust", palette: [INK], role: "practise", mechanics: ["void"],
    aha: "Two void eyes, two different reads: the head tilts, so the eyes sit on different rows. Row 4's 6 1: the slit at column 8 leaves exactly six framed cells to its left and one to its right, so the row fills. Row 5's 1 6: the eye at column 3 leaves a two-cell pocket too short for the 6, so the 6 overlaps columns 5-9 and the 1 waits on the left for column 2 to place it.",
    art: `
~~~.##.~~~
~.######.~
~.#######~
~######~#~
.#~######.
.########.
~.##..##.~
~~.####.~~
~~~.##.~~~
..#######.
##########`,
  },
  {
    id: "ionic-capital", title: "Column Capital", palette: [INK], role: "practise", mechanics: ["void"],
    aha: "Two volute eyes, two different void reads. The right eye (row 6, column 9) cuts column 9 into two five-cell pockets, and its 3 1 5 fits both exactly: 3 1 above, 5 below. The left eye (row 5, column 3) leaves only four cells above it, too few for column 3's 5, so the 5 overlaps rows 7-10 below and the 3 overlaps rows 2-3 above.",
    art: `
~~#######~~
###########
.###...###.
#...#.#...#
#.~.#.#.#.#
#..##.#.~.#
.###...###.
~.#######.~
~~#.#.#.#~~
~~#.#.#.#~~
~#########~`,
  },
  {
    id: "laurel-wreath", title: "Laurel Wreath", palette: [INK], role: "twist", mechanics: ["void"],
    aha: "Twist: the void heart turns each of rows 4-8 into two short lines, one either side, so every middle row is really two puzzles. Column 3's 2 1 4 fills its nine framed cells exactly and sets the left side going; the right-hand leaves break at rows 3, 5 and 9, so nothing can be copied across the heart.",
    art: `
~~~##~##~~~
~~###~#.#~~
~##.#~..##~
##.~~~~~.##
#.#~~~~~..#
##.~~~~~.##
#.#~~~~~#.#
.##~~~~~##.
~.##~~~#..~
~~##.####~~
~~~#.#.#~~~`,
  },
  {
    id: "horse-statue", title: "Horse Statue", palette: [INK], role: "boss", mechanics: ["void"],
    aha: "Boss: few lines open at the start, and the voids are what open them. Rows 7 and 8 have only ten framed cells for their 9s, so the body fills eight of each; the plinth's 4 4 has one cell to spare and overlaps, and column 5's 9 1 rises from the body to the ear.",
    art: `
~.#.#..~~~~~~
.####...~~~~~
##.###...~~~~
#######....~~
##..####.....
~~..########.
~~~.#########
~~~.#########
~~~.###..###.
~~~#..#..#.#.
~~~...#..#.#~
~~####..####~`,
  },
  {
    id: "lidded-urn", title: "Pagoda", palette: [INK], role: "breather", mechanics: ["void"],
    aha: "A framed pocket too short for the run stays paper. A void at row 5, column 3 breaks the upper eave into a two-cell pocket and a seven-cell pocket; row 5's 6 cannot fit in two, so columns 1-2 are paper (the left eave is broken off) and the 6 overlaps columns 5-9. The lower eave, row 8's 9, runs to the left edge instead and stops at the void on the right.",
    art: `
~~~~~.#.~~
~~~~.###.~
~.#######~
~~.#.#.#.~
..~######.
~~.##.##.~
~~.##.##.~
#########~
~.#.##.#.~
~~########`,
  },
  {
    id: "open-hand", title: "Open Hand", palette: [INK], role: "practise", mechanics: ["void"],
    aha: "Read each finger from the palm up: a finger is one run in its column, so once the palm fixes its foot, the clue says exactly where the tip stops. Column 6's 12 (middle finger to wrist) fills the full height and the palm rows overlap; then fingers of four different lengths each rise only as far as their numbers allow, and the paper above every tip is the deduction.",
    art: `
~~~..#..~~~
~~.#.#.....
~..#.#.#...
...#.#.#.#.
#..#.#.#.#.
##.#####.#.
.##########
..#########
..########.
~..######.~
~~..#####~~
~~..#####~~`,
  },
  {
    id: "marble-carp", title: "Marble Carp", palette: [MARBLE, TEAL], role: "combine", mechanics: ["void", "color"],
    aha: "Bridge, not a teach: void and colour meet on a small board. Row 4's marble 1 4 and teal 1 fit its seven framed cells exactly (teal may touch marble). Column 8's teal 2 and teal 2 need no paper between: the void is their gap.",
    art: `
~~.bbb.~~
~.aaaa.bb
.aaaaaab~
a.aaaab~~
.aaaaaab~
~.aaaa.bb
~~..bb.~~`,
  },
  {
    id: "temple-harp", title: "Temple Lyre", palette: [UMBER, "#E3A83B"], role: "twist", mechanics: ["void", "color"],
    aha: "Twist: the voids sit in the middle of the canvas, not at its edge. The three void columns between the strings cut columns 4, 6 and 8 into two pockets — rows 1-4 above, rows 9-11 below — and no run can cross a void: column 4's 1 3 must put its 3 in the lower pocket, column 6's gold 1 must sit below the void on the lyre's bridge. Column 3's 7 1 overlaps five cells and the frame closes around its strings.",
    art: `
aa.......aa
.a.......a.
.aa.....aa.
..aaaaaaa..
..a~b~b~aa.
..a~b~.~a..
..a~b~b~a..
..a~b~b~a..
..aabbbaa..
...aaaaa...
..aaaaaaa..`,
  },
  {
    id: "bronze-mina", title: "Bronze Mina", palette: [UMBER, TEAL], role: "combine", mechanics: ["void", "color"],
    aha: "Void and colour together: columns 3 and 8 read umber 5, umber 4, teal 2 — the void corners above and the plinth below leave exactly that many cells, so both fill and their paper gap in row 6 is the neck. The teal plinth is 9 and 8 wide in 11 and 10 cells — one spare each — so its edge comes from the columns, not the rows.",
    art: `
~.a....a.~~
~.aa..aa.~~
..aaaaaa..~
..abaaba...
..aaaaaa...
...aaaa....
..aaaaaa...
.aaaaaaaa..
.aaaaaaaa.a
.aaaaaaaaaa
bbbbbbbbb..
.bbbbbbbb.~`,
  },
  {
    id: "winged-statue", title: "Masterwork: Winged Statue", palette: [MARBLE, UMBER], role: "finale", mechanics: ["void", "color"],
    aha: "Finale: one wing raised, one folded, so nothing copies across — start at the niche. The void niche splits row 12 into pockets of 5 and 6, too small to share, so its umber 3 lies left and its 4 right: columns 3, 10 and 11 are umber at once. Columns 6 and 7 end umber 1, umber 1 with only the niche between, and each wing is then read from its own columns.",
    art: `
aaa..........
aaaa...aa....
.aaaa..aa....
..aaaa..a....
...aaaaaaaa..
....a.aaa.aa.
......aaa.aaa
.....aaaa..aa
.....aaaa..aa
....aaaaaa..a
...bbbbbbbb..
..bbb~~.bbbb.
.bbbbbbbbbbbb`,
  },
];
