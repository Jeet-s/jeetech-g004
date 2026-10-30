setaha("toadstools", "A count already reached closes the row. Row 4 shows a ringed 2, and columns 3 and 4 (full 7s, the big stem) already put both ink there, so the other six cells of row 4 are paper. That gap keeps the small toadstool down: its cap is row 5 (6) and its stem in column 7 (3) runs to the ground.")
setaha("sleeping-fox", "When only as many cells are left as the count, they are all ink. Row 5's 2 3 2 fits nine exactly and columns 1 and 9 are a single 1, so row 6's ends are paper. Row 6's ringed 7 then has exactly seven cells left (columns 2-8), so all of them are ink and the fox's jaw appears.")
setaha("hedgehog", "Two quill rows count in opposite directions. Columns 4, 6 and 8 put three quills in row 1, so its ringed 3 is met and column 2 there is paper. Row 2's ringed 5 has four quills found and one open cell, column 10, so that cell is the fifth quill.")
setaha("forest-deer", "Boss: three counts lock together across the antlers. Columns 5-8 (7 2, 8, 8, 7 2) overlap on row 5, putting four ink in row 5's ringed 4; the count is met, so its other eight cells are paper and the antlers come apart from the head. Later columns 3 and 10 (ringed 5) are met by antler, prong and ear, so the cells below them are paper and the face narrows.")
setaha("pine-tree", "Two crossing tallies share one cell, and that cell settles both. Column 4's ringed 8 has exactly eight possible cells once rows 1, 2, 5 and 11 are paper there, so all are ink, row 6's included. That makes seven ink in row 6, which meets its ringed 7, so row 6's ends (columns 2 and 10) are paper.")
setaha("inkwell-pond", "Finale: one long count down the heron's leg unlocks three row counts. Once rows 1-4 (head and neck) sit left of it, column 8's ringed 8 has exactly eight open cells, all ink: back, leg, waterline and reflection. That completes row 7's ringed 5, so the rest of row 7 is paper; then row 5's ringed 8 and row 6's ringed 9 close in turn under the neck.")
setblock("meadow-rabbit", '''  {
    id: "meadow-rabbit", title: "Meadow Rabbit", palette: [INK], role: "practise", mechanics: ["tally", "overlap", "x-marks"], tally: ["c0", "c4"],
    aha: "Counting down the rabbit's centre line opens the space between its ears. Column 5's ringed 6 is met by the face (rows 6-9) and the chin (rows 11-12), so rows 1-5 there are paper. Column 1's ringed 9 already has four cheek cells (rows 7-10) and only rows 1-5 left, so the whole left ear is ink.",
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
''')
setblock("acorn", '''  {
    id: "acorn", title: "Swallow", palette: [INK], role: "breather", mechanics: ["fill", "exact-fit", "overlap"],
    aha: "A breather with one spare cell to place: the banking swallow's row 3 is 8 in nine. Row 2's 2 3 2 fits nine exactly, so column 1's lone 1 is spent on row 2's wingtip, row 3 starts at column 2 and runs to column 9. The forked tail (2 2, 1 1, 1 1) then splays out row by row.",
    art: `
...###...
##.###.##
.########
.#######.
..##.##..
..#...#..
.#.....#.`,
  },
''')
setblock("wandering-bear", '''  {
    id: "wandering-bear", title: "Waving Bear", palette: [INK], role: "combine", mechanics: ["tally", "exact-fit", "overlap"], tally: ["r9", "r11"],
    aha: "The bear's belly is a count already spent. Columns 4 and 9 (2 2 6) fit twelve exactly and columns 3 (4 6) and 8 (11) overlap row 10, so row 10's ringed 4 is met at once: the belly hollow and both edges there are paper. Later row 12's ringed 6 has only six cells left, so both feet are ink.",
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
''')
setblock("red-squirrel", '''  {
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
''')
setblock("fern-frond", '''  {
    id: "fern-frond", title: "Fern Frond", palette: [INK], role: "combine", mechanics: ["tally", "overlap", "x-marks"], tally: ["r5", "r11"],
    aha: "The off-centre curl leaves no mirror to copy, so two counts finish the frond. Rows 7-8 (4 1 2, 3 1 4) and column 6's 11 overlap first; then row 6's ringed 6 is met by the leaflets and stem (columns 3-4, 6, 8-10), so columns 5 and 7 beside the stem are paper. Row 12's ringed 3 has exactly three cells left (columns 5-7), so the root is all ink.",
    art: `
......###..
.....#...#.
.....#.###.
..##.#.....
.###.#.##..
..##.#.###.
####.#..##.
.###.#.####
..##.#.###.
...#.#.##..
.....#.....
....###....`,
  },
''')
