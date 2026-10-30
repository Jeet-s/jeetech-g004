import { INK, type LevelSpec } from "../types";

/**
 * Island 2 — Inkwell Woods. Ink only. Introduces the TALLY clue: a ringed number counts all the ink in its line,
 * in any number of pieces. Count reached → the rest is paper; only that many cells left → they are all ink.
 * Each level turns on a different counting insight; the island ends combining tallies with exact fit and overlap.
 */
export const ISL02: LevelSpec[] = [
  {
    id: "toadstools", title: "Toadstools", palette: [INK], role: "teach", mechanics: ["tally", "fill", "x-marks"], tally: ["r3"],
    aha: "Row 4 shows a ringed 2: two ink cells in total, anywhere. Columns 3 and 4 are full 7s (the big stem), so both are already in row 4. The count is reached, so the other six cells of row 4 are paper. That gap keeps the small toadstool down: its cap is row 5 (6) and its stem in column 7 (3) runs to the ground.",
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
    aha: "Now the other way. Row 5's 2 3 2 fits nine exactly: cheek tufts at columns 1 and 9, eyes in the gaps. Columns 1 and 9 are a single 1, so row 6's ends are paper. Row 6's ringed 7 now has exactly seven cells left (columns 2-8), so all of them are ink. The ears come from columns 2-3 and 7-8 (3 2 each).",
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
    id: "barn-owl", title: "Barn Owl", palette: [INK], role: "practise", mechanics: ["tally", "x-marks", "overlap"], tally: ["r8", "r9"],
    aha: "The perch is row 10, a ringed 9: one gap in ten. Column 6 (4 3, beak and breast) leaves row 10 paper. That is the gap, so the other nine perch cells are ink. Then row 9's ringed 4 is full: columns 3, 5, 6 and 8 give the talons and tail, four certain ink, so row 9's ends are paper.",
    art: `
.#......#.
.########.
##..##..##
#.#.##.#.#
#...##...#
.##....##.
.########.
..######..
..#.##.#..
#####.####`,
  },
  {
    id: "hedgehog", title: "Hedgehog", palette: [INK], role: "practise", mechanics: ["tally", "overlap", "x-marks"], tally: ["r0", "r1"],
    aha: "Count the quills. Rows 1 and 2 show ringed 3 and 5, and the runs alone leave column 2's top cell and column 10's row 2 open. Columns 4, 6 and 8 put three quills in row 1, so its count is met and column 2 there is paper. Row 2 has four quills found and one open cell, column 10, so that cell is the fifth quill.",
    art: `
...#.#.#...
.#.#.#.#.#.
.#.#.#.#.#.
.#########.
########.##
###########
.########..
..##...##..`,
  },
  {
    id: "meadow-rabbit", title: "Lop-Eared Rabbit", palette: [INK], role: "practise", mechanics: ["tally", "overlap", "exact-fit"], tally: ["c0", "c1"],
    aha: "Tallies down the columns now. The ears hang in columns 1-2 and 10-11; the right one reads from its runs (4 and 6 1), but the left one has ringed counts. Column 1's ringed 4 is met by rows 3-6, so its row 7 is paper. Column 2's ringed 7 has exactly seven open cells: rows 2-7 and the foot in row 11. All of them are ink, and the ear hangs to row 7.",
    art: `
...#####...
.#########.
##.#####.##
##.#.#.#.##
##.#####.##
##..###..##
.#..###..#.
...#####...
..#######..
..#######..
.###...###.`,
  },
  {
    id: "forest-deer", title: "Forest Deer", palette: [INK], role: "boss", mechanics: ["tally", "exact-fit", "overlap"], tally: ["r4", "c2", "c9"],
    aha: "Boss: three counts lock together. Row 6's 3 4 3 fits twelve exactly. Columns 5-8 (7 2, 8, 8, 7 2) overlap on row 5, which puts four ink in row 5's ringed 4. The count is met, so eight cells there are paper and the antlers come apart from the head. Later, columns 3 and 10 (ringed 5) are met by antler, prong and ear, so the cells below them are paper and the face narrows.",
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
    id: "acorn", title: "Swallow", palette: [INK], role: "breather", mechanics: ["fill", "exact-fit", "overlap"],
    aha: "A breather: a swallow with its wings spread across the canvas. Row 3's 9 fills the whole width and row 2's 2 3 2 fits nine exactly (wings and head). Row 4's 7 overlaps the middle, and the forked tail (2 2, 1 1, 1 1) splays out row by row. Three easy passes.",
    art: `
...###...
##.###.##
#########
.#######.
..##.##..
..#...#..
.#.....#.`,
  },
  {
    id: "pine-tree", title: "Pine Tree", palette: [INK], role: "practise", mechanics: ["tally", "overlap", "fill"], tally: ["r5", "c3"],
    aha: "Two crossing tallies whose shared cell is the key. Column 4's ringed 8: rows 1, 2, 5 and 11 are paper there (their 1 and 3s stay centred), so exactly eight cells are left and all are ink. One of them is row 6's cell. That makes seven ink in row 6, which meets its ringed 7, so row 6's ends (columns 2 and 10) are paper.",
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
    id: "wandering-bear", title: "Waving Bear", palette: [INK], role: "combine", mechanics: ["tally", "exact-fit", "overlap"], tally: ["r7", "r11"],
    aha: "Columns 3 and 8 read 4 7, which fits twelve exactly, so the bear's sides are fixed at once. The belly hook is row 8, a ringed 3: column 1's hanging arm and the two sides make three. The count is met, so the rest of row 8 (the belly and columns 2 and 9) is paper. Last, row 12's ringed 6 has exactly six open cells, so both feet are ink.",
    art: `
..##..##..
..######.#
..#.##.#.#
..######.#
...####.##
.########.
#.######..
#.#....#..
#.#....#..
..######..
..##..##..
.###..###.`,
  },
  {
    id: "red-squirrel", title: "Red Squirrel", palette: [INK], role: "twist", mechanics: ["tally", "overlap"], tally: ["r5", "r10"],
    aha: "Twist: rows 6 and 11 both show a ringed 6, yet they go opposite ways. In row 6 the chest (columns 2-4) and the tail's root (columns 6-8) are found first, so the six are met and columns 1, 5 and 9 are paper. In row 11 (the feet) only six cells stay open, so all six are ink, and that anchors the feet.",
    art: `
.......###.
.#....#####
###...#####
#.##..####.
####..###..
.###.###...
..######...
..#######..
..#######..
..######...
.###.###...`,
  },
  {
    id: "fern-frond", title: "Fern Frond", palette: [INK], role: "combine", mechanics: ["tally", "exact-fit", "overlap"], tally: ["r4", "c3"],
    aha: "Row 7's 4 1 4 fits eleven exactly and column 6's stem (1 9) overlaps, so the leaflets grow from there. Column 4's ringed 8 is the turn: once rows 1, 3, 11 and 12 are paper, exactly eight cells are left, so the curl at row 2 and rows 4-10 are all ink. Last, row 5's ringed 7 has seven cells left, so both leaflet tips (columns 2 and 10) are ink.",
    art: `
....###....
...#..#....
.....##....
..##.#.##..
.###.#.###.
..##.#.##..
####.#.####
.###.#.###.
..##.#.##..
...#.#.#...
.....##....
......##...`,
  },
  {
    id: "inkwell-pond", title: "Heron at the Pond", palette: [INK], role: "finale", mechanics: ["tally", "overlap", "exact-fit"], tally: ["r4", "r5", "r6", "c7"],
    aha: "Masterwork: four tallies hang on column 8, the heron's leg. Once rows 1-4 (head and neck) sit left of it, column 8's ringed 8 has exactly eight open cells. All are ink: back, leg, waterline and reflection. That completes row 7's ringed 5, so the rest of row 7 is paper. Then row 5's ringed 8 and row 6's ringed 9 close in turn under the neck.",
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
