import { INK, type LevelSpec } from "../types";

/**
 * Island 2 — Inkwell Woods. Ink only. Introduces the TALLY clue: a ringed number counts all the ink in its line,
 * in any number of pieces. Count reached → the rest is paper; only that many cells left → they are all ink.
 * Each level turns on a different counting insight; the island ends combining tallies with exact fit and overlap.
 */
export const ISL02: LevelSpec[] = [
  {
    id: "toadstools", title: "Toadstools", palette: [INK], role: "teach", mechanics: ["tally", "fill", "x-marks"], tally: ["r3"],
    aha: "A count already reached closes the row. Row 4 shows a ringed 2, and columns 3 and 4 (full 7s, the big stem) already put both ink there, so the other six cells of row 4 are paper. That gap keeps the small toadstool down: its cap is row 5 (6) and its stem in column 7 (3) runs to the ground.",
    art: `
.#####..
######..
######..
..##....
..######
..##..#.
..##..#.`,
  },
  {
    id: "sleeping-fox", title: "Fox Face", palette: [INK], role: "teach", mechanics: ["tally", "exact-fit", "x-marks"], tally: ["r5"],
    aha: "When only as many cells are left as the count, they are all ink. Row 5's 2 3 2 fits nine exactly and columns 1 and 9 are a single 1, so row 6's ends are paper. Row 6's ringed 7 then has exactly seven cells left (columns 2-8), so all of them are ink.",
    art: `
.#.....#.
.##...##.
.###.###.
..#####..
##.###.##
.#######.
..#####..
...#.#...
...###...`,
  },
  {
    id: "barn-owl", title: "Barn Owl", palette: [INK], role: "practise", mechanics: ["tally", "overlap", "x-marks"], tally: ["r0", "r8"],
    aha: "A met count decides which way a column's runs sit. Row 1's ringed 3 is met by the ear tufts in columns 2, 7 and 8, so columns 1 and 9 are paper there and their 4 3 must hang one row lower: the facial disc runs rows 2-5. First, row 9's ringed 8 allows a single blank, and column 4 (1 1 2 1) puts it in column 4, so the rest of row 9 is ink.",
    art: `
.#....##.
#########
#.......#
#.##.##.#
#...#...#
.#.....#.
########.
#########
###.#####
...#.##.#`,
  },
  {
    id: "hedgehog", title: "Hedgehog", palette: [INK], role: "practise", mechanics: ["tally", "overlap", "x-marks"], tally: ["r0", "r1"],
    aha: "Count what a row still owes, not the rhythm. Row 1's ringed 3 is met by the tips in columns 3, 6 and 9, so its other cells are paper. Row 2's ringed 4 then has quills in columns 4, 7 and 9, unevenly spaced, and owes one more; column 8's 5 keeps row 2 clear there, so the only cell left for it is column 2.",
    art: `
..#..#..#..
.#.#..#.#..
.#########.
########.##
###########
.########..
..##...##..`,
  },
  {
    id: "meadow-rabbit", title: "Meadow Rabbit", palette: [INK], role: "practise", mechanics: ["tally", "overlap", "x-marks"], tally: ["c0", "c4"],
    aha: "Count the blanks instead of the ink. Column 1's ringed 9 leaves room for only three blanks in twelve, and rows 6, 11 and 12 are already blank there, so every other cell is ink: the whole left ear. Column 5's ringed 6 is met by the face (rows 6-9) and the chin (rows 11-12), so rows 1-5 there are paper, the gap between the ears.",
    art: `
###...###
#.#...#.#
#.#...#.#
#.#...#.#
###...###
.#######.
#########
##.###.##
#########
####.####
.##.#.##.
..#####..`,
  },
  {
    id: "forest-deer", title: "Forest Deer", palette: [INK], role: "boss", mechanics: ["tally", "exact-fit", "overlap"], tally: ["r4", "c2", "c9"],
    aha: "Boss: three counts lock together across the antlers. Columns 5-8 (7 2, 8, 8, 7 2) overlap on row 5, putting four ink in row 5's ringed 4; the count is met, so its other eight cells are paper and the antlers come apart from the head. Later columns 3 and 10 (ringed 5) are met by antler, prong and ear, so the cells below them are paper and the face narrows.",
    art: `
#.#......#.#
#.#.#..#.#.#
##..#..#..##
.####..####.
....####....
###.####.###
.##.####.##.
...######...
...#.##.#...
....####....
....####....
.....##.....`,
  },
  {
    id: "acorn", title: "Swallow", palette: [INK], role: "breather", mechanics: ["tally", "overlap", "fill"], tally: ["r5", "r6"],
    aha: "Breather: the forked tail is counted, not read. Row 6's ringed 2 is met as soon as columns 3 (5) and 7 (4) reach it, so the rest of row 6 is paper; row 7's ringed 3 then has exactly three cells left (columns 2, 3 and 8), so the streamer tips are all ink. Row 3's 8 and row 4's 7 overlap first and build the banking body.",
    art: `
...###...
##.###.##
.########
.#######.
.###.##..
..#...#..
.##....#.`,
  },
  {
    id: "pine-tree", title: "Pine Tree", palette: [INK], role: "practise", mechanics: ["tally", "overlap", "fill"], tally: ["r5", "c3"],
    aha: "Two crossing tallies share one cell, and that cell settles both. Column 4's ringed 8 has exactly eight possible cells once rows 1, 2, 5 and 11 are paper there, so all are ink, row 6's included. That makes seven ink in row 6, which meets its ringed 7, so row 6's ends (columns 2 and 10) are paper.",
    art: `
.....#.....
....###....
...#####...
..#######..
....###....
..#######..
.#########.
...#####...
.#########.
###########
....###....
...#####...`,
  },
  {
    id: "wandering-bear", title: "Waving Bear", palette: [INK], role: "combine", mechanics: ["tally", "exact-fit", "overlap"], tally: ["r9", "r11"],
    aha: "A count can cut a run in two. Columns 4 and 9 (2 2 6) fit twelve exactly and columns 3 (4 6) and 8 (11) overlap row 10, so row 10's ringed 4 is already met by two separate pairs: the belly between them and both edges are paper, two legs instead of one block. Later row 12's ringed 6 has only six cells left, so both feet are ink.",
    art: `
..##....##.
..########.
..#.####.#.
..###..###.
#..######..
##..####...
.##########
..#######.#
..##...##.#
..##...##..
..#######..
.###...###.`,
  },
  {
    id: "red-squirrel", title: "Red Squirrel", palette: [INK], role: "twist", mechanics: ["tally", "overlap"], tally: ["r5", "r7"],
    aha: "Twist: rows 6 and 8 both show a ringed 6, yet one closes and the other fills. Row 6 gets its six from the columns (chest in columns 2-4, tail root in 6-8), so columns 1, 5 and 9 there are paper. Row 8, the feet, has only six cells left (columns 2-4 and 6-8), so the last open one, column 4, is ink.",
    art: `
.......###.
.#....#####
###...#####
#.##..####.
####..###..
.###.###...
..######...
.###.###...`,
  },
  {
    id: "fern-frond", title: "Fern Frond", palette: [INK], role: "combine", mechanics: ["tally", "exact-fit", "overlap"], tally: ["r5", "r11"],
    aha: "The stem's neighbours are counted out. Row 8 (4 1 4) fits eleven exactly and row 7 (4 1 3) has one spare, so the leaflets and stem start inked. Row 6's ringed 6 is then met by leaflets and stem (columns 3-4, 6, 8-10), so columns 5 and 7 beside the stem are paper; row 12's ringed 3 has only columns 5-7 left, so the root is all ink.",
    art: `
......###..
.....#...#.
.....#.###.
..##.#.....
.###.#.##..
..##.#.###.
####.#.###.
####.#.####
..##.#.###.
...#.#.##..
.....#.....
....###....`,
  },
  {
    id: "inkwell-pond", title: "Heron at the Pond", palette: [INK], role: "finale", mechanics: ["tally", "overlap", "exact-fit"], tally: ["r4", "r5", "r6", "c7"],
    aha: "Finale: one long count down the heron's leg unlocks three row counts. Once rows 1-4 (head and neck) sit left of it, column 8's ringed 8 has exactly eight open cells, all ink: back, leg, waterline and reflection. That completes row 7's ringed 5, so the rest of row 7 is paper; then row 5's ringed 8 and row 6's ringed 9 close in turn under the neck.",
    art: `
..###.......
#####.......
...##.......
....##......
...########.
..#########.
....#####...
.....#.#....
###..#.#.###
.....#.#....
....#####...
..##.###.##.`,
  },
];
