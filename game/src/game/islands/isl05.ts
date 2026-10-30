import { INK, type LevelSpec } from "../types";

const CORAL = "#D9694F", SAGE = "#8DB48E", UMBER = "#8A5A3C", GOLD = "#E3A83B";
const PLUM = "#8C6BB1", SKY = "#6FA8DC", NIGHT = "#2B3A67";

/** Island 5 — Mosaic Hall. Stamped tiles are given at the start: UPPERCASE / '@' = given colour, ',' = given paper. */
export const ISL05: LevelSpec[] = [
  {
    id: "mosaic-songbird", title: "Songbird", palette: [INK], role: "teach", mechanics: ["stamp"],
    aha: "Column 3's 5 could slide down, but the stamped tile in row 1 pins it to rows 1-5.",
    art: `
..@##....
.##.##...
#######..
..######.
..#######
...###.##
....#...#
...###...`,
  },
  {
    id: "mosaic-snail", title: "Garden Snail", palette: [INK], role: "teach", mechanics: ["stamp"],
    aha: "Column 2's 1 is the stamped tile, so X the rest of it: without that stamp the shell's rim could close at either corner. Row 3's 1 3 1 3 fills all 11 cells.",
    art: `
..####.#..#
#.....#.#.#
#.###.#.###
#.#.#.#..#.
#.#...#..#.
#..####..#.
.@.....###.
..#########`,
  },
  {
    id: "mosaic-seahorse", title: "Dragonfly", palette: [INK], role: "practise", mechanics: ["stamp"],
    aha: "The tail's flick decides which forewing meets the body. Columns 5 and 7 both read 1 1 1, and rows 3 and 12 could trade those cells (wing root left and tail curled right, or the reverse) with every clue unchanged. The stamped tail tip at row 12, column 7 is column 7's last 1, so row 3's middle 2 sits at columns 5-6.",
    art: `
....#.#....
.....#.....
.##.##..##.
####.#.####
.#########.
..##.#.##..
.###.#.###.
####.#.####
.##..#..##.
.....#.....
.....#.....
......@....`,
  },
  {
    id: "mosaic-pomegranate", title: "Pomegranate", palette: [CORAL, SAGE], role: "practise", mechanics: ["stamp", "color"],
    aha: "One stamped sage stem, now with colour: column 6's sage 1 is that stamp, so the stem can't grow along the column; row 2's sage 2 must use it plus column 7, and column 6's coral 6 lies straight under it — sage and coral may touch. The fruit's rows then fill around the stem.",
    art: `
......bb
.....Bb.
..aaaa..
.aaaaaa.
aaa.aaaa
aaaaaaaa
aaaaaaa.
.aaaaa..
..aaa...`,
  },
  {
    id: "mosaic-elephant", title: "Elephant", palette: [INK], role: "twist", mechanics: ["stamp"],
    aha: "Row 4's 2 8 fills all eleven exactly (2+1+8). The twist is the ear crease: row 2 reads 4 3, and no line can say where its gap falls. The stamped ink tile at row 2 column 8 can: the 3 starts there, so the crease is column 7, and the trunk and legs chain down in five passes.",
    art: `
...####....
..####.@##.
.##########
##.########
#..########
#...#######
#...##..###
.#..##..##.
....##..##.
....##..##.`,
  },
  {
    id: "mosaic-rooster", title: "Rooster", palette: [UMBER, CORAL], role: "boss", mechanics: ["stamp", "color"],
    aha: "Boss: two stamps untie two knots the clues leave open, one at each end of the bird. The stamped umber tip at row 1, column 8 is column 8's first 1, so rows 2-3 of that column are paper and the tail feathers curl to its right. The stamped coral toe at row 12, column 8 settles the back leg: rows 10 and 12 could otherwise trade columns 8 and 9.",
    art: `
...bb..A....
..bbbb...aa.
..aaaa..a..a
bbaa.a.a..a.
..aaaa.a.a.a
..baaaa..a.a
..baaaaaaa..
...aaaaaaaa.
....aaaaaa..
.....b..b...
.....b..b...
....bb.B....`,
  },
  {
    id: "mosaic-cat-face", title: "Puppy", palette: [INK], role: "breather", mechanics: ["stamp"],
    aha: "A breather: one stamp says which ear stands up. Columns 2 and 7 are both 7 in nine, so row 1's single 1 could be the tip over either. The stamped tip at row 1, column 2 puts column 2's 7 in rows 1-7 and column 7's in rows 2-8. Row 4's full 9 is the brow, and the floppy right ear (column 9's 4) hangs below it.",
    art: `
.@.......
.##.###..
.######..
#########
##.##.#.#
#######.#
.###.##.#
..#####..
...##....`,
  },
  {
    id: "mosaic-toucan", title: "Toucan", palette: [INK, GOLD], role: "practise", mechanics: ["stamp", "color"],
    aha: "The stamp settles which way the beak's two edges shift. Rows 2 and 4 each hold a gold 5 and columns 6 and 11 each a gold 2: the ridge could run columns 6-10 with the underside at 7-11, or the reverse, and every clue reads the same. The stamped gold tip at row 4, column 11 ends the underside there, so the ridge is columns 6-10.",
    art: `
..aaa......
.aaaabbbbb.
aa.abbbbbbb
aaaa..bbbbB
aabbb......
aabb.......
aaab.......
aaaaa......
.aaaaa.....
.aaaaaa....
..aaaa.....
...aa......`,
  },
  {
    id: "mosaic-compass-rose", title: "Compass Rose", palette: [NIGHT, GOLD], role: "combine", mechanics: ["stamp", "color"],
    aha: "The diagonal points could run NE-SW or NW-SE: rows 4 and 10 and columns 3 and 9 all read gold 2, navy 1, navy 1, gold 2 either way. The stamped navy tip at row 4, column 9 settles the whole rose. Column 9 needs it next: that tip is its first navy, so its gold 2 is rows 2-3 and rows 5-6 are paper, and row 4's ring closes at columns 10-11.",
    art: `
.....a......
..bbbabbb...
.bb..a..bb..
bb...a..Abb.
b...aaaa..b.
b...aaa...b.
b.aaababaaaa
b...aaa...b.
b..aaaa...b.
bba..a...bb.
.bb..a..bb..
..bbbbbbb...`,
  },
  {
    id: "mosaic-octopus", title: "Octopus", palette: [PLUM, INK], role: "twist", mechanics: ["stamp", "color"],
    aha: "The stamped tip (row 9) is column 5's 1, so the 6 stops above row 8: rows 2-6 ink. That pins row 6's 2 1 1 2, which fixes column 4. Without it the tentacles knot.",
    art: `
...aaaaa...
..aaaaaaa..
.aabaaabaa.
.aabaaabaa.
..aaaaaaa..
.aa.a.a.aa.
a..a..a..a.
aaa..a..a.a
.a..A..a..a
...a....a..`,
  },
  {
    id: "mosaic-black-swan", title: "Black Swan", palette: [INK, CORAL], role: "combine", mechanics: ["stamp", "color"],
    aha: "The stamp tells the breast from the tail. Rows 9 and 10 are both 11 in thirteen, and swapping their ends (columns 2 and 13) keeps every column clue, so no line can tell them apart. The stamped paper tile at row 10, column 13 stops row 10 at column 12: it is the breast (columns 2-12), and row 9 runs out to the raised tail tip at column 13.",
    art: `
..aaa........
bbaaaa.......
....aa.......
....aa.......
...aa........
..aa.....a...
..aa....aaa..
..aaa..aaaaa.
..aaaaaaaaaaa
.aaaaaaaaaaa,
..aaaaaaaaaa.`,
  },
  {
    id: "mosaic-dolphin-medallion", title: "Masterwork: Dolphin Medallion", palette: [SKY, NIGHT], role: "finale", mechanics: ["stamp", "color", "overlap"],
    aha: "Finale: two stamps on opposite sides of the ring, each untying a knot the clues leave open. The paper stamp at row 8, column 3 keeps row 8's sky 3 off the ring, so it must cover column 6. Across the ring, the paper stamp at row 10, column 13 pins row 10's navy 2 to columns 14-15 and its sky 3 over columns 10-11. Without either, the fin or the tail could shift a cell.",
    art: `
.....bbbbb.....
...bbbbbbbbb...
..bb.......bb..
.bb.....a...bb.
.ba....aaa...b.
bb...aaaaaa..bb
bb..aaaaaaaa.bb
bb,aaa...aaaabb
bb.aa....a.aabb
bbaa.....aaa,bb
.baa......aa.b.
.ba.a......a.b.
..bbb.bbb.bbb..
...bbbbbbbbb...
.....bbbbb.....`,
  },
];
